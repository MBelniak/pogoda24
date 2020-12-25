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

import { ButtonListItem } from 'suneditor/src/options';
import { PostType } from '../../model/Post';
import config from '../../config/config';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { showModal } from '../components/modals/Modal';
import { TopImage } from '../components/TopImage';
import Copyright from '@shared/components/Copyright';
import { showActionModal } from '../components/modals/ActionModalWindow';
import { Link } from 'react-router-dom';
import FileDropper from '../components/FileDropper';
import { showInfoModal } from '../components/modals/InfoModalWindow';
import FileToUploadItem from '../writer/FileToUploadItem';
import Writer from '../writer/Writer';

const { BACKEND_DATE_FORMAT } = config;

export default class FactWriter extends Writer {
    private editor;

    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.onMainFileAdded = this.onMainFileAdded.bind(this);
        this.onRemoveMainFile = this.onRemoveMainFile.bind(this);
    }

    private initializeEditor() {
        if (this.props.postToEdit) {
            const post = this.props.postToEdit;
            let target = document.getElementsByClassName('se-wrapper')[0];
            target.innerHTML = post.description.replace(/\\"/g, '"');
            this.titleInput.current.value = post.title;
            target = document.getElementsByClassName('se-wrapper-inner')[0];
            target.setAttribute('contenteditable', 'true');
        }
    }

    protected registerImagesPresentAtCloudinary() {
        if (this.props.postToEdit) {
            const post = this.props.postToEdit;
            this.setState({
                mainImage:
                    post.imagesPublicIds.length > 0
                        ? {
                              id: 0,
                              publicId: post.imagesPublicIds[0],
                              file: null,
                              timestamp: ''
                          }
                        : undefined
            });
        }
    }

    protected handleSubmit() {
        if (!this.validateTitle()) {
            return;
        }
        showModal(<LoadingIndicator />);

        this.savePost();
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

    protected buildRequestBody() {
        const post = this.props.postToEdit;
        const description = this.getDescription();

        const requestBody = {
            postDate: format(post ? post.postDate : new Date(), BACKEND_DATE_FORMAT),
            postType: PostType.FACT,
            title: this.titleInput.current.value,
            description: description,
            imagesPublicIds: [] as string[],
            dueDate: null
        };

        if (this.props.postToEdit) {
            requestBody['id'] = this.props.postToEdit.id;
        }

        if (this.state.mainImage) {
            requestBody['imagesPublicIds'] = [this.state.mainImage.publicId];
        }

        return requestBody;
    }

    protected getDescription() {
        let target = document.getElementsByClassName('se-wrapper-inner')[0];
        target.setAttribute('contenteditable', 'false');
        target = document.getElementsByClassName('se-wrapper')[0].cloneNode(true) as HTMLElement;
        let description = JSON.stringify(target.innerHTML);
        return description.substr(1, description.length - 2);
    }

    private static reloadPage() {
        location.reload();
    }

    protected showSuccessMessage() {
        showActionModal('Pomyślnie zapisano ciekawostkę', [
            { text: 'Ok', action: this.props.postToEdit ? this.props.onFinishEditing! : FactWriter.reloadPage },
            { text: 'Przejdź do posta', action: this.goToPost }
        ]);
    }

    private onMainFileAdded(files: File[]) {
        if (files.length > 1) {
            showInfoModal('Możesz dodać tylko jedno zdjęcie.');
            return;
        }
        if (this.state.mainImage) {
            showActionModal('Już dodałeś zdjęcie. Czy chcesz je zmienić?', [
                { text: 'Tak', action: () => this.addFileToState(files[0]) },
                { text: 'Nie', action: () => {} }
            ]);
        } else {
            this.addFileToState(files[0]);
        }
        this.fileInput.current.value = null;
    }

    private addFileToState(file: File) {
        let timestamp = new Date().getTime().toString();
        timestamp = timestamp.substr(0, timestamp.length - 3);

        this.setState({
            mainImage: {
                id: 0,
                file: file,
                publicId: file.name + timestamp,
                timestamp: timestamp
            }
        });
    }

    private onRemoveMainFile() {
        this.setState({
            mainImage: undefined
        });
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
        this.initializeEditor();
        this.registerImagesPresentAtCloudinary();
    }

    componentWillUnmount() {
        this.abortController.abort();
    }

    render() {
        return (
            <div className="main">
                <section className="container is-fluid">
                    <TopImage />
                    <div className="writerForm">
                        <div style={{ color: 'white', margin: '10px 0 10px 0' }}>
                            <label style={{ fontSize: '1.2rem' }} htmlFor="titleInput">
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
                        <div className="is-divider" />
                        <p>
                            Dodaj zdjęcie główne. Będzie ono wyświetlone w skróconej wersji artykułu. Możesz przeciągnąć
                            swoje pliki z dysku na kreskowane pole:
                        </p>
                        <FileDropper onFilesAdded={this.onMainFileAdded} customText={'Upuść plik tutaj'} />
                        <p>...lub skorzystać z klasycznego dodawania plików: </p>
                        <input
                            type="button"
                            className="button"
                            value="Wybierz pliki"
                            onClick={() => document.getElementById('mapsFiles')?.click()}
                        />
                        <input
                            type="file"
                            style={{ display: 'none' }}
                            id="mapsFiles"
                            accept="image/*"
                            multiple={true}
                            ref={this.fileInput}
                            onChange={() => this.onMainFileAdded(this.fileInput.current.files)}
                        />
                        {this.state.mainImage && (
                            <>
                                <p>Obecnie wybrane zdjęcie:</p>
                                <div className="column is-half">
                                    <FileToUploadItem
                                        listId={0}
                                        file={this.state.mainImage}
                                        onRemoveFile={this.onRemoveMainFile}
                                    />
                                </div>
                            </>
                        )}
                        <div className="is-divider" />
                        <input type="button" className="button" value="Wyślij" onClick={this.handleSubmit} />
                        {this.props.postToEdit ? (
                            <input
                                type="button"
                                className="button"
                                value="Anuluj"
                                onClick={this.props.onFinishEditing}
                            />
                        ) : (
                            <Link to="/write" className="button">
                                Anuluj
                            </Link>
                        )}
                    </div>
                </section>
                <Copyright fontColor={'white'} />
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
