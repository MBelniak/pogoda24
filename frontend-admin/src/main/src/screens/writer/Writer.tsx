import React from 'react';
import config from '../../config/config';
import format from 'date-fns/format';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import FileDropper from '../components/FileDropper';
import FileToUploadItem from './FileToUploadItem';
import { default as Post, PostType } from '../../model/Post';
import { uploadImages } from '../../helpers/CloudinaryHelper';
import { fetchApi } from '../../helpers/fetchHelper';
import zonedTimeToUtc from 'date-fns-tz/zonedTimeToUtc';
import { FileToUpload } from '../../model/FileToUpload';
import { AuthenticationModal } from './AuthenticationModal';
import { closeModal, showModal } from '../components/ModalWindow';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { Copyright } from '../components/Copyright';
import { TopImage } from '../components/TopImage';
const { MAX_IMAGES_PER_POST, BACKEND_DATE_FORMAT } = config;

interface WriterProps {
    postToEdit?: Post;
    onFinishEditing?: () => void;
}

interface State {
    postType: PostType;
    filesToUpload: FileToUpload[];
}

const daysValidInputConstraint = (text: string): boolean => {
    return parseInt(text) >= 0 && parseInt(text) <= 14;
};

export default class Writer extends React.Component<WriterProps, State> {
    private fileId: number;
    private fileInput;
    private postDescriptionTextArea;
    private titleTextArea;
    private daysValidInput;
    private warningShortInput;
    private abortController;
    private savedPostId;
    private loginInput;
    private passwordInput;

