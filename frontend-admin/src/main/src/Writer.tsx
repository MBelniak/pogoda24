import React from 'react';
import config from "./config/config";
import FileDropper from "./FileDropper";
import {connect, ConnectedProps} from "react-redux";
import img from './img/bg.jpg';
import UploadedFilesItem from "./UploadedFilesItem";
import {addFile, clearFiles} from "./redux/actions";
const Copyright = require('shared24').Copyright;
const LoadingIndicator = require('shared24').LoadingIndicator;
const ModalWindow = require('shared24').ModalWindow;
const {cloud_name, upload_preset, api_key, api_secret} = config;
const sha1 = require('js-sha1');

interface UploadedFile {
    id: number,
    file: File,
    publicId: string
}

const connector = connect((state: UploadedFile[]) => ({ files: state }),
    {
            onAddImage: addFile,
            onClearFiles: clearFiles
    });

type PropsFromRedux = ConnectedProps<typeof connector>;

interface State {
    postType: PostType,
    addWarnToBar: boolean,
    postDescription: string,
    showModal: boolean,
    renderModal: JSX.Element | undefined
}

interface Post {
    postDate: number,
    description: string
}

interface ForecastMap {
    imagePublicId: string,
    ordinal: number,
    post: Post;
}

enum PostType {
    Prognoza = "prognozy",
    Ostrtzezenie = "ostrzeżenia",
    Ciekawostka = "ciekawostki"
}

class Writer extends React.Component<PropsFromRedux, State> {

    state: State = {
        postType: PostType.Prognoza,
        addWarnToBar: false,
        postDescription: "",
        showModal: false,
        renderModal: undefined
    };

    private fileId;
    private fileInput;
    private warningCheckBox;
    private postDescriptionTextArea;

