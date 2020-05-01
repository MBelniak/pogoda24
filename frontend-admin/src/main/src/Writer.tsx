import React from 'react';
import config from './config/config';
import * as fns from 'date-fns';
import FileDropper from './FileDropper';
import img from './img/bg.jpg';
import FileToUploadItem from './FileToUploadItem';
import { PostType } from './Post';
import { uploadImages } from './helpers/CloudinaryHelper';
import { fetchApi } from './helpers/fetchHelper';
const Copyright = require('shared24').Copyright;
const LoadingIndicator = require('shared24').LoadingIndicator;
const showModal = require('shared24').showModal;
const closeModal = require('shared24').closeModal;
const { MAX_IMAGES_PER_POST, BACKEND_DATE_FORMAT } = config;

export interface FileToUpload {
    id: number;
    file: File | null;
    publicId: string;
    timestamp: string;
}

interface State {
    postType: PostType;
    postTypeText: PostTypeText;
    warningDaysValid: number | undefined;
    postDescription: string;
    filesToUpload: FileToUpload[];
}

enum PostTypeText {
    Prognoza = 'prognozy',
    Ostrzezenie = 'ostrzeżenia',
    Ciekawostka = 'ciekawostki'
}

const daysValidInputConstraint = (text: string): boolean => {
    return parseInt(text) >= 0;
};

export default class Writer extends React.Component<{}, State> {
    state: State = {
        postType: PostType.FORECAST,
        postTypeText: PostTypeText.Prognoza,
        warningDaysValid: undefined,
        postDescription: '',
        filesToUpload: []
    };

    private fileId: number;
    private fileInput;
    private warningCheckBox;
    private postDescriptionTextArea;
    private daysValidInput;
    private warningShortInput;

    constructor(props) {
        super(props);
        this.fileId = 0;
        this.fileInput = React.createRef();
        this.warningCheckBox = React.createRef();
        this.postDescriptionTextArea = React.createRef();
        this.daysValidInput = React.createRef();
        this.warningShortInput = React.createRef();
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onFilesAdded = this.onFilesAdded.bind(this);
        this.handleDescriptionTextAreaChange = this.handleDescriptionTextAreaChange.bind(
            this
        );
        this.clearEverything = this.clearEverything.bind(this);
        this.validateField = this.validateField.bind(this);
        this.onRemoveFile = this.onRemoveFile.bind(this);
        this.onMoveForward = this.onMoveForward.bind(this);
        this.onMoveBackward = this.onMoveBackward.bind(this);
    }

