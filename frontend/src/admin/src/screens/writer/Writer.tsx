import React from 'react';
import config from '../../config/config';
import format from 'date-fns/format';
import FileDropper from '../components/FileDropper';
import FileToUploadItem from './FileToUploadItem';
import { default as Post, PostType } from '../../model/Post';
import { uploadImages } from '../../helpers/CloudinaryHelper';
import { fetchApi } from '../../helpers/fetchHelper';
import { PostImage } from '../../model/PostImage';
import { closeModal, showModal } from '../components/modals/Modal';
import { showInfoModal } from '../components/modals/InfoModalWindow';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { Copyright } from '../components/Copyright';
import { TopImage } from '../components/TopImage';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { showActionModal } from '../components/modals/ActionModalWindow';
import { Link } from 'react-router-dom';
import { registerLocale } from 'react-datepicker';
import pl from 'date-fns/locale/pl';
import addDays from 'date-fns/addDays';
import { validateField } from '../../helpers/ValidateField';
import { showAuthModal } from '../components/modals/AuthenticationModal';
registerLocale('pl', pl);
const { MAX_IMAGES_PER_POST, BACKEND_DATE_FORMAT } = config;

interface WriterProps {
    postToEdit?: Post;
    onFinishEditing?: () => void;
}

interface State {
    postType: PostType;
    warningDueDate: Date;
    postImages: PostImage[];
}

export default class Writer extends React.Component<WriterProps, State> {
    private fileId: number;
    private fileInput;
    private postDescriptionTextArea;
    private titleTextArea;
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
        this.warningShortInput = React.createRef();
        this.loginInput = React.createRef();
        this.passwordInput = React.createRef();
        this.abortController = new AbortController();
        if (this.props.postToEdit) {
            this.savedPostId = this.props.postToEdit.id;
        }
        this.state = {
            postType: this.props.postToEdit ? this.props.postToEdit.postType : PostType.FORECAST,
            warningDueDate: this.props.postToEdit ? this.props.postToEdit.dueDate || new Date() : new Date(),
            postImages: []
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onFilesAdded = this.onFilesAdded.bind(this);
        this.clearEverything = this.clearEverything.bind(this);
        this.goToPost = this.goToPost.bind(this);
        this.onRemoveFile = this.onRemoveFile.bind(this);
        this.onMoveForward = this.onMoveForward.bind(this);
        this.onMoveBackward = this.onMoveBackward.bind(this);
        this.handleLoginClick = this.handleLoginClick.bind(this);
        this.handleWarningDueDateChange = this.handleWarningDueDateChange.bind(this);
    }

    private registerImagesPresentAtCloudinary(post: Post) {
        const postImages: PostImage[] = [];
        if (post.imagesPublicIds) {
            for (let i = 0; i < post.imagesPublicIds.length; ++i) {
                //only publicId and file as null are used
                postImages.push({
                    id: this.fileId++,
                    publicId: post.imagesPublicIds[i],
                    file: null,
                    timestamp: ''
                });
            }
        }
        this.setState({ postImages: postImages });
    }

    private onFilesAdded(files: File[]) {
        if (this.state.postImages.length + files.length > MAX_IMAGES_PER_POST) {
            showInfoModal('Do jednego postu możesz dodać tylko 6 plików!');
            this.fileInput.current.value = null;
            return;
        }

        let filesToBeAdded: PostImage[] = [];
        for (let file of files) {
            let timestamp = new Date().getTime().toString();
            timestamp = timestamp.substr(0, timestamp.length - 3);
            filesToBeAdded.push({
                id: this.fileId++,
                file: file,
                publicId: file.name + timestamp,
                timestamp: timestamp
            });
        }
        this.setState({ postImages: [...this.state.postImages, ...filesToBeAdded] });
        this.fileInput.current.value = null;
    }

