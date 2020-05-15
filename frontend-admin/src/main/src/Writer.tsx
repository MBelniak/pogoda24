import React from 'react';
import config from './config/config';
import * as fns from 'date-fns';
import FileDropper from './FileDropper';
import FileToUploadItem from './FileToUploadItem';
import { PostType } from './Post';
import { uploadImages } from './helpers/CloudinaryHelper';
import { fetchApi } from './helpers/fetchHelper';
const Copyright = require('shared24').Copyright;
const TopImage = require('shared24').TopImage;
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
    title: string;
    postDescription: string;
    filesToUpload: FileToUpload[];
}

enum PostTypeText {
    Prognoza = 'prognozy',
    Ostrzezenie = 'ostrzeżenia'
}

const daysValidInputConstraint = (text: string): boolean => {
    return parseInt(text) >= 0 && parseInt(text) <= 14;
};

export default class Writer extends React.Component<{}, State> {
    state: State = {
        postType: PostType.FORECAST,
        postTypeText: PostTypeText.Prognoza,
        warningDaysValid: undefined,
        postDescription: '',
        title: '',
        filesToUpload: []
    };

    private fileId: number;
    private fileInput;
    private addToTopBarCheckBox;
    private postDescriptionTextArea;
    private titleTextArea;
    private daysValidInput;
    private warningShortInput;
    private abortController;