    private onFilesAdded(files: File[]) {
        if (
            this.state.filesToUpload.length + files.length >
            MAX_IMAGES_PER_POST
        ) {
            showModal(
                <div>
                    <p className="dialogMessage">
                        Do jednego postu możesz dodać tylko 6 plików!
                    </p>
                    <button
                        className="button is-primary"
                        style={{ float: 'right' }}
                        onClick={closeModal}>
                        Ok
                    </button>
                </div>
            );
            this.fileInput.current.value = null;
            return;
        }
        if (!files.every(file => /\.(jpe?g|png|svg)$/g.test(file.name))) {
            showModal(
                <div>
                    <p className="dialogMessage">Tylko pliki graficzne!</p>
                    <button
                        className="button is-primary"
                        style={{ float: 'right' }}
                        onClick={closeModal}>
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
        const fileToUpload = {
            id: this.fileId++,
            file: file,
            publicId: file.name + timestamp,
            timestamp: timestamp
        };
        this.setState({
            filesToUpload: [...this.state.filesToUpload, fileToUpload]
        });
    }

    private handleSubmit(event) {
        event.preventDefault();
        if (this.state.postType === PostType.WARNING) {
            let formValid = this.validateField(
                this.daysValidInput.current,
                daysValidInputConstraint
            );
            formValid =
                this.validateField(this.warningShortInput.current) && formValid;
            if (!formValid) return;
        }
        showModal(<LoadingIndicator />);
        const responsePromise = this.sendPostToBackend();
        this.afterPostRequestSend(responsePromise);
    }

    private validateField(
        htmlInput,
        additionalConstraint?: (value) => boolean
    ) {
        if (this.state.postType !== PostType.WARNING) return;
        if (
            !htmlInput.value ||
            (additionalConstraint
                ? !additionalConstraint(htmlInput.value)
                : false)
        ) {
            htmlInput.style.borderColor = 'red';
            return false;
        } else {
            htmlInput.style.borderColor = '';
            return true;
        }
    }

    private sendPostToBackend(): Promise<Response> {
        function calculateDueDate(days: number): string {
            return fns.format(
                new Date(
                    new Date().setHours(0, 0, 0, 0) +
                        (days + 1) * 24 * 3600 * 1000
                ),
                BACKEND_DATE_FORMAT
            );
        }

        const requestBodyPost = {
            postDate: fns.format(new Date(), BACKEND_DATE_FORMAT),
            postType: this.state.postType.toString(),
            description: this.postDescriptionTextArea.current.value,
            imagesPublicIds: '',
            addedToTopBar:
                this.state.postType === PostType.WARNING
                    ? this.warningCheckBox.current.checked
                    : null,
            dueDate:
                this.state.postType === PostType.WARNING
                    ? calculateDueDate(
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
            uploadedFilesIdsOrdered.push(
                this.state.filesToUpload[i].publicId!!
            );
        }
        requestBodyPost['imagesPublicIds'] = JSON.stringify(
            uploadedFilesIdsOrdered
        );

        return fetchApi('api/posts', {
            method: 'POST',
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
                    response.json().then((data: any) => {
                        if (data !== null) {
                            //post saved, send images to cloudinary
                            const uploadPromises: Promise<
                                Response
                            >[] = uploadImages(this.state.filesToUpload);
                            Promise.all(uploadPromises)
                                .then(responses => {
                                    if (
                                        responses.every(
                                            response => response && response.ok
                                        )
                                    ) {
                                        //all images uploaded successfully
                                        this.showSuccessMessage();
                                    } else {
                                        responses = responses.filter(
                                            response =>
                                                !response || !response.ok
                                        );
                                        console.log(responses.toString());
                                        this.showErrorMessage(
                                            'Nie udało się wysłać wszystkich plików. Post nie został zapisany.'
                                        );
                                        this.removePostFromBackend(data.id);
                                    }
                                })
                                .catch(error => {
                                    console.log(error);
                                    this.showErrorMessage(
                                        'Wystąpił błąd przy wysyłaniu plików. Post nie został zapisany.'
                                    );
                                    this.removePostFromBackend(data.id);
                                });
                        } else {
                            this.showErrorMessage(
                                'Wystąpił błąd przy zapisywaniu postu. Post nie został zapisany.'
                            );
                        }
                    }).catch(error => {
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
                this.showErrorMessage('Niestety, nie udało się zapisać postu.');
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
                    console.log(
                        'Cannot remove post with id: ' +
                            postId +
                            '. Server response: ' +
                            response
                    );
                }
            })
            .catch(error => {
                console.log(
                    'Error while deleting post. Error message: ' + error
                );
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
            case PostType.FACT: {
                postType = 'ciekawostkę.';
                break;
            }
        }
        showModal(
            <div>
                <p className="dialogMessage">Pomyślnie zapisano {postType}</p>
                <button
                    className="button is-primary"
                    style={{ float: 'right' }}
                    onClick={this.clearEverything}>
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
                    onClick={closeModal}>
                    Ok
                </button>
            </div>
        );
    }

    private clearEverything() {
        this.setState({
            postTypeText: PostTypeText.Prognoza,
            postType: PostType.FORECAST,
            postDescription: '',
            filesToUpload: []
        });
        closeModal();
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

    private renderForWarning() {
        return (
            <div className="columns">
                <div className="column is-half">
                    <div style={{ margin: '10px' }}>
                        <input
                            id="addToBar"
                            type="checkbox"
                            ref={this.warningCheckBox}
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
                                        daysValidInputConstraint
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

    private handleDescriptionTextAreaChange(event) {
        this.setState({ postDescription: event.target.value });
    }

    render() {
        return (
            <div className="main">
                <section className="container fluid">
                    <img src={img} className="bgimg" />
                    <h2 className="title">Witaj w edytorze wpisów.</h2>
                    <h2 className="title is-5">
                        Możesz tutaj tworzyć nowe posty do umieszczenia na
                        stronie.
                    </h2>
                    <div className="container fluid writerForm">
                        <div className="columns">
                            <div className="column">
                                <p>
                                    Dodaj opis do{' '}
                                    {this.state.postTypeText.toString()}:{' '}
                                </p>
                                <textarea
                                    required={true}
                                    cols={100}
                                    rows={10}
                                    placeholder="Treść posta..."
                                    ref={this.postDescriptionTextArea}
                                    onChange={
                                        this.handleDescriptionTextAreaChange
                                    }
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
                                        this.state.postType ===
                                        PostType.FORECAST
                                    }
                                    onChange={() =>
                                        this.setState({
                                            postType: PostType.FORECAST,
                                            postTypeText: PostTypeText.Prognoza
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
                                            postType: PostType.WARNING,
                                            postTypeText:
                                                PostTypeText.Ostrzezenie
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
                                    checked={
                                        this.state.postType === PostType.FACT
                                    }
                                    onChange={() =>
                                        this.setState({
                                            postType: PostType.FACT,
                                            postTypeText:
                                                PostTypeText.Ciekawostka
                                        })
                                    }
                                />
                                <label htmlFor="ciekawostka">
                                    {' '}
                                    Ciekawostka
                                </label>
                            </div>
                        </div>
                        <p>
                            Dodaj mapki z prognozą/ostrzeżeniem lub zdjęcia do
                            ciekawostki. Możesz przeciągnąć swoje pliki z dysku
                            na kreskowane pole:
                        </p>
                        <FileDropper onFilesAdded={this.onFilesAdded} />
                        <p>
                            ...lub skorzystać z klasycznego dodawania plików:{' '}
                        </p>
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
                            onChange={() =>
                                this.onFilesAdded(this.fileInput.files)
                            }
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
                </section>
                <Copyright />
            </div>
        );
    }
}
