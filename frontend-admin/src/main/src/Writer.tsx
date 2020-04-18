import React from 'react';
import config from './config/config';
import FileDropper from './FileDropper';
import { connect, ConnectedProps } from 'react-redux';
import img from './img/bg.jpg';
import UploadedFilesItem from './UploadedFilesItem';
import { addFile, clearFiles } from './redux/actions';
const Copyright = require('shared24').Copyright;
const LoadingIndicator = require('shared24').LoadingIndicator;
const ModalWindow = require('shared24').ModalWindow;
const {
    cloud_name,
    upload_preset,
    api_key,
    api_secret,
    MAX_IMAGES_FOR_POST
} = config;
const sha1 = require('js-sha1');

interface UploadedFile {
    id: number;
    file: File;
    publicId: string;
}

interface State {
    postType: PostType;
    postTypeText: PostTypeText;
    warningDaysValid: number | undefined;
    postDescription: string;
    showModal: boolean;
    renderModal: JSX.Element | undefined;
}

enum PostTypeText {
    Prognoza = 'prognozy',
    Ostrzezenie = 'ostrzeżenia',
    Ciekawostka = 'ciekawostki'
}

enum PostType {
    FORECAST = 'FORECAST',
    WARNING = 'WARNING',
    FACT = 'FACT'
}

const connector = connect((state: UploadedFile[]) => ({ files: state }), {
    onAddImage: addFile,
    onClearFiles: clearFiles
});

type PropsFromRedux = ConnectedProps<typeof connector>;

class Writer extends React.Component<PropsFromRedux, State> {
    state: State = {
        postType: PostType.FORECAST,
        postTypeText: PostTypeText.Prognoza,
        warningDaysValid: undefined,
        postDescription: '',
        showModal: false,
        renderModal: undefined
    };

