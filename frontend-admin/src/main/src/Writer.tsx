import React from 'react';
import config from "./config/config";
import FileDropper from "./FileDropper";
import {connect} from "react-redux";
const {cloud_name, upload_preset, api_key, api_secret} = config;

const mapStateToProps = state => {
    const photos = state.uploadedPhotos || [];
    return { photos };
};

interface UploadedPhoto {
    id: number;
    file: File;
}

interface PropsFromRedux {
    photos: UploadedPhoto[];
}
class Writer extends React.Component<PropsFromRedux> {

    private photoId;
    constructor(props) {
        super(props);
        this.photoId = 0;
        this.handleSubmit = this.handleSubmit.bind(this);
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

        for (let photo of this.props.photos) {
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

    render() {
        return (
            <div>
                <h2>Witaj w edytorze wpisów.</h2>
                <p>Możesz tutaj tworzyć nowe posty do umieszczenia na stronie.</p>
                <FileDropper submitHandler={this.handleSubmit} />
            </div>
        )
    }
}

export default connect(mapStateToProps)(Writer);