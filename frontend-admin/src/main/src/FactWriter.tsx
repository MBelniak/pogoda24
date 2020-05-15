import React from 'react';
const Copyright = require('shared24').Copyright;
const TopImage = require('shared24').TopImage;
import * as fns from 'date-fns';
import 'suneditor/dist/css/suneditor.min.css';
import suneditor from 'suneditor';
const showModal = require('shared24').showModal;
const closeModal = require('shared24').closeModal;
const LoadingIndicator = require('shared24').LoadingIndicator;
import {
    font,
    fontSize,
    image,
    list,
    horizontalRule,
    table,
    formatBlock,
    paragraphStyle,
    fontColor,
    textStyle,
    align,
    lineHeight,
    link
} from 'suneditor/src/plugins';

import {
    cloudinaryDownloadUrl,
    uploadImages
} from './helpers/CloudinaryHelper';
import { FileToUpload } from './Writer';
import { ButtonListItem } from 'suneditor/src/options';
import { fetchApi } from './helpers/fetchHelper';
import { PostType } from './Post';
import config from './config/config';
const { BACKEND_DATE_FORMAT } = config;

function findIndex(array: Image[], index) {
    let idx = -1;

    array.some(function (image, i) {
        if (image.fileToUpload.id === index) {
            idx = i;
            return true;
        }
        return false;
    });

    return idx;
}

interface Image {
    htmlElement?: HTMLImageElement;
    fileToUpload: FileToUpload;
    fileExtension: string;
}

export default class FactWriter extends React.Component<{}> {
    private editor;
    private imagesList: Image[] = [];
    private imagesSrcStack: string[] = [];
    private nextImageId = 0;
    private abortController;
    private titleInput;

    constructor(props) {
        super(props);
        this.abortController = new AbortController();
        this.titleInput = React.createRef();
        this.handleImageUploadBefore = this.handleImageUploadBefore.bind(this);
        this.handleImageUpload = this.handleImageUpload.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.reloadPage = this.reloadPage.bind(this);
        this.closeModalAndShowEditor = this.closeModalAndShowEditor.bind(this);
    }

    private handleImageUploadBefore(files: Array<File>, info: object) {
        for (const file of files) {
            let timestamp = new Date().getTime().toString();
            timestamp = timestamp.substr(0, timestamp.length - 3);
            this.imagesList.push({
                fileToUpload: {
                    id: this.nextImageId++,
                    file: file,
                    publicId: file.name + timestamp,
                    timestamp: timestamp
                },
                fileExtension: file.name
                    .slice(file.name.lastIndexOf('.'), file.name.length)
                    .toLowerCase()
            });
        }

        return true;
    }

    private handleImageUpload(
        targetImgElement: HTMLImageElement,
        index: number,
        state: string,
        imageInfo: object,
        remainingFilesCount: number
    ) {
        if (state === 'delete') {
            this.imagesList.splice(findIndex(this.imagesList, index), 1);
        } else {
            if (state === 'create') {
                const image = this.imagesList[
                    findIndex(this.imagesList, index)
                ];
                image.htmlElement = targetImgElement;
            }
        }
    }

