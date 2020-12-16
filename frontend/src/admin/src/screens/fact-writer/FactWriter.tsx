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

import { PostImage } from '../../model/PostImage';
import { ButtonListItem } from 'suneditor/src/options';
import { fetchApi } from '../../helpers/fetchHelper';
import { default as Post, PostType } from '../../model/Post';
import config from '../../config/config';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { closeModal, showModal } from '../components/modals/Modal';
import { TopImage } from '../components/TopImage';
import Copyright from '@shared/components/Copyright';
import { showActionModal } from '../components/modals/ActionModalWindow';
import { validateField } from '../../helpers/ValidateField';
import { showAuthModal } from '../components/modals/AuthenticationModal';
import { Link } from 'react-router-dom';
import FileDropper from '../components/FileDropper';
import { showInfoModal } from '../components/modals/InfoModalWindow';
import FileToUploadItem from '../writer/FileToUploadItem';
import { uploadImages } from '../../helpers/CloudinaryHelper';

const { BACKEND_DATE_FORMAT } = config;

export default class FactWriter extends React.Component<
    { postToEdit?: Post; onFinishEditing?: () => void },
    { mainImage?: PostImage }
> {
    private editor;
    private abortController;
    private titleInput;
    private loginInput;
    private passwordInput;
    private fileInput;
    private savedPostId;

    constructor(props) {
        super(props);
        this.abortController = new AbortController();
        this.titleInput = React.createRef();
        this.loginInput = React.createRef();
        this.passwordInput = React.createRef();
        this.fileInput = React.createRef();

        if (props.postToEdit) {
            this.savedPostId = props.postToEdit.id;
        }
        this.state = { mainImage: undefined };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.reloadPage = this.reloadPage.bind(this);
        this.closeModalAndShowEditor = this.closeModalAndShowEditor.bind(this);
        this.handleLoginClick = this.handleLoginClick.bind(this);
        this.onMainFileAdded = this.onMainFileAdded.bind(this);
        this.onRemoveMainFile = this.onRemoveMainFile.bind(this);
    }

    private initializeEditor(post: Post) {
        let target = document.getElementsByClassName('se-wrapper')[0];
        target.innerHTML = post.description.replace(/\\"/g, '"');
        this.titleInput.current.value = post.title;
        target = document.getElementsByClassName('se-wrapper-inner')[0];
        target.setAttribute('contenteditable', 'true');
    }

    private getDescriptionFromEditor() {
        let target = document.getElementsByClassName('se-wrapper-inner')[0];
        target.setAttribute('contenteditable', 'false');
        target = document.getElementsByClassName('se-wrapper')[0].cloneNode(true) as HTMLElement;
        let description = JSON.stringify(target.innerHTML);
        return description.substr(1, description.length - 2);
    }

    private handleSubmit() {
        if (!this.validateTitle()) {
            return;
        }
        showModal(<LoadingIndicator />);
        this.editor.hide();

        this.savePost();
    }

    private savePost(authHeader?: string) {
        this.sendPostToBackend()
            .then(response => {
                if (response && response.ok) {
                    if (this.state.mainImage && this.state.mainImage.file !== null) {
                        response
                            .text()
                            .then((postIdOrPostHash: any) => {
                                if (this.props.postToEdit) {
                                    if (postIdOrPostHash !== null) {
                                        const uploadPromises = uploadImages(
                                            [this.state.mainImage!],
                                            this.abortController.signal
                                        );
                                        this.afterImagesSaved(uploadPromises, postIdOrPostHash);
                                    } else {
                                        showInfoModal(
                                            'Wystąpił błąd przy zapisywaniu postu. Post nie został zapisany.'
                                        );
                                    }
                                } else if (postIdOrPostHash !== null) {
                                    // we get postId from backend
                                    this.savedPostId = postIdOrPostHash;
                                    //post saved, send images to cloudinary
                                    const uploadPromises = uploadImages(
                                        [this.state.mainImage!],
                                        this.abortController.signal
                                    );
                                    if (uploadPromises.length > 0) {
                                        this.afterImagesSaved(uploadPromises);
                                    } else {
                                        this.showSuccessMessage();
                                    }
                                } else {
                                    showInfoModal('Wystąpił błąd przy zapisywaniu postu. Post nie został zapisany.');
                                }
                            })
                            .catch(error => {
                                console.log(error);
                            });
                    }
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
                    this.showErrorMessage('Wystąpił błąd serwera. Nie udało się zapisać postu.');
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

    private sendPostToBackend(authHeader?: string) {
        const description = this.getDescriptionFromEditor();
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

        const post = this.props.postToEdit;
        return fetchApi('api/posts' + (post ? '?temporary=true' : ''), {
            method: post ? 'PUT' : 'POST',
            headers: headers,
            body: JSON.stringify(requestBodyPost)
        });
    }

    private afterImagesSaved(uploadPromises: Promise<Response>[], postHash?: string) {
        Promise.all(uploadPromises)
            .then(responses => {
                if (responses.every(response => response && response.ok)) {
                    //all images uploaded successfully
                    if (postHash) {
                        this.continueSavingPostToBackend(postHash);
                    } else {
                        this.showSuccessMessage();
                    }
                } else {
                    responses = responses.filter(response => !response || !response.ok);
                    console.log(responses.toString());
                    showInfoModal('Nie udało się wysłać wszystkich plików. Post nie został zapisany.');
                    postHash ? this.abortPostUpdate(postHash) : this.removePostFromBackend(this.savedPostId);
                }
            })
            .catch(error => {
                console.log(error);
                postHash ? this.abortPostUpdate(postHash) : this.removePostFromBackend(this.savedPostId);
            });
    }

    //Save temporarily saved changes to the database
    private continueSavingPostToBackend(hash: string) {
        fetchApi('api/posts/continuePostUpdate/' + hash + '?success=true')
            .then(response => {
                if (response && response.ok) {
                    this.showSuccessMessage();
                } else {
                    console.log(response.statusText + ', ' + response.body);
                    showInfoModal('Wystąpił błąd przy zapisywaniu posta.');
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    //Remove post changes, that are temporarily saved in backend
    private abortPostUpdate(hash: string) {
        fetchApi('api/posts/continuePostUpdate/' + hash + '?success=false')
            .then(response => {
                if (response && response.ok) {
                    console.log('Post update aborted.');
                } else {
                    console.log('Cannot abort. Hash: ' + hash + '. Server response: ' + response);
                }
            })
            .catch(error => {
                console.log('Error while aborting update. Error message: ' + error);
            });
    }

    private removePostFromBackend(postId: number) {
        fetchApi('api/posts/' + postId, {
            method: 'DELETE'
        })
            .then(response => {
                if (response && response.ok) {
                    console.log('Removed post with id: ' + postId);
                } else {
                    console.log('Cannot remove post with id: ' + postId + '. Server response: ' + response);
                }
            })
            .catch(error => {
                console.log('Error while deleting post. Error message: ' + error);
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
        this.savePost(authHeader);
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

    private closeModalAndShowEditor() {
        closeModal();
        this.editor.show();
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
        if (this.props.postToEdit) {
            this.initializeEditor(this.props.postToEdit);
            this.setState({
                mainImage:
                    this.props.postToEdit.imagesPublicIds.length > 0
                        ? {
                              id: 0,
                              publicId: this.props.postToEdit.imagesPublicIds[0],
                              file: null,
                              timestamp: ''
                          }
                        : undefined
            });
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
                    <div className="writerForm">
                        <div style={{ color: 'white', margin: '10px 0 10px 0' }}>
                            <p className="fontSizeLarge">
                                Uwaga! Nie dodawaj zdjęć ze schowka. Zamiast tego, użyj przyciku "Image".{' '}
                            </p>
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
