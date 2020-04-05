import React from 'react';
import {moveFileBack, moveFileForward, removeFile} from "./redux/actions";
import {connect, ConnectedProps} from "react-redux";

interface UploadedFile {
    id: number;
    file: File;
}

const connector = connect(() => ({ }),
    {
        onDeleteFile: removeFile,
        onMoveForward: moveFileForward,
        onMoveBack: moveFileBack
    });

type PropsFromRedux = ConnectedProps<typeof connector>;

interface UploadedFilesItemProps {
    file: UploadedFile,
    listId: number
}

class UploadedFilesItem extends React.Component<UploadedFilesItemProps & PropsFromRedux> {

    private overlayDiv;

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
    }


    render() {
        return (
            <div className="uploadedFilesItem" onMouseOver={this.displayOverlay} onMouseOut={this.hideOverlay}>
                <div className="uploadedFilesItemContent" >
                    <img src={URL.createObjectURL(this.props.file.file)} height="100%" width="100%"/>
                    <p style={{wordWrap: "break-word"}}>{this.props.listId + 1 + ". " + this.props.file.file.name}</p>
                </div>
                <div className="uploadedFilesItemOverlayWrapper" ref={this.overlayDiv}>
                    <div className="uploadedFilesItemOverlay" />
                    <div className="uploadedFilesItemOverlayContent" >
                        <div className="arrowLeft" onClick={() => this.props.onMoveBack(this.props.listId)}>
                            <span style={{fontSize: "40px", margin: "10px"}}>&lt;</span>
                        </div>
                        <div className="deleteFile">
                            <p style={{fontSize: "25px"}}>Usuń</p>
                            <div className="uploadedFilesItemDelete" onClick={() => this.props.onDeleteFile(this.props.file.id)}/>
                        </div>
                        <div className="arrowRight" onClick={() => this.props.onMoveForward(this.props.listId)}>
                            <span style={{fontSize: "40px", margin: "10px"}}>&gt;</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default connector(UploadedFilesItem);