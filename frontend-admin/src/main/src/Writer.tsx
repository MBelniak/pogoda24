import React from 'react';
import config from "./config/config";
import FileDropper from "./FileDropper";
import {connect, ConnectedProps} from "react-redux";
import img from './img/bg.jpg';
import UploadedFilesItem from "./UploadedFilesItem";
import {addFile} from "./redux/actions";
const Copyright = require('shared24').Copyright;
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
    postDescription: string
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
        postDescription: ""
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
        this.savePost();
        this.uploadFiles();
    }

    private savePost() {

    }

    private uploadFiles() {
        const url = `https://api.cloudinary.com/v1_1/${
            cloud_name
            }/upload`;

        const uploadedFilesIds: number[] = [];
        for (let photo of this.props.files) {
            let timestamp = new Date().getTime().toString();
            timestamp = timestamp.substr(0, timestamp.toString().length-3);
            const signature = this.prepareSignature(photo, timestamp);
            const formData = new FormData();
            formData.append('upload_preset', upload_preset);
            formData.append('timestamp', timestamp.toString());
            formData.append('public_id', photo.file.name + timestamp);
            formData.append('api_key', api_key);
            formData.append('file', photo.file);
            formData.append('signature', signature);
            fetch(url, {
                method: 'POST',
                body: formData
            }).then(response => {
                if (response && response.ok) {
                    response.json().then(data => {
                        console.log(data);
                        uploadedFilesIds.push(data.public_id);
                        if (uploadedFilesIds.length === this.props.files.length) {
                            this.sendPostToBackend(uploadedFilesIds)
                        }
                    });
                }
                else {

                }
            }).catch(error => {
                console.log(error);
                this.showErrorMessage("Nie udało się wysłać obrazów. Powód: " + error);
            });
        }
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
            }
        }).catch(error => {
            console.log(error);
            this.showErrorMessage("Nie udało się zapisać posta. Powód: " + error);
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
                this.showSuccessMessage();
            } else {
                this.showErrorMessage("Coś poszło nie tak przy zapisywaniu obrazów.");
            }
        }).catch(error => {
            console.log(error);
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