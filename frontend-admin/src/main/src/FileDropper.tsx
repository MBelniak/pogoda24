import React from 'react';
import Dropzone from 'react-dropzone';
import {addImage, removeImage} from "./redux/actions";
import {connect, ConnectedProps} from "react-redux";
import DirectUpload from "./DirectUpload";

interface FileDropperProps {
    submitHandler: (event) => void;
}

interface UploadedPhoto {
    id: number;
    content: File;
}

const connector = connect(
    (state: UploadedPhoto[]) => ({ }),
    {
        onAddImage: addImage,
        onDeleteImage: removeImage
    });


type PropsFromRedux = ConnectedProps<typeof connector>

class FileDropper extends React.Component<FileDropperProps & PropsFromRedux, {}> {

    private dropzone;

    constructor(props) {
        super(props);
        this.dropzone = React.createRef();
        this.onImagesAdded = this.onImagesAdded.bind(this);
    }

    private onImagesAdded(files) {
        for (let file of files) {
            this.props.onAddImage(file);
        }
        this.dropzone.removeAllFiles();
    }

    render() {
        return (
            <Dropzone
                multiple={true}
                accept="image/*"
                onDrop={this.onImagesAdded}
                ref={this.dropzone}
            >
                {({getRootProps, getInputProps}) => (
                    <div className="section" {...getRootProps()}>
                        <div className="container fluid">
                            <input {...getInputProps()} />
                            <p>Drag 'n' drop some files here, or click to select files</p>
                        </div>
                        <DirectUpload submitHandler={this.props.submitHandler} />
                    </div>
                )}
            </Dropzone>
        )
    }
}

export default connector(FileDropper);