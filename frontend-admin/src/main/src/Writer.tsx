import React from 'react';
import config from "./config/config";
import FileDropper from "./FileDropper";
import {connect, ConnectedProps} from "react-redux";
import img from './img/bg.jpg';
import UploadedFilesItem from "./UploadedFilesItem";
import {addFile} from "./redux/actions";
const Copyright = require('shared24').Copyright;
const LoadingIndicator = require('shared24').LoadingIndicator;
const {cloud_name, upload_preset, api_key, api_secret} = config;
const sha1 = require('js-sha1');

interface UploadedFile {
    id: number,
    file: File
}

const connector = connect((state: UploadedFile[]) => ({ files: state }),
    {
            onAddImage: addFile
    });

type PropsFromRedux = ConnectedProps<typeof connector>;

interface State {
    postType: PostType,
    addWarnToBar: boolean,
    postDescription: string,
    loading: boolean
}

interface Post {
    postDate: number,
    description: string
}

interface ForecastMap {
    imagePublicId: number,
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
        loading: false
    };

    private fileId;
    private fileInput;
    private warningCheckBox;
    private postDescription;

    constructor(props) {
        super(props);
        this.fileId = 0;
        this.fileInput = React.createRef();
        this.warningCheckBox = React.createRef();
        this.postDescription = React.createRef();
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onFilesAdded = this.onFilesAdded.bind(this);
        this.handleTextAreaChange = this.handleTextAreaChange.bind(this);
    }

    private onFilesAdded(files) {
        for (let file of files) {
            this.props.onAddImage(file);
        }
        this.fileInput.value = null;
    }

    private handleSubmit(event) {
        event.preventDefault();
        this.setState({loading: true});
        this.savePost();
    }

    private savePost() {
        const url = `https://api.cloudinary.com/v1_1/${cloud_name}/upload`;

        const uploadedFilesIds: number[] = [];
        const uploadPromises: Promise<Response>[] = this.props.files.map(file => {
            let timestamp = new Date().getTime().toString();
            timestamp = timestamp.substr(0, timestamp.toString().length-3);
            const signature = this.prepareSignature(file, timestamp);

            const formData = new FormData();
            formData.append('upload_preset', upload_preset);
            formData.append('timestamp', timestamp.toString());
            formData.append('public_id', file.file.name + timestamp);
            formData.append('api_key', api_key);
            formData.append('file', file.file);
            formData.append('signature', signature);

            return fetch(url, {
                method: 'POST',
                body: formData
            });
        });

        Promise.all(uploadPromises).then(responses => {
            if (responses.every(response => response && response.ok)) {
                responses.map(async response => {
                    await response.json().then(data => {
                        console.log(data);
                        uploadedFilesIds.push(data.public_id);
                    });
                });
                this.sendPostToBackend(uploadedFilesIds);
            } else {
                console.log("Nie udało się wysłać wszystkich obrazów.");
                this.showErrorMessage("Nie udało się wysłać wszystkich obrazów.");
                this.setState({loading: false});
            }
        }).catch(error => {
            console.log(error);
            this.showErrorMessage("Nie udało się wysłać obrazów. Powód: " + error);
            this.setState({loading: false});
        });
    }

    private prepareSignature(photo: UploadedFile, timestamp: string): string {
        const publicId = photo.file.name + timestamp;
        const hash = sha1.create();
        const stringToSign = "public_id=" + publicId + "&timestamp=" + timestamp + "&upload_preset=" + upload_preset
            + api_secret;
        hash.update(stringToSign);
        console.log(stringToSign);
        return hash;
    }

    private sendPostToBackend(uploadedFilesIds: number[]) {
        const requestBodyPost = {
            description: this.postDescription.current.value,
            postDate: new Date().getTime()
        };
        fetch('/api/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBodyPost)
        }).then(response => {
            if (response && response.ok) {  //post saved, send images ids
                response.json().then(data => {
                    this.sendImagesToBackend(data, uploadedFilesIds);
                })
            } else {
                console.log(response);
                this.setState({loading: false});
                this.showErrorMessage("Nie udało się zapisać posta. Odpowiedź z serwera: " + response);
            }
        }).catch(error => {
            console.log(error);
            this.showErrorMessage("Nie udało się zapisać posta. Powód: " + error);
            this.setState({loading: false});
        })
    }

    private sendImagesToBackend(data: any, uploadedFilesIds: number[]) {
        console.log(uploadedFilesIds);
        const requestBodyForecastMaps: ForecastMap[] = [];
        uploadedFilesIds.map(id => {
            requestBodyForecastMaps.push({
                imagePublicId: id,
                post: data
            })
        });
        fetch('/api/images', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBodyForecastMaps)
        }).then(response => {
            if (response && response.ok) {
                this.setState({loading: false});
                this.showSuccessMessage();
            } else {
                this.setState({loading: false});
                this.showErrorMessage("Coś poszło nie tak przy zapisywaniu obrazów.");
            }
        }).catch(error => {
            console.log(error);
            this.setState({loading: false});
            this.showErrorMessage("Nie udało się zapisać obrazów. Powód: " + error);
        })
    }

    private showSuccessMessage() {

    }

    private showErrorMessage(errorMessage: string) {

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
                <LoadingIndicator isShown={this.state.loading}/>
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
                                              ref={this.postDescription} onChange={this.handleTextAreaChange}
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
                            <p>Dodaj mapki z prognozą. Możesz przeciągnąć swoje mapki z dysku na kreskowane pole:</p>
                            <FileDropper/>
                            <span>...lub skorzystać z klasycznego dodawania plików: </span>
                            <input type="button" id="loadFile" value="Wybierz pliki"
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
                        <p style={{paddingTop: "10px"}}>Obecnie dodane pliki:</p>
                        <div className="columns is-multiline">
                            {this.props.files.map((file, key) => {
                                return (
                                    <div key={key} className="column is-one-quarter">
                                        <UploadedFilesItem file={file}/>)}
                                    </div>
                                )
                            })}
                        </div>
                        <div className="is-divider"/>
                        <form onSubmit={this.handleSubmit}>
                            <input type="submit" value="Wyślij"/>
                        </form>
                    </div>
                </div>
                <Copyright/>
            </section>
        )
    }
}

export default connector(Writer);