    private handleSubmit() {
        if (!this.validateTitle()) {
            return;
        }
        showModal(<LoadingIndicator />);
        this.editor.hide();
        this.imagesSrcStack = [];

        //In this case, we first send images to cloudinary, because we're gonna need the direct URL to the image
        Promise.all(
            uploadImages(
                this.imagesList.map(image => image.fileToUpload),
                this.abortController.signal
            )
        )
            .then(responses => {
                if (responses.every(response => response && response.ok)) {
                    const jsonPromises: Promise<void>[] = [];
                    // Save url from cloudinary to images info
                    for (let i = 0; i < this.imagesList.length; ++i) {
                        if (this.imagesList[i].htmlElement) {
                            this.imagesSrcStack.push(
                                this.imagesList[i].htmlElement!!.src
                            );
                            jsonPromises.push(responses[i].json().then(response => {
                                this.imagesList[i].htmlElement!!.src =
                                    response.url;
                            }));
                        }
                    }
                    Promise.all(jsonPromises).then(() => this.sendPostToBackend());
                } else {
                    responses = responses.filter(
                        response => !response || !response.ok
                    );
                    console.log(responses.toString());
                    this.showErrorMessage(
                        'Nie udało się wysłać wszystkich plików. Ciekawostka nie została zapisana.'
                    );
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    private validateTitle() {
        if (!this.titleInput.current.value) {
            this.titleInput.current.classList.add('is-danger');
            return false;
        } else {
            this.titleInput.current.classList.remove('is-danger');
            return true;
        }
    }

    private sendPostToBackend() {
        let description = JSON.stringify(
            //editor.getContents() returns 716 000 characters  ¯\_(ツ)_/¯
            document.getElementsByClassName(
                'se-wrapper-inner se-wrapper-wysiwyg sun-editor-editable'
            )[0].innerHTML
        );
        description = description.substr(1, description.length - 2);
        const requestBodyPost = {
            postDate: fns.format(new Date(), BACKEND_DATE_FORMAT),
            postType: PostType.FACT,
            title: this.titleInput.current.value,
            description: description
        };

        return fetchApi('api/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBodyPost)
        })
            .then(response => {
                if (response && response.ok) {
                    response
                        .json()
                        .then((data: any) => {
                            if (data !== null) {
                                //post saved
                                this.showSuccessMessage();
                            } else {
                                this.showErrorMessage(
                                    'Wystąpił błąd przy zapisywaniu postu. Post nie został zapisany.'
                                );
                            }
                        })
                        .catch(error => {
                            console.log(error);
                        });
                } else {
                    console.log(response.statusText + ', ' + response.body);
                    this.showErrorMessage(
                        'Wystąpił błąd serwera. Nie udało się zapisać postu.'
                    );
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    private reloadPage() {
        location.reload();
    }

    private showSuccessMessage() {
        showModal(
            <div>
                <p className="dialogMessage">Pomyślnie zapisano ciekawostkę</p>
                <button
                    className="button is-primary"
                    style={{ float: 'right' }}
                    onClick={this.reloadPage}>
                    Ok
                </button>
            </div>
        );
    }

    private showErrorMessage(errorMessage: string) {
        showModal(
            <div>
                <p className="dialogMessage">{errorMessage}</p>
                <button
                    className="button is-primary"
                    style={{ float: 'right' }}
                    onClick={this.closeModalAndShowEditor}>
                    Ok
                </button>
            </div>
        );
    }

    private closeModalAndShowEditor() {
        closeModal();
        for (let i = 0; i < this.imagesList.length; ++i) {
            if (this.imagesList[i].htmlElement) {
                this.imagesList[i].htmlElement!!.src = this.imagesSrcStack[i];
            }
        }
        this.editor.show();
    }

    componentDidMount() {
        this.editor = suneditor.create('suneditor', {
            width: '100%',
            height: '500px',
            plugins: [
                font,
                image,
                list,
                horizontalRule,
                table,
                image,
                fontSize,
                formatBlock,
                paragraphStyle,
                fontColor,
                textStyle,
                align,
                lineHeight,
                link
            ],
            buttonList: buttonList
        });
        this.editor.onImageUpload = this.handleImageUpload;
        this.editor.onImageUploadBefore = this.handleImageUploadBefore;
    }

    componentWillUnmount() {
        this.abortController.abort();
    }

    render() {
        return (
            <div className="main">
                <section className="container">
                    <TopImage />
                    <div style={{ color: 'white', margin: '10px 0 10px 0' }}>
                        <label htmlFor="titleInput">
                            Dodaj tytuł do ciekawostki:{' '}
                        </label>
                        <input
                            style={{ marginTop: '10px' }}
                            id="titleInput"
                            className="input"
                            placeholder="Tytuł"
                            maxLength={100}
                            ref={this.titleInput}
                        />
                    </div>
                    <textarea id="suneditor" />
                    <button className="button" onClick={this.handleSubmit}>
                        Wyślij
                    </button>
                </section>
                <Copyright />
            </div>
        );
    }
}

const buttonList: ButtonListItem[] = [
    [
        'undo',
        'redo',
        'horizontalRule',
        'list',
        'table',
        'image',
        'showBlocks',
        'fullScreen',
        'preview',
        'font',
        'fontSize',
        'formatBlock',
        'paragraphStyle',
        'bold',
        'underline',
        'italic',
        'strike',
        'subscript',
        'superscript',
        'fontColor',
        'textStyle',
        'removeFormat',
        'outdent',
        'indent',
        'align',
        'lineHeight',
        'link',
        'codeView'
    ]
];
