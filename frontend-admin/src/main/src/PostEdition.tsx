import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import Post, { PostType } from './Post';
import { closeModal, showModal } from './redux/actions';
import * as fns from 'date-fns';
import config from './config/config';
import { uploadImages } from './helpers/CloudinaryHelper';
import FileDropper from './FileDropper';
import FileToUploadItem from './FileToUploadItem';
import { FileToUpload } from './Writer';

const LoadingIndicator = require('shared24').LoadingIndicator;

const { MAX_IMAGES_PER_POST, BACKEND_DATE_FORMAT } = config;

interface PostEditionProps {
    post: Post;
    onFinishEditing: () => void;
}

interface State {
    postDescription: string;
    postType: PostType;
    warningDaysValid: number | undefined;
    filesToUpload: FileToUpload[];
}

const connector = connect(null, {
    showModal: showModal,
    closeModal: closeModal
});

type PropsFromRedux = ConnectedProps<typeof connector>;

class PostEdition extends React.Component<
    PostEditionProps & PropsFromRedux,
    State
> {
    private fileId: number;
    private fileInput;
    private addToTopBarCheckBox;
    private postDescriptionTextArea;
    private daysValidInput;
    private warningShortInput;

    state: State = {
        postDescription: this.props.post.description,
        postType: this.props.post.postType,
        warningDaysValid:
            this.props.post.postType === PostType.WARNING
                ? fns.differenceInCalendarDays(
                      this.props.post.dueDate!!,
                      this.props.post.postDate
                  ) - 1
                : 0,
        filesToUpload: []
    };

    constructor(props) {
        super(props);
        this.fileId = 0;
        this.fileInput = React.createRef();
        this.addToTopBarCheckBox = React.createRef();
        this.postDescriptionTextArea = React.createRef();
        this.daysValidInput = React.createRef();
        this.warningShortInput = React.createRef();
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onFilesAdded = this.onFilesAdded.bind(this);
        this.handleDescriptionTextAreaChange = this.handleDescriptionTextAreaChange.bind(
            this
        );
        this.validateField = this.validateField.bind(this);
        this.onRemoveFile = this.onRemoveFile.bind(this);
        this.onMoveForward = this.onMoveForward.bind(this);
        this.onMoveBackward = this.onMoveBackward.bind(this);
    }

    componentDidMount() {
        //images coming from cloudinary let's add to state. They will be recognized by null file
        this.addImagesToReduxStore();
        if (this.props.post.postType === PostType.WARNING) {
            this.addToTopBarCheckBox.current.checked = this.props.post.addedToTopBar;
            if (this.props.post.dueDate) {
                this.daysValidInput.current.value =
                    fns.differenceInCalendarDays(
                        this.props.post.dueDate,
                        this.props.post.postDate
                    ) - 1;
            }
            this.warningShortInput.current.value = this.props.post.shortDescription;
        }
    }

    private addImagesToReduxStore() {
        const filesToUpload: FileToUpload[] = [];
        if (this.props.post.imagesPublicIdsJSON) {
            for (
                let i = 0;
                i < this.props.post.imagesPublicIdsJSON.length;
                ++i
            ) {
                //only publicId and file as null are used
                filesToUpload.push({
                    id: this.fileId++,
                    publicId: this.props.post.imagesPublicIdsJSON[i],
                    file: null,
                    timestamp: ''
                });
            }
        }
        this.setState({ filesToUpload: filesToUpload });
    }

    private onFilesAdded(files: File[]) {
        if (
            this.state.filesToUpload.length + files.length >
            MAX_IMAGES_PER_POST
        ) {
            this.props.showModal(
                <div>
                    <p className="dialogMessage">
                        Do jednego postu możesz dodać tylko 6 plików!
                    </p>
                    <button
                        className="button is-primary"
                        style={{ float: 'right' }}
                        onClick={this.props.closeModal}>
                        Ok
                    </button>
                </div>
            );
            this.fileInput.current.value = null;
            return;
        }
        if (!files.every(file => /\.(jpe?g|png|svg)$/g.test(file.name))) {
            this.props.showModal(
                <div>
                    <p className="dialogMessage">Tylko pliki graficzne!</p>
                    <button
                        className="button is-primary"
                        style={{ float: 'right' }}
                        onClick={this.props.closeModal}>
                        Ok
                    </button>
                </div>
            );
            this.fileInput.current.value = null;
            return;
        }
        for (let file of files) {
            this.prepareAndPushFile(file);
        }
        this.fileInput.current.value = null;
    }

    private prepareAndPushFile(file: File) {
        let timestamp = new Date().getTime().toString();
        timestamp = timestamp.substr(0, timestamp.length - 3);
        const newFile = {
            id: this.fileId++,
            file: file,
            publicId: file.name + timestamp,
            timestamp: timestamp
        };
        this.setState({
            filesToUpload: [...this.state.filesToUpload, newFile]
        });
    }

    private handleSubmit(event) {
        event.preventDefault();
        if (this.state.postType === PostType.WARNING) {
            let formValid = this.validateField(
                this.daysValidInput.current,
                () => parseInt(this.daysValidInput.current.value) > 0
            );
            formValid =
                this.validateField(this.warningShortInput.current) && formValid;
            if (!formValid) return;
        }
        this.props.showModal(<LoadingIndicator />);
        const responsePromise = this.sendPostToBackend();
        this.afterPostRequestSend(responsePromise);
    }

    private sendPostToBackend(): Promise<Response> {
        function calculateDueDate(postDate: Date, days: number): string {
            return fns.format(
                new Date(
                    postDate.setHours(0, 0, 0, 0) +
                        (days + 1) * 24 * 3600 * 1000
                ),
                BACKEND_DATE_FORMAT
            );
        }

        const requestBodyPost = {
            id: this.props.post.id,
            postDate: fns.format(this.props.post.postDate, BACKEND_DATE_FORMAT),
            postType: this.state.postType.toString(),
            description: this.postDescriptionTextArea.current.value,
            imagesPublicIds: '',
            addedToTopBar:
                this.state.postType === PostType.WARNING
                    ? this.addToTopBarCheckBox.current.checked
                    : null,
            dueDate:
                this.state.postType === PostType.WARNING
                    ? calculateDueDate(
                          this.props.post.postDate,
                          parseInt(this.daysValidInput.current.value)
                      )
                    : null,
            shortDescription:
                this.state.postType === PostType.WARNING
                    ? this.warningShortInput.current.value
                    : null
        };

        const uploadedFilesIdsOrdered: string[] = [];
        for (let i = 0; i < this.state.filesToUpload.length; ++i) {
            uploadedFilesIdsOrdered.push(this.state.filesToUpload[i].publicId);
        }
        requestBodyPost['imagesPublicIds'] = JSON.stringify(
            uploadedFilesIdsOrdered
        );

        return fetch('api/posts?temporary=true', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBodyPost)
        });
    }

    private afterPostRequestSend(responsePromise: Promise<Response>) {
        responsePromise
            .then(response => {
                if (response && response.ok) {
                    response.text().then((data: string) => {
                        if (data !== null) {
                            //post saved temporarily, send images to cloudinary
                            const uploadPromises: Promise<
                                Response
                            >[] = uploadImages(this.getImagesToUpload());
                            Promise.all(uploadPromises)
                                .then(responses => {
                                    if (
                                        responses.every(
                                            response => response && response.ok
                                        )
                                    ) {
                                        //all images uploaded successfully
                                        this.continueSavingPostToBackend(data);
                                    } else {
                                        responses = responses.filter(
                                            response =>
                                                !response || !response.ok
                                        );
                                        console.log(responses.toString());
                                        this.showErrorMessage(
                                            'Nie udało się wysłać wszystkich plików. Post nie został zmieniony.'
                                        );
                                        this.abortPostUpdate(data);
                                    }
                                })
                                .catch(error => {
                                    console.log(error);
                                    this.showErrorMessage(
                                        'Wystąpił błąd przy wysyłaniu plików. Post nie został zapisany.'
                                    );
                                    this.abortPostUpdate(data);
                                });
                        } else {
                            this.showErrorMessage(
                                'Wystąpił błąd przy zapisywaniu postu. Post nie został zapisany.'
                            );
                        }
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
                this.showErrorMessage('Niestety, nie udało się zapisać postu.');
            });
    }

    private getImagesToUpload(): FileToUpload[] {
        return this.state.filesToUpload.filter(
            file => typeof file.file !== null
        );
    }

    private continueSavingPostToBackend(hash: string) {
        fetch('/api/posts/continuePostUpdate/' + hash + '?success=true')
            .then(response => {
                if (response && response.ok) {
                    this.showSuccessMessage();
                } else {
                    console.log(response.statusText + ', ' + response.body);
                    this.showErrorMessage(
                        'Wystąpił błąd przy zapisywaniu posta.'
                    );
                }
            })
            .catch(error => {
                console.log(error);
                this.showErrorMessage('Nie udało się zapisać posta.');
            });
    }

    private abortPostUpdate(hash: string) {
        fetch('/api/posts/continuePostUpdate/' + hash + '?success=false')
            .then(response => {
                if (response && response.ok) {
                    console.log('Post update aborted.');
                } else {
                    console.log(
                        'Cannot abort. Hash: ' +
                            hash +
                            '. Server response: ' +
                            response
                    );
                }
            })
            .catch(error => {
                console.log(
                    'Error while aborting update. Error message: ' + error
                );
            });
    }

    private validateField(htmlInput, additionalConstraint?: () => boolean) {
        if (this.state.postType !== PostType.WARNING) return;
        if (
            !htmlInput.value ||
            (additionalConstraint ? !additionalConstraint() : false)
        ) {
            htmlInput.style.borderColor = 'red';
            return false;
        } else {
            htmlInput.style.borderColor = '';
            return true;
        }
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
            case PostType.FACT: {
                postType = 'ciekawostkę.';
                break;
            }
        }
        this.props.showModal(
            <div>
                <p className="dialogMessage">Pomyślnie zapisano {postType}</p>
                <button
                    className="button is-primary"
                    style={{ float: 'right' }}
                    onClick={this.props.onFinishEditing}>
                    Ok
                </button>
            </div>
        );
    }

    private showErrorMessage(errorMessage: string) {
        this.props.showModal(
            <div>
                <p className="dialogMessage">{errorMessage}</p>
                <button
                    className="button is-primary"
                    style={{ float: 'right' }}
                    onClick={this.props.closeModal}>
                    Ok
                </button>
            </div>
        );
    }

    private onRemoveFile(fileId: number) {
        this.setState({
            filesToUpload: this.state.filesToUpload.filter(
                file => file.id != fileId
            )
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

    private handleDescriptionTextAreaChange(event) {
        this.setState({ postDescription: event.target.value });
    }

    private renderForWarning() {
        return (
            <div className="columns">
                <div className="column is-half">
                    <div style={{ margin: '10px' }}>
                        <input
                            id="addToBar"
                            type="checkbox"
                            ref={this.addToTopBarCheckBox}
                        />
                        <label htmlFor="addToBar">
                            {' '}
                            Dodaj ostrzeżenie do paska u góry strony
                        </label>
                    </div>
                    <div className="columns">
                        <div className="column">
                            <label htmlFor="warningDaysValidInput">
                                Czas trwania ostrzeżenia (0 = do końca
                                dzisiejszego dnia:{' '}
                            </label>
                        </div>
                        <div className="column">
                            <input
                                id="warningDaysValidInput"
                                type="number"
                                required={true}
                                ref={this.daysValidInput}
                                min="0"
                                max="7"
                                onBlur={e =>
                                    this.validateField(
                                        e.target,
                                        () => parseInt(e.target.value) > 0
                                    )
                                }
                            />
                        </div>
                    </div>
                    <div className="columns">
                        <div className="column">
                            <label htmlFor="warningShortInput">
                                Krótki opis (zostanie wyświetlony na pasku u
                                góry strony):{' '}
                            </label>
                        </div>
                        <div className="column">
                            <input
                                id="warningShortInput"
                                type="text"
                                required={true}
                                maxLength={80}
                                ref={this.warningShortInput}
                                onBlur={e => this.validateField(e.target)}
                            />
                        </div>
                    </div>
                </div>
                <div className="column is-half" />
            </div>
        );
    }

    render() {
        return (
            <>
                <h2 className="title">Edytuj post.</h2>
                <div className="container fluid writerForm">
                    <div className="columns">
                        <div className="column">
                            <p>Opis:</p>
                            <textarea
                                required={true}
                                cols={100}
                                rows={10}
                                placeholder="Treść posta..."
                                ref={this.postDescriptionTextArea}
                                onChange={this.handleDescriptionTextAreaChange}
                                value={this.state.postDescription}
                            />
                        </div>
                        <div className="column">
                            <p>Typ postu: </p>
                            <input
                                type="radio"
                                id="forecast"
                                name="postType"
                                value="Prognoza"
                                checked={
                                    this.state.postType === PostType.FORECAST
                                }
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
                                checked={
                                    this.state.postType === PostType.WARNING
                                }
                                onChange={() =>
                                    this.setState({
                                        postType: PostType.WARNING
                                    })
                                }
                            />
                            <label htmlFor="warning"> Ostrzeżenie</label>
                            <br />
                            <input
                                type="radio"
                                id="ciekawostka"
                                name="postType"
                                value="Ciekawostka"
                                checked={this.state.postType === PostType.FACT}
                                onChange={() =>
                                    this.setState({
                                        postType: PostType.FACT
                                    })
                                }
                            />
                            <label htmlFor="ciekawostka"> Ciekawostka</label>
                        </div>
                    </div>
                    <p>
                        Dodaj mapki z prognozą/ostrzeżeniem lub zdjęcia do
                        ciekawostki. Możesz przeciągnąć swoje pliki z dysku na
                        kreskowane pole:
                    </p>
                    <FileDropper onFilesAdded={this.onFilesAdded} />
                    <p>...lub skorzystać z klasycznego dodawania plików: </p>
                    <input
                        type="button"
                        className="button"
                        id="loadFile"
                        value="Wybierz pliki"
                        onClick={() =>
                            document.getElementById('mapsFiles')?.click()
                        }
                    />
                    <input
                        type="file"
                        id="mapsFiles"
                        style={{ display: 'none' }}
                        accept="image/*"
                        multiple={true}
                        ref={this.fileInput}
                        onChange={() => this.onFilesAdded(this.fileInput.files)}
                    />
                    <p>
                        Pamiętaj, aby przed wysłaniem plików ustawić je w
                        odpowiedniej kolejnośći!
                    </p>
                    <p>Obecnie dodane pliki:</p>
                    <div className="columns is-multiline">
                        {this.state.filesToUpload.map((file, key) => {
                            return (
                                <div
                                    key={key}
                                    className="column is-one-quarter">
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
                    {this.state.postType === PostType.WARNING
                        ? this.renderForWarning()
                        : null}
                    <form onSubmit={this.handleSubmit}>
                        <input
                            type="submit"
                            className="button"
                            value="Wyślij"
                        />
                    </form>
                </div>
            </>
        );
    }
}

export default connector(PostEdition);