    private fileId;
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
        this.showModal = this.showModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.validateField = this.validateField.bind(this);
    }

    private onFilesAdded(files) {
        if (this.props.files.length + files.length > MAX_IMAGES_FOR_POST) {
            this.showModal(
                <div>
                    <p className="dialogMessage">
                        Do jednego postu możesz dodać tylko 6 plików!
                    </p>
                    <button
                        className="button is-primary"
                        style={{ float: 'right' }}
                        onClick={this.closeModal}>
                        Ok
                    </button>
                </div>
            );
            this.fileInput.current.value = null;
            return;
        }
        for (let file of files) {
            this.props.onAddImage(file);
        }
        this.fileInput.current.value = null;
    }

    private showModal(toRender: JSX.Element) {
        this.setState({ showModal: true, renderModal: toRender });
    }

    private closeModal() {
        this.setState({ showModal: false });
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
        this.showModal(<LoadingIndicator />);
        const responsePromise = this.sendPostToBackend();
        this.afterPostRequestSend(responsePromise);
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

    private sendPostToBackend(): Promise<Response> {
        function calculateDueDate(days: number): number {
            console.log(days);
            return new Date(
                new Date().setHours(0, 0, 0, 0) + (days + 1) * 24 * 3600 * 1000
            ).getTime();
        }

        const requestBodyPost = {
            postDate: new Date().getTime(),
            postType: this.state.postType.toString(),
            description: this.postDescriptionTextArea.current.value,
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

        return fetch('api/posts', {
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
                            >[] = this.uploadImages();
                            Promise.all(uploadPromises)
                                .then(responses => {
                                    if (
                                        responses.every(
                                            response => response && response.ok
                                        )
                                    ) {
                                        //all images uploaded successfully
                                        this.sendImagesPublicIdsToBackend(data);
                                    } else {
                                        responses = responses.filter(
                                            response =>
                                                !response || !response.ok
                                        );
                                        console.log(responses.toString());
                                        this.closeModal();
                                        this.showErrorMessage(
                                            'Nie udało się wysłać wszystkich plików. Post nie został zapisany.'
                                        );
                                        this.removePostFromBackend(data.id);
                                    }
                                })
                                .catch(error => {
                                    console.log(error);
                                    this.closeModal();
                                    this.showErrorMessage(
                                        'Wystąpił błąd przy wysyłaniu plików. Post nie został zapisany.'
                                    );
                                    this.removePostFromBackend(data.id);
                                });
                        } else {
                            this.closeModal();
                            this.showErrorMessage(
                                'Wystąpił błąd przy zapisywaniu postu. Post nie został zapisany.'
                            );
                        }
                    });
                } else {
                    console.log(response.statusText + ', ' + response.body);
                    this.closeModal();
                    this.showErrorMessage(
                        'Wystąpił błąd serwera. Nie udało się zapisać postu.'
                    );
                }
            })
            .catch(error => {
                console.log(error);
                this.closeModal();
                this.showErrorMessage('Niestety, nie udało się zapisać postu.');
            });
    }

    private uploadImages() {
        const url = `https://api.cloudinary.com/v1_1/${cloud_name}/upload`;

        return this.props.files.map(file => {
            let timestamp = new Date().getTime().toString();
            timestamp = timestamp.substr(0, timestamp.toString().length - 3);
            const public_id = file.file.name + timestamp;
            file.publicId = public_id;
            const signature = this.prepareSignature(file, timestamp);

            const formData = new FormData();
            formData.append('upload_preset', upload_preset);
            formData.append('timestamp', timestamp.toString());
            formData.append('public_id', public_id);
            formData.append('api_key', api_key);
            formData.append('file', file.file);
            formData.append('signature', signature);

            return fetch(url, {
                method: 'POST',
                body: formData
            });
        });
    }

    private prepareSignature(photo: UploadedFile, timestamp: string): string {
        const publicId = photo.file.name + timestamp;
        const hash = sha1.create();
        const stringToSign =
            'public_id=' +
            publicId +
            '&timestamp=' +
            timestamp +
            '&upload_preset=' +
            upload_preset +
            api_secret;
        hash.update(stringToSign);
        return hash;
    }

    private sendImagesPublicIdsToBackend(data: any) {
        const requestBodyUpdatedForecast = {
            id: data.id,
            postDate: data.postDate,
            postType: data.postType,
            description: data.description,
            imagesPublicIds: '',
            addedToTopBar: data.addedToTopBar,
            dueDate: data.dueDate,
            shortDescription: data.shortDescription
        };
        const uploadedFiles = this.props.files;
        const uploadedFilesIdsOrdered: string[] = [];
        for (let i = 0; i < uploadedFiles.length; ++i) {
            uploadedFilesIdsOrdered.push(uploadedFiles[i].publicId);
        }
        requestBodyUpdatedForecast['imagesPublicIds'] = JSON.stringify(
            uploadedFilesIdsOrdered
        );

        fetch('/api/posts', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBodyUpdatedForecast)
        })
            .then(response => {
                if (response && response.ok) {
                    this.closeModal();
                    this.showSuccessMessage();
                } else {
                    console.log(response.statusText + ', ' + response.body);
                    this.closeModal();
                    this.showErrorMessage(
                        'Wystąpił błąd przy zapisywaniu obrazów.'
                    );
                }
            })
            .catch(error => {
                console.log(error);
                this.closeModal();
                this.showErrorMessage('Nie udało się zapisać obrazów.');
            });
    }

    private removePostFromBackend(postId: number) {
        fetch('/api/posts/' + postId)
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
        this.showModal(
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
        this.showModal(
            <div>
                <p className="dialogMessage">{errorMessage}</p>
                <button
                    className="button is-primary"
                    style={{ float: 'right' }}
                    onClick={this.closeModal}>
                    Ok
                </button>
            </div>
        );
    }

    private clearEverything() {
        this.props.onClearFiles();
        this.setState({
            postTypeText: PostTypeText.Prognoza,
            postType: PostType.FORECAST,
            postDescription: ''
        });
        this.closeModal();
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
                <div className="column is-half"></div>
            </div>
        );
    }

    private handleDescriptionTextAreaChange(event) {
        this.setState({ postDescription: event.target.value });
    }

    render() {
        return (
            <div className="main">
                <ModalWindow
                    isShown={this.state.showModal}
                    render={this.state.renderModal}
                />
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
                            {this.props.files.map((file, key) => {
                                return (
                                    <div
                                        key={key}
                                        className="column is-one-quarter">
                                        <UploadedFilesItem
                                            listId={key}
                                            file={file}
                                            showModal={this.showModal}
                                            closeModal={this.closeModal}
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

export default connector(Writer);
