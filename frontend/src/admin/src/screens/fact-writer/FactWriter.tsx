import React from 'react';
import format from 'date-fns/format';
import suneditor from 'suneditor';
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

import { uploadImages } from '../../helpers/CloudinaryHelper';
import { PostImage } from '../../model/PostImage';
import { ButtonListItem } from 'suneditor/src/options';
import { fetchApi } from '../../helpers/fetchHelper';
import { default as Post, PostType } from '../../model/Post';
import config from '../../config/config';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { closeModal, showModal } from '../components/modals/Modal';
import { TopImage } from '../components/TopImage';
import { Copyright } from '../components/Copyright';
import { showActionModal } from '../components/modals/ActionModalWindow';
import { validateField } from '../../helpers/ValidateField';
import { showAuthModal } from '../components/modals/AuthenticationModal';
const { BACKEND_DATE_FORMAT } = config;

function findIndex(array: Image[], index) {
    let idx = -1;

    array.some(function (image, i) {
        if (image.postImage.id === index) {
            idx = i;
            return true;
        }
        return false;
    });

    return idx;
}

interface Image {
    htmlElement?: HTMLImageElement;
    postImage: PostImage;
    fileExtension: string;
}

export default class FactWriter extends React.Component<{ postToEdit?: Post }> {
    private editor;
    private imagesList: Image[] = [];
    private imagesSrcQueue: string[] = [];
    private nextImageId = 0;
    private abortController;
    private titleInput;
    private loginInput;
    private passwordInput;

    constructor(props) {
        super(props);
        this.abortController = new AbortController();
        this.titleInput = React.createRef();
        this.loginInput = React.createRef();
        this.passwordInput = React.createRef();
        this.handleImageUploadBefore = this.handleImageUploadBefore.bind(this);
        this.handleImageUpload = this.handleImageUpload.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.reloadPage = this.reloadPage.bind(this);
        this.closeModalAndShowEditor = this.closeModalAndShowEditor.bind(this);
        this.handleLoginClick = this.handleLoginClick.bind(this);
    }

    private initializeEditor(post: Post) {
        let target = document.getElementsByClassName('se-wrapper')[0];
        target.innerHTML = post.description.replace(/\\"/g, '"');
    }

    private handleImageUploadBefore(files: Array<File>, info: object) {
        for (const file of files) {
            let timestamp = new Date().getTime().toString();
            timestamp = timestamp.substr(0, timestamp.length - 3);
            this.imagesList.push({
                postImage: {
                    id: this.nextImageId++,
                    file: file,
                    publicId: file.name + timestamp,
                    timestamp: timestamp
                },
                fileExtension: file.name.slice(file.name.lastIndexOf('.'), file.name.length).toLowerCase()
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
                const image = this.imagesList[findIndex(this.imagesList, index)];
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
        this.imagesSrcQueue = [];

        //In this case, we first send images to cloudinary, because we're gonna need the direct URL to the image
        Promise.all(
            uploadImages(
                this.imagesList.map(image => image.postImage),
                this.abortController.signal
            )
        )
            .then(responses => {
                if (responses.every(response => response && response.ok)) {
                    const jsonPromises: Promise<void>[] = [];
                    // Save url from cloudinary to images info
                    for (let i = 0; i < this.imagesList.length; ++i) {
                        if (this.imagesList[i].htmlElement) {
                            this.imagesSrcQueue.push(
                                //save local images urls in case upload is not successful
                                this.imagesList[i].htmlElement!!.src
                            );
                            jsonPromises.push(
                                responses[i].json().then(response => {
                                    this.imagesList[i].htmlElement!!.src = response.url;
                                })
                            );
                        }
                    }
                    Promise.all(jsonPromises).then(() => this.sendPostToBackend());
                } else {
                    responses = responses.filter(response => !response || !response.ok);
                    console.log(responses.toString());
                    this.showErrorMessage('Nie udało się wysłać wszystkich plików. Ciekawostka nie została zapisana.');
                }
            })
            .catch(error => {
                console.log(error);
                this.showErrorMessage('Nie udało się wysłać wszystkich plików. Ciekawostka nie została zapisana.');
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

    private sendPostToBackend(authHeader?: string) {
        const target = document.getElementsByClassName('se-wrapper')[0].cloneNode(true) as HTMLElement;
        let description = JSON.stringify(target.innerHTML);
        description = description.substr(1, description.length - 2);
        const requestBodyPost = {
            postDate: format(new Date(), BACKEND_DATE_FORMAT),
            postType: PostType.FACT,
            title: this.titleInput.current.value,
            description: description
        };

        let headers = new Headers();

        if (authHeader) {
            headers.append('Authorization', authHeader);
        }

        headers.append('Content-Type', 'application/json');

        return fetchApi('api/posts', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(requestBodyPost)
        })
            .then(response => {
                if (response && response.ok) {
                    response
                        .text()
                        .then((data: any) => {
                            if (data !== null) {
                                //post saved
                                this.showSuccessMessage();
                            } else {
                                this.revertImageSrcChange();
                                this.showErrorMessage(
                                    'Wystąpił błąd przy zapisywaniu postu. Post nie został zapisany.'
                                );
                            }
                        })
                        .catch(error => {
                            console.log(error);
                        });
                } else if (response.status === 401) {
                    //user is not authenticated
                    showAuthModal({
                        handleLoginClick: this.handleLoginClick,
                        loginInputRef: this.loginInput,
                        passwordInputRef: this.passwordInput,
                        authFailed: typeof authHeader !== 'undefined'
                    });
                } else {
                    console.log(response.status);
                    console.log(response.statusText + ', ' + response.body);
                    this.revertImageSrcChange();
                    this.showErrorMessage('Wystąpił błąd serwera. Nie udało się zapisać postu.');
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
        showActionModal('Pomyślnie zapisano ciekawostkę', [{ text: 'Ok', action: this.reloadPage }]);
    }

    private showErrorMessage(errorMessage: string) {
        showActionModal(errorMessage, [{ text: 'Ok', action: this.closeModalAndShowEditor }]);
    }

    private handleLoginClick() {
        const loginValid = validateField(this.loginInput.current);
        const passwordValid = validateField(this.passwordInput.current);
        if (!(loginValid && passwordValid)) {
            return;
        }
        const authHeader =
            'Basic ' + window.btoa(this.loginInput.current.value + ':' + this.passwordInput.current.value);
        showModal(<LoadingIndicator />);
        this.sendPostToBackend(authHeader);
    }

    private closeModalAndShowEditor() {
        closeModal();
        this.editor.show();
    }

    private revertImageSrcChange() {
        for (let i = 0; i < this.imagesList.length; ++i) {
            if (this.imagesList[i].htmlElement) {
                this.imagesList[i].htmlElement!!.src = this.imagesSrcQueue[i];
            }
        }
    }

    componentDidMount() {
        this.editor = suneditor.create('suneditor', {
            width: '100%',
            minHeight: '500px',
            height: '100%',
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
        if (this.props.postToEdit) {
            this.initializeEditor(this.props.postToEdit);
        }
    }

    componentWillUnmount() {
        this.abortController.abort();
    }

    render() {
        return (
            <div className="main">
                <section className="container is-fluid">
                    <TopImage />
                    <div style={{ color: 'white', margin: '10px 0 10px 0' }}>
                        <label htmlFor="titleInput">Dodaj tytuł do ciekawostki: </label>
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
