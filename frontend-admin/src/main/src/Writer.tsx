import React from 'react';
import config from "./config/config";
import FileDropper from "./FileDropper";
import {connect, ConnectedProps} from "react-redux";
import img from './img/bg.jpg';
import UploadedFilesItem from "./UploadedFilesItem";
import {addFile} from "./redux/actions";
const Copyright = require('shared24').Copyright;
const {cloud_name, upload_preset, api_key, api_secret} = config;

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
    addWarnToBar: boolean
}

enum PostType {
    Prognoza = "prognozy",
    Ostrtzezenie = "ostrzeżenia",
    Ciekawostka = "ciekawostki"
}

class Writer extends React.Component<PropsFromRedux, State> {

    state: State = {
        postType: PostType.Prognoza,
        addWarnToBar: false
    };

    private fileId;
    private fileInput;
    private warningCheckBox;

    constructor(props) {
        super(props);
        this.fileId = 0;
        this.fileInput = React.createRef();
        this.warningCheckBox = React.createRef();
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onFilesAdded = this.onFilesAdded.bind(this);
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

        for (let photo of this.props.files) {
            const formData = new FormData();
            formData.append('upload_preset', upload_preset);
            formData.append('file', photo.file);
            formData.append('multiple', 'true');
            formData.append('public_id', photo.file.name);
            formData.append('api_key', api_key);
            formData.append('api_secret', api_secret);
            fetch(url, {
                method: 'POST',
                body: formData
            }).then(response => response.json().then(data => {
                this.sendPublicIdToBackend(data.publicId);
            })).catch(error => console.log(error));
        }
    }

    private sendPublicIdToBackend(publicId) {

    }

    private warningOptionChosen() {
        if (this.state.postType === PostType.Ostrtzezenie) {
            return (
                <div>
                    <input id="addToBar" type="checkbox" onChange={event => this.setState({addWarnToBar: !this.state.addWarnToBar})} ref={this.warningCheckBox}/>
                    <label htmlFor="addToBar"> Dodaj do paska u góry strony</label>
                </div>
            )
        }
        return <br/>;
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
                                    <textarea required={true} cols={100}  rows={10} placeholder='Treść posta...'/>
                                </div>
                                <div className="column">
                                    <p>Typ postu: </p>
                                    <input type="radio" id="forecast" name="postType" value="Prognoza" checked={this.state.postType === PostType.Prognoza}
                                           onChange={() => this.setState({postType: PostType.Prognoza, addWarnToBar: false})}/>
                                    <label htmlFor="forecast"> Prognoza</label><br/>
                                    <input type="radio" id="warning" name="postType" value="Ostrzeżenie" checked={this.state.postType === PostType.Ostrtzezenie}
                                           onChange={() => this.setState({postType: PostType.Ostrtzezenie})}/>
                                    <label htmlFor="warning"> Ostrzeżenie</label>
                                    {this.warningOptionChosen()}
                                    <input type="radio" id="ciekawostka" name="postType" value="Ciekawostka" checked={this.state.postType === PostType.Ciekawostka}
                                           onChange={() => this.setState({postType: PostType.Ciekawostka, addWarnToBar: false})}/>
                                    <label htmlFor="ciekawostka"> Ciekawostka</label>
                                </div>
                            </div>
                            <p>Dodaj mapki z prognozą. Możesz przeciągnąć swoje mapki z dysku na kreskowane pole:</p>
                            <FileDropper />
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
                                        <UploadedFilesItem key={key} file={file}/>)}
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