    private handleSubmit(event) {
        event.preventDefault();
        let formValid = true;
        if (this.state.postType === PostType.WARNING) {
            formValid = validateField(this.warningShortInput.current) && formValid;
        }
        formValid = formValid && validateField(this.titleTextArea.current);

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
                                    showInfoModal('Wystąpił błąd przy zapisywaniu postu. Post nie został zapisany.');
                                }
                            } else if (postIdOrPostHash !== null) {
                                this.savedPostId = postIdOrPostHash;
                                //post saved, send images to cloudinary
                                this.saveImagesToCloudinary();
                            } else {
                                showInfoModal('Wystąpił błąd przy zapisywaniu postu. Post nie został zapisany.');
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
                    response.text().then(text => {
                        console.log(text);
                    });
                    showInfoModal('Wystąpił błąd serwera. Nie udało się zapisać postu.');
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    private sendPostToBackend(authHeader?: string): Promise<Response> {
        const post = this.props.postToEdit;

        const requestBody = {
            postDate: format(post ? post.postDate : new Date(), BACKEND_DATE_FORMAT),
            postType: this.state.postType.toString(),
            title: this.titleTextArea.current.value,
            description: this.postDescriptionTextArea.current.value,
            imagesPublicIds: [] as string[],
            dueDate:
                this.state.postType === PostType.WARNING
                    ? format(this.state.warningDueDate, BACKEND_DATE_FORMAT)
                    : null,
            shortDescription: this.state.postType === PostType.WARNING ? this.warningShortInput.current.value : null
        };

        if (this.props.postToEdit) {
            requestBody['id'] = this.props.postToEdit.id;
        }

        const uploadedFilesIdsOrdered: string[] = [];
        for (let i = 0; i < this.state.postImages.length; ++i) {
            uploadedFilesIdsOrdered.push(this.state.postImages[i].publicId!!);
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
        const uploadPromises: Promise<Response>[] = uploadImages(this.state.postImages, this.abortController.signal);
        if (uploadPromises.length > 0) {
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
        } else if (postHash) {
            this.continueSavingPostToBackend(postHash);
        } else {
            this.showSuccessMessage();
        }
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
                    showInfoModal('Wystąpił błąd przy zapisywaniu posta.');
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
        showActionModal(`Pomyślnie zapisano ${postType}`, [
            { text: 'Ok', action: this.props.postToEdit ? this.props.onFinishEditing! : this.clearEverything },
            { text: 'Przejdź do posta', action: this.goToPost }
        ]);
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

    private clearEverything() {
        this.setState({
            postType: PostType.FORECAST,
            postImages: []
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
            postImages: this.state.postImages.filter(file => file.id != fileId)
        });
    }

    private onMoveForward(idInList: number) {
        const currentImagesList = [...this.state.postImages];
        currentImagesList.splice(idInList + 1, 0, currentImagesList.splice(idInList, 1)[0]);
        if (idInList < currentImagesList.length - 1) {
            this.setState({
                postImages: currentImagesList
            });
        }
    }

    private onMoveBackward(idInList: number) {
        const currentImagesList = [...this.state.postImages];

        currentImagesList.splice(idInList - 1, 0, currentImagesList.splice(idInList, 1)[0]);

        if (idInList > 0) {
            this.setState({
                postImages: currentImagesList
            });
        }
    }

    private handleWarningDueDateChange(date: Date) {
        this.setState({ warningDueDate: date });
    }

    private renderForWarning() {
        return (
            <div className="warningDetails">
                <label htmlFor="warningDaysValidInput">Czas zakończenia ostrzeżenia:</label>
                <DatePicker
                    selected={this.state.warningDueDate}
                    onChange={this.handleWarningDueDateChange}
                    showTimeSelect
                    timeFormat="p"
                    timeIntervals={30}
                    dateFormat="Pp"
                    locale="pl"
                    includeDates={Array.from(new Array(14), (val, index) => addDays(new Date(), index))}
                    className="input"
                    fixedHeight
                />
                <label htmlFor="warningShortInput">Krótki opis (zostanie wyświetlony w bocznej sekcji strony): </label>
                <input
                    id="warningShortInput"
                    type="text"
                    className="input"
                    required={true}
                    maxLength={80}
                    ref={this.warningShortInput}
                    defaultValue={this.props.postToEdit ? this.props.postToEdit.shortDescription : ''}
                    onKeyUp={e => validateField(e.target)}
                    onBlur={e => validateField(e.target)}
                />
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
                                    onKeyUp={e => validateField(e.target)}
                                    onBlur={e => validateField(e.target)}
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
                            value="Wybierz pliki"
                            onClick={() => document.getElementById('mapsFiles')?.click()}
                        />
                        <input
                            type="file"
                            style={{ display: 'none' }}
                            accept="image/*"
                            multiple={true}
                            ref={this.fileInput}
                            onChange={() => this.onFilesAdded(this.fileInput.current.files)}
                        />
                        <p>Pamiętaj, aby przed wysłaniem plików ustawić je w odpowiedniej kolejnośći!</p>
                        <p>Obecnie dodane pliki:</p>
                        <div className="columns is-multiline">
                            {this.state.postImages.map((file, key) => {
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
                        <div className="writerBottomButtons">
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
                    </div>
                </section>
                <Copyright />
            </div>
        );
    }
}
