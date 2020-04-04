import React from 'react';
import { removeFile } from "./redux/actions";
import {connect, ConnectedProps} from "react-redux";

interface UploadedFile {
    id: number;
    file: File;
}

const connector = connect(() => ({ }),
    {
        onDeleteFile: removeFile
    });

type PropsFromRedux = ConnectedProps<typeof connector>;

interface UploadedFilesItemProps {
    file: UploadedFile;
}

class UploadedFilesItem extends React.Component<UploadedFilesItemProps & PropsFromRedux> {

    private overlayDiv;

    private deleteFile() {
        this.props.onDeleteFile(this.props.file.id);
    }

    private displayOverlay() {
        this.overlayDiv.current.style.display = "block";
    }

    private hideOverlay() {
        this.overlayDiv.current.style.display = "none";
    }

    constructor(props) {
        super(props);
        this.overlayDiv = React.createRef();
        this.displayOverlay = this.displayOverlay.bind(this);
        this.hideOverlay = this.hideOverlay.bind(this);
        this.deleteFile = this.deleteFile.bind(this);
    }


    render() {
        return (
            <div className="uploadedFilesItem" onMouseOver={this.displayOverlay} onMouseOut={this.hideOverlay}>
                <div className="uploadedFilesItemContent" >
                    <img src={URL.createObjectURL(this.props.file.file)} height="100%" width="100%"/>
                    <p style={{wordWrap: "break-word"}}>{this.props.file.file.name}</p>
                </div>
                <div className="uploadedFilesItemOverlayWrapper" ref={this.overlayDiv}>
                    <div className="uploadedFilesItemOverlay" />
                    <div className="uploadedFilesItemOverlayContent" >
                        <p style={{fontSize: "25px"}}>Usuń</p>
                        <div className="uploadedFilesItemDelete" onClick={this.deleteFile}/>
                    </div>
                </div>
            </div>
        )
    }
}

export default connector(UploadedFilesItem);