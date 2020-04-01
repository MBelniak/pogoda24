import React from 'react';
import {addImage, removeImage} from "./redux/actions";
import {connect, ConnectedProps} from "react-redux";

interface DirectUploadProps {
    submitHandler: (event) => void;
}

const connector = connect(
    state => ({ photos: state }),
    {
        onAddImage: addImage,
        onDeleteImage: removeImage
    });

type PropsFromRedux = ConnectedProps<typeof connector>

class DirectUpload extends React.Component<DirectUploadProps & PropsFromRedux, {}> {

    private fileInput;

    constructor(props) {
        super(props);
        this.fileInput = React.createRef();
        this.onImagesAdded = this.onImagesAdded.bind(this);
    }

    private onImagesAdded(files) {
        for (let file of files) {
            this.props.onAddImage(file);
        }
        this.fileInput.value = null;
    }

    render() {
        return (
            <div id="direct_upload">
                <h1>New Photo</h1>
                <h2>
                    Direct upload from the browser with React File
                    Upload
                </h2>
                <p>
                    You can also drag and drop an image file into the
                    dashed area.
                </p>
                <form onSubmit={this.props.submitHandler}>
                    <div className="form_line">
                        <label>Opis: </label>
                        <textarea required={true} cols={100}  rows={10} placeholder='Treść posta...'/>
                    </div>
                    <div className="form_line">
                        <label>Image:</label>
                        <div className="upload_button_holder">
                            <label className="upload_button"
                                   htmlFor="fileupload">
                                Upload
                            </label>
                            {/*<input*/}
                                {/*type="file"*/}
                                {/*name="mapka"*/}
                                {/*accept="image/*"*/}
                                {/*multiple={true}*/}
                                {/*ref={this.fileInput}*/}
                                {/*onChange={() => this.onImagesAdded(this.fileInput.files)}*/}
                            {/*/>*/}
                        </div>
                    </div>
                    <div className="form-line">
                        {/*<input type="submit"value="Wyślij"/>*/}
                    </div>
                </form>
                <h2>Status</h2>
            </div>
        )
    }
}

export default connector(DirectUpload);