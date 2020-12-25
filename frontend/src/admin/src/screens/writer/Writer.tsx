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
import Copyright from '@shared/components/Copyright';
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
    mainImage?: PostImage;
}

export default class Writer extends React.Component<WriterProps, State> {
    private fileId: number;
    protected fileInput;
    private postDescriptionTextArea;
    protected titleInput;
    protected abortController;
    protected savedPostId;
    protected loginInput;
    protected passwordInput;

    constructor(props) {
        super(props);
        this.fileId = 0;
        this.fileInput = React.createRef();
        this.postDescriptionTextArea = React.createRef();
        this.titleInput = React.createRef();
        this.loginInput = React.createRef();
        this.passwordInput = React.createRef();
        this.abortController = new AbortController();
        if (props.postToEdit) {
            this.savedPostId = props.postToEdit.id;
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

    //images coming from cloudinary let's add to state. They will be recognized by null file
    protected registerImagesPresentAtCloudinary() {
        if (this.props.postToEdit) {
            const postImages: PostImage[] = [];
            const post = this.props.postToEdit;
            for (let i = 0; i < post.imagesPublicIds.length; ++i) {
                //only publicId and file as null are used
                postImages.push({
                    id: this.fileId++,
                    publicId: post.imagesPublicIds[i],
                    file: null,
                    timestamp: ''
                });
            }

            this.setState({ postImages: postImages });
        }
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

    protected handleSubmit(event) {
        event.preventDefault();
        if (!validateField(this.titleInput.current)) return;

        showModal(<LoadingIndicator />);
        this.savePost();
    }

    protected async savePost(authHeader?: string) {
        const response = await this.sendPostToBackend(authHeader);
        if (response && response.ok) {
            const postIdOrPostHash = await response.text();

            // we get postId from backend
            if (!this.props.postToEdit) {
                this.savedPostId = postIdOrPostHash;
            }
            if (this.state.mainImage && this.state.mainImage.file !== null) {
                await this.sendMainImageToCloud();
            }
            let uploadPromises: Promise<Response>[] = [];
            if (this.state.postImages.length > 0) {
                uploadPromises = uploadImages(this.state.postImages, this.abortController.signal);
            }
            if (uploadPromises.length > 0) {
                if (!(await Writer.checkIfImagesSaved(uploadPromises))) {
                    this.props.postToEdit
                        ? await Writer.abortPostUpdate(postIdOrPostHash)
                        : await Writer.removePostFromBackend(postIdOrPostHash);
                }
            }
            if (this.props.postToEdit) {
                await this.continueSavingPostToBackend(postIdOrPostHash);
            } else {
                // new post successfully added
                this.showSuccessMessage();
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
            response.text().then(text => {
                console.log(text);
            });
            showInfoModal('Wystąpił błąd serwera. Nie udało się zapisać postu.');
        }
    }

    private sendMainImageToCloud(): Promise<any> {
        return uploadImages([this.state.mainImage!], this.abortController.signal)[0];
    }

    private sendPostToBackend(authHeader?: string): Promise<Response> {
        const post = this.props.postToEdit;
        const requestBody = this.buildRequestBody();

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

    protected buildRequestBody() {
        const post = this.props.postToEdit;
        const description = this.getDescription();

        const requestBody = {
            postDate: format(post ? post.postDate : new Date(), BACKEND_DATE_FORMAT),
            postType: this.state.postType.toString(),
            title: this.titleInput.current.value,
            description: description,
            imagesPublicIds: [] as string[],
            dueDate:
                this.state.postType === PostType.WARNING ? format(this.state.warningDueDate, BACKEND_DATE_FORMAT) : null
        };

        if (post) {
            requestBody['id'] = post.id;
        }

        const uploadedFilesIdsOrdered: string[] = [];
        for (let i = 0; i < this.state.postImages.length; ++i) {
            uploadedFilesIdsOrdered.push(this.state.postImages[i].publicId!!);
        }
        requestBody['imagesPublicIds'] = uploadedFilesIdsOrdered;

        return requestBody;
    }

    protected getDescription() {
        return this.postDescriptionTextArea.current.value;
    }

    private static async checkIfImagesSaved(uploadPromises: Promise<Response>[]): Promise<boolean> {
        const responses = await Promise.all(uploadPromises);
        if (!responses.every(response => response && response.ok)) {
            responses.filter(response => !response || !response.ok);
            console.log(responses.toString());
            showInfoModal('Nie udało się wysłać wszystkich plików. Post nie został zapisany.');
            return false;
        }
        return true;
    }

    //Remove post changes, that are temporarily saved in backend
    private static async abortPostUpdate(hash: string): Promise<void> {
        const response = await fetchApi('api/posts/continuePostUpdate/' + hash + '?success=false');
        if (response && response.ok) {
            console.log('Post update aborted.');
        } else {
            console.log('Cannot abort. Hash: ' + hash + '. Server response: ' + response);
        }
    }

    //Save temporarily saved changes to the database
    private async continueSavingPostToBackend(hash: string): Promise<void> {
        const response = await fetchApi('api/posts/continuePostUpdate/' + hash + '?success=true');
        if (response && response.ok) {
            this.showSuccessMessage();
        } else {
            console.log(response.statusText + ', ' + response.body);
            showInfoModal('Wystąpił błąd przy zapisywaniu posta.');
        }
    }

    private static async removePostFromBackend(postId: string): Promise<void> {
        const response = await fetchApi('api/posts/' + postId, {
            method: 'DELETE'
        });
        if (response && response.ok) {
            console.log('Removed post with id: ' + postId);
        } else {
            console.log('Cannot remove post with id: ' + postId + '. Server response: ' + response);
        }
    }

    protected showSuccessMessage() {
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
        this.titleInput.current.value = null;
        this.savedPostId = undefined;
        closeModal();
    }

    protected goToPost() {
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
            <>
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
                        className="input topBottomMargin"
                        fixedHeight
                    />
                </div>
            </>
        );
    }

    componentDidMount() {
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
                                    ref={this.titleInput}
                                    defaultValue={this.props.postToEdit ? this.props.postToEdit.title : ''}
                                    className="input topBottomMargin"
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
                                    className="textarea topBottomMargin"
                                />
                            </div>
                            <div className="column">
                                <p>Typ postu: </p>
                                <div style={{ marginBottom: '0.2rem' }}>
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
                                </div>
                                <div style={{ marginBottom: '0.2rem' }}>
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
                                {this.state.postType === PostType.WARNING ? this.renderForWarning() : null}
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
                            id="mapsFiles"
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
                <Copyright fontColor={'white'} />
            </div>
        );
    }
}