    constructor(props) {
        super(props);
        this.fileId = 0;
        this.fileInput = React.createRef();
        this.postDescriptionTextArea = React.createRef();
        this.titleTextArea = React.createRef();
        this.daysValidInput = React.createRef();
        this.warningShortInput = React.createRef();
        this.loginInput = React.createRef();
        this.passwordInput = React.createRef();
        this.abortController = new AbortController();
        if (this.props.postToEdit) {
            this.savedPostId = this.props.postToEdit.id;
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onFilesAdded = this.onFilesAdded.bind(this);
        this.clearEverything = this.clearEverything.bind(this);
        this.goToPost = this.goToPost.bind(this);
        this.validateField = this.validateField.bind(this);
        this.onRemoveFile = this.onRemoveFile.bind(this);
        this.onMoveForward = this.onMoveForward.bind(this);
        this.onMoveBackward = this.onMoveBackward.bind(this);
        this.handleLoginClick = this.handleLoginClick.bind(this);
        this.state = {
            postType: this.props.postToEdit ? this.props.postToEdit.postType : PostType.FORECAST,
            filesToUpload: []
        };
    }

    private registerImagesPresentAtCloudinary(post: Post) {
        const filesToUpload: FileToUpload[] = [];
        if (post.imagesPublicIds) {
            for (let i = 0; i < post.imagesPublicIds.length; ++i) {
                //only publicId and file as null are used
                filesToUpload.push({
                    id: this.fileId++,
                    publicId: post.imagesPublicIds[i],
                    file: null,
                    timestamp: ''
                });
            }
        }
        this.setState({ filesToUpload: filesToUpload });
    }

    private onFilesAdded(files: File[]) {
        if (this.state.filesToUpload.length + files.length > MAX_IMAGES_PER_POST) {
            showModal(
                <div>
                    <p className="dialogMessage">Do jednego postu możesz dodać tylko 6 plików!</p>
                    <button className="button is-primary" style={{ float: 'right' }} onClick={closeModal}>
                        Ok
                    </button>
                </div>
            );
            this.fileInput.current.value = null;
            return;
        }

        let filesToBePushed: FileToUpload[] = [];
        for (let file of files) {
            let timestamp = new Date().getTime().toString();
            timestamp = timestamp.substr(0, timestamp.length - 3);
            filesToBePushed.push({
                id: this.fileId++,
                file: file,
                publicId: file.name + timestamp,
                timestamp: timestamp
            });
        }
        this.setState({ filesToUpload: [...this.state.filesToUpload, ...filesToBePushed] });
        this.fileInput.current.value = null;
    }

    private validateField(htmlInput, additionalConstraint?: (value) => boolean) {
        if (!htmlInput.value || (additionalConstraint ? !additionalConstraint(htmlInput.value) : false)) {
            htmlInput.classList.add('is-danger');
            return false;
        } else {
            htmlInput.classList.remove('is-danger');
            return true;
        }
    }

    private handleSubmit(event) {
        event.preventDefault();
        let formValid = true;
        if (this.state.postType === PostType.WARNING) {
            formValid = this.validateField(this.daysValidInput.current, daysValidInputConstraint);
            formValid = this.validateField(this.warningShortInput.current) && formValid;
        }
        formValid = formValid && this.validateField(this.titleTextArea.current);

        if (!formValid) return;

        showModal(<LoadingIndicator />);
        this.savePost();
    }

    private savePost(authHeader?: string) {
        this.sendPostToBackend(authHeader)
            .then(response => {
                if (response && (response.status === 201 || response.status === 200)) {
                    response
                        .text()
                        .then((postIdOrPostHash: any) => {
                            if (this.props.postToEdit) {
                                if (postIdOrPostHash !== null) {
                                    this.saveImagesToCloudinary(postIdOrPostHash);
                                } else {
                                    this.showErrorMessage(
                                        'Wystąpił błąd przy zapisywaniu postu. Post nie został zapisany.'
                                    );
                                }
                            } else if (postIdOrPostHash !== null) {
                                this.savedPostId = postIdOrPostHash;
                                //post saved, send images to cloudinary
                                this.saveImagesToCloudinary();
                            } else {
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
                    showModal(
                        <AuthenticationModal
                            handleLoginClick={this.handleLoginClick}
                            loginInputRef={this.loginInput}
                            passwordInputRef={this.passwordInput}
                            authFailed={typeof authHeader !== 'undefined'}
                        />
                    );
                } else {
                    response.text().then(text => {
                        console.log(text);
                    });
                    this.showErrorMessage('Wystąpił błąd serwera. Nie udało się zapisać postu.');
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    private sendPostToBackend(authHeader?: string): Promise<Response> {
        function calculateDueDate(days: number): string {
            return format(
                new Date(new Date().setHours(0, 0, 0, 0) + (days + 1) * 24 * 3600 * 1000),
                BACKEND_DATE_FORMAT
            );
        }

        const post = this.props.postToEdit;

        const requestBody = {
            postDate: format(post ? post.postDate : new Date(), BACKEND_DATE_FORMAT),
            postType: this.state.postType.toString(),
            title: this.titleTextArea.current.value,
            description: this.postDescriptionTextArea.current.value,
            imagesPublicIds: [] as string[],
            dueDate:
                this.state.postType === PostType.WARNING
                    ? calculateDueDate(parseInt(this.daysValidInput.current.value))
                    : null,
            shortDescription: this.state.postType === PostType.WARNING ? this.warningShortInput.current.value : null
        };

        if (this.props.postToEdit) {
            requestBody['id'] = this.props.postToEdit.id;
        }

        const uploadedFilesIdsOrdered: string[] = [];
        for (let i = 0; i < this.state.filesToUpload.length; ++i) {
            uploadedFilesIdsOrdered.push(this.state.filesToUpload[i].publicId!!);
        }
        requestBody['imagesPublicIds'] = uploadedFilesIdsOrdered;

        let headers = new Headers();

        if (authHeader) {
            headers.append('Authorization', authHeader);
        }

        headers.append('Content-Type', 'application/json');

        return fetchApi('api/posts' + (post ? '?temporary=true' : ''), {
            method: post ? 'PUT' : 'POST',
            headers: headers,
            body: JSON.stringify(requestBody)
        });
    }

    private saveImagesToCloudinary(postHash?: string) {
        const uploadPromises: Promise<Response>[] = uploadImages(this.state.filesToUpload, this.abortController.signal);
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
                    this.showErrorMessage('Nie udało się wysłać wszystkich plików. Post nie został zapisany.');
                    postHash ? this.abortPostUpdate(postHash) : this.removePostFromBackend(this.savedPostId);
                }
            })
            .catch(error => {
                console.log(error);
                postHash ? this.abortPostUpdate(postHash) : this.removePostFromBackend(this.savedPostId);
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

    //Save temporarily saved changes to the database
    private continueSavingPostToBackend(hash: string) {
        fetchApi('api/posts/continuePostUpdate/' + hash + '?success=true')
            .then(response => {
                if (response && response.ok) {
                    this.showSuccessMessage();
                } else {
                    console.log(response.statusText + ', ' + response.body);
                    this.showErrorMessage('Wystąpił błąd przy zapisywaniu posta.');
                }
            })
            .catch(error => {
                console.log(error);
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

    private showSuccessMessage() {
        let postType;
        switch (this.state.postType) {
            case PostType.FORECAST: {
                postType = 'prognozę.';
                break;
            }
            case PostType.WARNING: {
                postType = 'ostrzeżenie.';
                break;
            }
        }
        showModal(
            <div>
                <p className="dialogMessage">Pomyślnie zapisano {postType}</p>
                <button
                    className="button is-primary"
                    style={{ float: 'right' }}
                    onClick={this.props.postToEdit ? this.props.onFinishEditing : this.clearEverything}>
                    Ok
                </button>
                <button className="button is-secondary" style={{ float: 'right' }} onClick={this.goToPost}>
                    Przejdź do posta
                </button>
            </div>
        );
    }

    private showErrorMessage(errorMessage: string) {
        showModal(
            <div>
                <p className="dialogMessage">{errorMessage}</p>
                <button className="button is-primary" style={{ float: 'right' }} onClick={closeModal}>
                    Ok
                </button>
            </div>
        );
    }

    private handleLoginClick() {
        const loginValid = this.validateField(this.loginInput.current);
        const passwordValid = this.validateField(this.passwordInput.current);
        if (!(loginValid && passwordValid)) {
            return;
        }
        const authHeader =
            'Basic ' + window.btoa(this.loginInput.current.value + ':' + this.passwordInput.current.value);
        showModal(<LoadingIndicator />);
        this.savePost(authHeader);
    }

    private clearEverything() {
        this.setState({
            postType: PostType.FORECAST,
            filesToUpload: []
        });
        this.fileInput.current.value = null;
        this.postDescriptionTextArea.current.value = null;
        this.titleTextArea.current.value = null;
        this.savedPostId = undefined;
        closeModal();
    }

    private goToPost() {
        const origin = location.href.split('/')[0];
        location.href = origin + '/posts/' + this.savedPostId;
    }

    private onRemoveFile(fileId: number) {
        this.setState({
            filesToUpload: this.state.filesToUpload.filter(file => file.id != fileId)
        });
    }

    private onMoveForward(idInList: number) {
        const currentList = [...this.state.filesToUpload];
        currentList.splice(idInList + 1, 0, currentList.splice(idInList, 1)[0]);
        if (idInList < currentList.length - 1) {
            this.setState({
                filesToUpload: currentList
            });
        }
    }

    private onMoveBackward(idInList: number) {
        const currentList = [...this.state.filesToUpload];

        currentList.splice(idInList - 1, 0, currentList.splice(idInList, 1)[0]);

        if (idInList > 0) {
            this.setState({
                filesToUpload: currentList
            });
        }
    }

    private renderForWarning() {
        return (
            <div className="columns">
                <div className="column is-half">
                    <label htmlFor="warningDaysValidInput">
                        Czas trwania ostrzeżenia (0 = do końca dzisiejszego dnia, max 14):{' '}
                    </label>
                    <br />
                    <input
                        id="warningDaysValidInput"
                        className="input daysValidInput"
                        type="number"
                        required={true}
                        ref={this.daysValidInput}
                        min="0"
                        max="14"
                        defaultValue={
                            this.props.postToEdit
                                ? this.props.postToEdit.dueDate
                                    ? differenceInCalendarDays(
                                          zonedTimeToUtc(this.props.postToEdit.dueDate, 'Europe/Warsaw'),
                                          this.props.postToEdit.postDate
                                      ) - 1
                                    : ''
                                : ''
                        }
                        onInput={e => {
                            if (this.daysValidInput.current.value.length > 2)
                                this.daysValidInput.current.value = this.daysValidInput.current.value.slice(0, 2);
                        }}
                        onKeyUp={() => {
                            this.validateField(this.daysValidInput.current, daysValidInputConstraint);
                        }}
                        onBlur={() => this.validateField(this.daysValidInput.current, daysValidInputConstraint)}
                    />
                    <br />
                    <label htmlFor="warningShortInput">
                        Krótki opis (zostanie wyświetlony na pasku u góry strony):{' '}
                    </label>
                    <br />
                    <input
                        id="warningShortInput"
                        type="text"
                        className="input"
                        required={true}
                        maxLength={80}
                        ref={this.warningShortInput}
                        defaultValue={this.props.postToEdit ? this.props.postToEdit.shortDescription : ''}
                        onKeyUp={e => this.validateField(e.target)}
                        onBlur={e => this.validateField(e.target)}
                    />
                </div>
                <div className="column is-half" />
            </div>
        );
    }

    componentDidMount() {
        if (this.props.postToEdit) {
            //images coming from cloudinary let's add to state. They will be recognized by null file
            this.registerImagesPresentAtCloudinary(this.props.postToEdit);
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
                    {this.props.postToEdit ? (
                        <h2 className="title">Edytuj post.</h2>
                    ) : (
                        <>
                            <h2 className="title">Witaj w edytorze wpisów.</h2>
                            <h2 className="title is-5">Możesz tutaj tworzyć nowe posty do umieszczenia na stronie.</h2>
                        </>
                    )}
                    <div className="writerForm">
                        <div className="columns">
                            <div className="column">
                                <p>Tytuł: </p>
                                <input
                                    required={true}
                                    maxLength={100}
                                    placeholder="Tytuł"
                                    ref={this.titleTextArea}
                                    defaultValue={this.props.postToEdit ? this.props.postToEdit.title : ''}
                                    className="input"
                                    onKeyUp={e => this.validateField(e.target)}
                                    onBlur={e => this.validateField(e.target)}
                                />
                                <p>Opis: </p>
                                <textarea
                                    required={true}
                                    cols={100}
                                    rows={10}
                                    placeholder="Treść posta..."
                                    ref={this.postDescriptionTextArea}
                                    defaultValue={this.props.postToEdit ? this.props.postToEdit.description : ''}
                                    className="textarea"
                                />
                            </div>
                            <div className="column">
                                <p>Typ postu: </p>
                                <input
                                    type="radio"
                                    id="forecast"
                                    name="postType"
                                    value="Prognoza"
                                    checked={this.state.postType === PostType.FORECAST}
                                    onChange={() =>
                                        this.setState({
                                            postType: PostType.FORECAST
                                        })
                                    }
                                />
                                <label htmlFor="forecast"> Prognoza</label>
                                <br />
                                <input
                                    type="radio"
                                    id="warning"
                                    name="postType"
                                    value="Ostrzeżenie"
                                    checked={this.state.postType === PostType.WARNING}
                                    onChange={() =>
                                        this.setState({
                                            postType: PostType.WARNING
                                        })
                                    }
                                />
                                <label htmlFor="warning"> Ostrzeżenie</label>
                            </div>
                        </div>
                        <p>
                            Dodaj mapki z prognozą lub ostrzeżeniem. Możesz przeciągnąć swoje pliki z dysku na
                            kreskowane pole:
                        </p>
                        <FileDropper onFilesAdded={this.onFilesAdded} />
                        <p>...lub skorzystać z klasycznego dodawania plików: </p>
                        <input
                            type="button"
                            className="button"
                            id="loadFile"
                            value="Wybierz pliki"
                            onClick={() => document.getElementById('mapsFiles')?.click()}
                        />
                        <input
                            type="file"
                            id="mapsFiles"
                            style={{ display: 'none' }}
                            accept="image/*"
                            multiple={true}
                            ref={this.fileInput}
                            onChange={() => this.onFilesAdded(this.fileInput.current.files)}
                        />
                        <p>Pamiętaj, aby przed wysłaniem plików ustawić je w odpowiedniej kolejnośći!</p>
                        <p>Obecnie dodane pliki:</p>
                        <div className="columns is-multiline">
                            {this.state.filesToUpload.map((file, key) => {
                                return (
                                    <div key={key} className="column is-one-quarter">
                                        <FileToUploadItem
                                            listId={key}
                                            file={file}
                                            onRemoveFile={this.onRemoveFile}
                                            onMoveForward={this.onMoveForward}
                                            onMoveBackward={this.onMoveBackward}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                        <div className="is-divider" />
                        {this.state.postType === PostType.WARNING ? this.renderForWarning() : null}
                        <input type="submit" className="button" value="Wyślij" onClick={this.handleSubmit} />
                    </div>
                </section>
                <Copyright />
            </div>
        );
    }
}