    constructor(props) {
        super(props);
        this.fileId = 0;
        this.fileInput = React.createRef();
        this.warningCheckBox = React.createRef();
        this.postDescriptionTextArea = React.createRef();
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onFilesAdded = this.onFilesAdded.bind(this);
        this.handleTextAreaChange = this.handleTextAreaChange.bind(this);
        this.clearEverything = this.clearEverything.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    private onFilesAdded(files) {
        for (let file of files) {
            this.props.onAddImage(file);
        }
        this.fileInput.value = null;
    }

    private showModal(toRender: JSX.Element) {
        this.setState({showModal: true, renderModal: toRender});
    }

    private closeModal() {
        this.setState({showModal: false});
    }

    private handleSubmit(event) {
        event.preventDefault();
        this.showModal(<LoadingIndicator />);
        const responsePromise = this.sendPostToBackend();

        responsePromise.then(response => {
            if (response && response.ok) {
                response.json().then((data: any) => {
                    if (data !== null) {    //post saved, send images to cloudinary
                        const uploadPromises: Promise<Response>[] = this.uploadImages();
                        Promise.all(uploadPromises).then(responses => {
                            if (responses.every(response => response && response.ok)) { //all images uploaded successfully
                                this.sendImagesPublicIdsToBackend(data);
                            } else {
                                responses = responses.filter(response => !response || !response.ok);
                                console.log(responses.toString());
                                this.closeModal();
                                this.showErrorMessage("Nie udało się wysłać wszystkich plików. Post nie został zapisany.");
                                this.removePostFromBackend(data.id);
                            }
                        }).catch(error => {
                            console.log(error);
                            this.closeModal();
                            this.showErrorMessage("Wystąpił błąd przy wysyłaniu plików. Post nie został zapisany. Powód: " + error);
                            this.removePostFromBackend(data.id);
                        });
                    } else {
                        this.closeModal();
                        this.showErrorMessage("Wystąpił błąd przy zapisywaniu postu. Post nie został zapisany.");
                        this.removePostFromBackend(data.id);
                    }
                });
            } else {
                console.log(response);
                this.closeModal();
                this.showErrorMessage("Nie udało się zapisać postu. Odpowiedź z serwera: " + response.statusText);

            }
        }).catch(error => {
            console.log(error);
            this.closeModal();
            this.showErrorMessage("Nie udało się zapisać postu. Powód: " + error);
        })
    }

    private sendPostToBackend(): Promise<Response> {
        let requestBodyPost;
        if (this.state.postType === PostType.Ostrtzezenie) {
            //TODO request body for warning
        } else {
            requestBodyPost = {
                description: this.postDescriptionTextArea.current.value,
                postDate: new Date().getTime()
            };
        }
        const url = this.state.postType === PostType.Prognoza ? "/api/posts"
            : this.state.postType === PostType.Ostrtzezenie ? "/api/warnings"
                : "/api/facts";
        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBodyPost)
        });
    }

    private uploadImages() {
        const url = `https://api.cloudinary.com/v1_1/${cloud_name}/upload`;

        return this.props.files.map(file => {
            let timestamp = new Date().getTime().toString();
            timestamp = timestamp.substr(0, timestamp.toString().length-3);
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
        const stringToSign = "public_id=" + publicId + "&timestamp=" + timestamp + "&upload_preset=" + upload_preset
            + api_secret;
        hash.update(stringToSign);
        return hash;
    }

    private sendImagesPublicIdsToBackend(data: any) {
        const requestBodyForecastMaps: ForecastMap[] = [];
        const uploadedFiles = this.props.files;
        for (let i = 0; i < uploadedFiles.length; ++i) {
            requestBodyForecastMaps.push({
                imagePublicId: uploadedFiles[i].publicId,
                ordinal: i,
                post: data
            });
        }
        fetch('/api/images', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBodyForecastMaps)
        }).then(response => {
            if (response && response.ok) {
                this.closeModal();
                this.showSuccessMessage();
            } else {
                this.closeModal();
                this.showErrorMessage("Coś poszło nie tak przy zapisywaniu obrazów.");
            }
        }).catch(error => {
            console.log(error);
            this.closeModal();
            this.showErrorMessage("Nie udało się zapisać obrazów. Powód: " + error);
        })
    }

    private removePostFromBackend(postId: number) {

    }

    private showSuccessMessage() {
        let postType;
        switch (this.state.postType) {
            case (PostType.Prognoza): {
                postType = "prognozę.";
                break;
            }
            case (PostType.Ostrtzezenie): {
                postType = "ostrzeżenie.";
                break;
            }
            case (PostType.Ciekawostka): {
                postType = "ciekawostkę.";
                break;
            }
        }
        const toRender = (
            <div>
                <p className="dialogMessage">Pomyślnie zapisano {postType}</p>
                <button className="button" style={{float: "right"}} onClick={this.clearEverything}>Ok</button>
            </div>
        );
        this.showModal(toRender);
    }

    private showErrorMessage(errorMessage: string) {
        const toRender = (
            <div>
                <p className="dialogMessage">{errorMessage}</p>
                <button className="button" style={{float: "right"}} onClick={this.closeModal}>Ok</button>
            </div>
        );
        this.showModal(toRender);
    }

    private clearEverything() {
        this.props.onClearFiles();
        this.setState({postType: PostType.Prognoza, postDescription: ""});
        this.closeModal();
    }

    private warningOptionChosen() {
        if (this.state.postType === PostType.Ostrtzezenie) {
            return (
                <div>
                    <input id="addToBar" type="checkbox"
                           onChange={() => this.setState({addWarnToBar: !this.state.addWarnToBar})}
                           ref={this.warningCheckBox}/>
                    <label htmlFor="addToBar"> Dodaj do paska u góry strony</label>
                </div>
            )
        }
        return <br/>;
    }

    private handleTextAreaChange(event) {
        this.setState({postDescription: event.target.value});
    }

    render() {
        return (
            <section>
                <ModalWindow isShown={this.state.showModal} render={this.state.renderModal}/>
                <div className="container fluid">
                    <img src={img} className="bgimg"/>
                    <h2 className="title">Witaj w edytorze wpisów.</h2>
                    <h2 className="title is-5">Możesz tutaj tworzyć nowe posty do umieszczenia na stronie.</h2>
                    <div className="container fluid">
                        <div className="writerForm">
                            <div className="columns">
                                <div className="column">
                                    <p>Dodaj opis do {this.state.postType.toString()}: </p>
                                    <textarea required={true} cols={100} rows={10} placeholder='Treść posta...'
                                              ref={this.postDescriptionTextArea} onChange={this.handleTextAreaChange}
                                              value={this.state.postDescription}/>
                                </div>
                                <div className="column">
                                    <p>Typ postu: </p>
                                    <input type="radio" id="forecast" name="postType" value="Prognoza"
                                           checked={this.state.postType === PostType.Prognoza}
                                           onChange={() => this.setState({
                                               postType: PostType.Prognoza,
                                               addWarnToBar: false
                                           })}/>
                                    <label htmlFor="forecast"> Prognoza</label><br/>
                                    <input type="radio" id="warning" name="postType" value="Ostrzeżenie"
                                           checked={this.state.postType === PostType.Ostrtzezenie}
                                           onChange={() => this.setState({postType: PostType.Ostrtzezenie})}/>
                                    <label htmlFor="warning"> Ostrzeżenie</label>
                                    {this.warningOptionChosen()}
                                    <input type="radio" id="ciekawostka" name="postType" value="Ciekawostka"
                                           checked={this.state.postType === PostType.Ciekawostka}
                                           onChange={() => this.setState({
                                               postType: PostType.Ciekawostka,
                                               addWarnToBar: false
                                           })}/>
                                    <label htmlFor="ciekawostka"> Ciekawostka</label>
                                </div>
                            </div>
                            <p>Dodaj mapki z prognozą/ostrzeżeniem lub zdjęcia do ciekawostki.
                                Możesz przeciągnąć swoje pliki z dysku na kreskowane pole:</p>
                            <FileDropper/>
                            <p>...lub skorzystać z klasycznego dodawania plików: </p>
                            <input type="button" className="button" id="loadFile" value="Wybierz pliki"
                                   onClick={() => document.getElementById('mapsFiles')?.click()}/>
                            <input
                                type="file"
                                id="mapsFiles"
                                style={{display: "none"}}
                                accept="image/*"
                                multiple={true}
                                ref={this.fileInput}
                                onChange={() => this.onFilesAdded(this.fileInput.files)}
                            />
                        </div>
                        <p style={{paddingTop: "10px"}}>Pamiętaj, aby przed wysłaniem plików ustawić je w odpowiedniej kolejnośći!</p>
                        <p style={{paddingTop: "10px"}}>Obecnie dodane pliki:</p>
                        <div className="columns is-multiline">
                            {this.props.files.map((file, key) => {
                                return (
                                    <div key={key} className="column is-one-quarter">
                                        <UploadedFilesItem listId={key} file={file}/>
                                    </div>
                                )
                            })}
                        </div>
                        <div className="is-divider"/>
                        <form onSubmit={this.handleSubmit}>
                            <input type="submit" className="button" value="Wyślij"/>
                        </form>
                    </div>
                </div>
                <Copyright/>
            </section>
        )
    }
}

export default connector(Writer);