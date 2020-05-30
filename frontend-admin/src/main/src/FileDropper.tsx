import React from 'react';
import Dropzone from 'react-dropzone';

interface FileDropperProps {
    onFilesAdded: (files) => void;
}

export default class FileDropper extends React.Component<FileDropperProps> {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Dropzone
                multiple={true}
                accept="image/*"
                onDrop={this.props.onFilesAdded}
                noClick={true}>
                {({ getRootProps, getInputProps }) => (
                    <div className="section dropzone" {...getRootProps()}>
                        <div className="container fluid">
                            <input {...getInputProps()} />
                            <h2 className="title is-4 centerHorizontally">
                                Upuść pliki tutaj
                            </h2>
                        </div>
                    </div>
                )}
            </Dropzone>
        );
    }
}
