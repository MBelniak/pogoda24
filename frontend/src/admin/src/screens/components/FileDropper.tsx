import React from 'react';
import Dropzone from 'react-dropzone';

interface FileDropperProps {
    onFilesAdded: (files) => void;
    customText?: string;
}

export default class FileDropper extends React.Component<FileDropperProps> {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Dropzone multiple={true} accept="image/*" onDrop={this.props.onFilesAdded} noClick={true}>
                {({ getRootProps, getInputProps }) => (
                    <div className="section dropzone" {...getRootProps()}>
                        <div className="container is-fluid">
                            <input {...getInputProps()} />
                            <h2 className="title is-4 centerHorizontally">
                                {this.props.customText ? this.props.customText : 'Upuść pliki tutaj'}
                            </h2>
                        </div>
                    </div>
                )}
            </Dropzone>
        );
    }
}