    constructor(props) {
        super(props);
        this.fileId = 0;
        this.fileInput = React.createRef();
        this.addToTopBarCheckBox = React.createRef();
        this.postDescriptionTextArea = React.createRef();
        this.titleTextArea = React.createRef();
        this.daysValidInput = React.createRef();
        this.warningShortInput = React.createRef();
        this.abortController = new AbortController();
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onFilesAdded = this.onFilesAdded.bind(this);
        this.handleDescriptionTextAreaChange = this.handleDescriptionTextAreaChange.bind(
            this
        );
        this.handleTitleTextAreaChange = this.handleTitleTextAreaChange.bind(
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
            htmlInput.classList.add('is-danger');
            return false;
        } else {
            htmlInput.classList.remove('is-danger');
            return true;
        }
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

        this.sendPostToBackend()
            .then(response => {
                if (response && response.ok) {
                    response
                        .json()
                        .then((data: any) => {
                            if (data !== null) {
                                let warningInfoPromise;
                                if (
                                    this.state.postType === PostType.WARNING &&
                                    this.addToTopBarCheckBox.current.checked
                                ) {
                                    warningInfoPromise = this.saveWarningInfo(
                                        data.id
                                    );
                                } else {
                                    warningInfoPromise = Promise.resolve().then(
                                        () => null
                                    );
                                }
                                //post saved, send images to cloudinary
                                warningInfoPromise
                                    .then(response => {
                                        this.saveImagesToCloudinary(
                                            data.id,
                                            response && response.ok
                                                ? response.id
                                                : undefined
                                        );
                                    })
                                    .catch(error => {
                                        console.log(error);
                                    });
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

    private sendPostToBackend(): Promise<Response> {
        const requestBody = {
            postDate: fns.format(new Date(), BACKEND_DATE_FORMAT),
            postType: this.state.postType.toString(),
            title: this.titleTextArea.current.value,
            description: this.postDescriptionTextArea.current.value,
            imagesPublicIds: ''
        };

        const uploadedFilesIdsOrdered: string[] = [];
        for (let i = 0; i < this.state.filesToUpload.length; ++i) {
            uploadedFilesIdsOrdered.push(
                this.state.filesToUpload[i].publicId!!
            );
        }
        requestBody['imagesPublicIds'] = JSON.stringify(
            uploadedFilesIdsOrdered
        );

        return fetchApi('api/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
    }

    private saveWarningInfo(id: number) {
        function calculateDueDate(days: number): string {
            return fns.format(
                new Date(
                    new Date().setHours(0, 0, 0, 0) +
                        (days + 1) * 24 * 3600 * 1000
                ),
                BACKEND_DATE_FORMAT
            );
        }

        const requestBody = {
            dueDate:
                this.state.postType === PostType.WARNING
                    ? calculateDueDate(
                          parseInt(this.daysValidInput.current.value)
                      )
                    : null,
            shortDescription:
                this.state.postType === PostType.WARNING
                    ? this.warningShortInput.current.value
                    : null,
            postId: id
        };

        return fetchApi('api/warningInfo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
    }

    private saveImagesToCloudinary(postId: number, warningInfoId?: number) {
        const uploadPromises: Promise<Response>[] = uploadImages(
            this.state.filesToUpload,
            this.abortController.signal
        );
        Promise.all(uploadPromises)
            .then(responses => {
                if (responses.every(response => response && response.ok)) {
                    //all images uploaded successfully
                    this.showSuccessMessage();
                } else {
                    responses = responses.filter(
                        response => !response || !response.ok
                    );
                    console.log(responses.toString());
                    this.showErrorMessage(
                        'Nie udało się wysłać wszystkich plików. Post nie został zapisany.'
                    );
                    this.removePostFromBackend(postId);
                    if (warningInfoId) {
                        this.removeWarningInfoFromBackend(warningInfoId);
                    }
                }
            })
            .catch(error => {
                console.log(error);
                this.removePostFromBackend(postId);
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

    private removeWarningInfoFromBackend(warningInfoId: number) {
        fetchApi('api/warningInfo/' + warningInfoId, {
            method: 'DELETE'
        })
            .then(response => {
                if (response && response.ok) {
                    console.log(
                        'Removed warningInfo with id: ' + warningInfoId
                    );
                } else {
                    console.log(
                        'Cannot remove warningInfo with id: ' +
                            warningInfoId +
                            '. Server response: ' +
                            response
                    );
                }
            })
            .catch(error => {
                console.log(
                    'Error while deleting warningInfo. Error message: ' + error
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
            title: '',
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
            <div>
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
                <label htmlFor="warningDaysValidInput">
                    Czas trwania ostrzeżenia (0 = do końca dzisiejszego dnia,
                    max 14):{' '}
                </label>
                <input
                    id="warningDaysValidInput"
                    className="input daysValidInput"
                    type="number"
                    required={true}
                    ref={this.daysValidInput}
                    min="0"
                    max="14"
                    onKeyUp={e =>
                        this.validateField(e.target, daysValidInputConstraint)
                    }
                    onBlur={e =>
                        this.validateField(e.target, daysValidInputConstraint)
                    }
                />
                <br />
                <label htmlFor="warningShortInput">
                    Krótki opis (zostanie wyświetlony na pasku u góry strony):{' '}
                </label>
                <input
                    id="warningShortInput"
                    type="text"
                    className="input"
                    required={true}
                    maxLength={80}
                    ref={this.warningShortInput}
                    onKeyUp={e => this.validateField(e.target)}
                    onBlur={e => this.validateField(e.target)}
                />
            </div>
        );
    }

    private handleDescriptionTextAreaChange(event) {
        this.setState({ postDescription: event.target.value });
    }

    private handleTitleTextAreaChange(event) {
        this.setState({ title: event.target.value });
    }

    componentWillUnmount() {
        this.abortController.abort();
    }

    render() {
        return (
            <div className="main">
                <section className="container fluid">
                    <TopImage />
                    <h2 className="title">Witaj w edytorze wpisów.</h2>
                    <h2 className="title is-5">
                        Możesz tutaj tworzyć nowe posty do umieszczenia na
                        stronie.
                    </h2>
                    <div className="container fluid writerForm">
                        <div className="columns">
                            <div className="column">
                                <p>
                                    Dodaj tytuł do{' '}
                                    {this.state.postTypeText.toString()}:{' '}
                                </p>
                                <input
                                    required={true}
                                    maxLength={100}
                                    placeholder="Tytuł"
                                    ref={this.titleTextArea}
                                    onChange={this.handleTitleTextAreaChange}
                                    value={this.state.title}
                                    className="input"
                                />
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
                            </div>
                        </div>
                        <p>
                            Dodaj mapki z prognozą lub ostrzeżeniem. Możesz
                            przeciągnąć swoje pliki z dysku na kreskowane pole:
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
