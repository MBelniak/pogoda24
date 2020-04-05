import React from 'react';
import Dropzone from 'react-dropzone';
import { addFile } from "./redux/actions";
import {connect, ConnectedProps} from "react-redux";

interface UploadedFile {
    id: number;
    content: File;
}

const connector = connect(
    (state: UploadedFile[]) => ({ }),
    {
        onAddFile: addFile
    });


type PropsFromRedux = ConnectedProps<typeof connector>

class FileDropper extends React.Component<PropsFromRedux, {}> {

    constructor(props) {
        super(props);
        this.onFilesAdded = this.onFilesAdded.bind(this);
    }

    private onFilesAdded(files) {
        for (let file of files) {
            this.props.onAddFile(file);
        }
        console.log("Images added via dropzone.");
    }

    render() {
        return (
            <Dropzone
                multiple={true}
                accept="image/*"
                onDrop={this.onFilesAdded}
                noClick={true}
            >
                {({getRootProps, getInputProps}) => (
                    <div className="section dropzone" {...getRootProps()}>
                        <div className="container fluid">
                            <input {...getInputProps()} />
                            <h2 className="title is-4 dropzone-text">Upuść pliki tutaj</h2>
                        </div>
                    </div>
                )}
            </Dropzone>
        )
    }
}

export default connector(FileDropper);