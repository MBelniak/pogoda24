import React from 'react';
import { moveFileBack, moveFileForward, removeFile } from './redux/actions';
import { connect, ConnectedProps } from 'react-redux';

interface UploadedFile {
    id: number;
    file: File;
}

const connector = connect(() => ({}), {
    onDeleteFile: removeFile,
    onMoveForward: moveFileForward,
    onMoveBack: moveFileBack
});

type PropsFromRedux = ConnectedProps<typeof connector>;

interface UploadedFilesItemProps {
    file: UploadedFile;
    listId: number;
    showModal: (toRender: JSX.Element) => void;
    closeModal: () => void;
}

class UploadedFilesItem extends React.Component<
    UploadedFilesItemProps & PropsFromRedux
> {
    private overlayDiv;

    constructor(props) {
        super(props);
        this.overlayDiv = React.createRef();
        this.displayOverlay = this.displayOverlay.bind(this);
        this.hideOverlay = this.hideOverlay.bind(this);
        this.showPicture = this.showPicture.bind(this);
    }

    private displayOverlay() {
        this.overlayDiv.current.style.display = 'block';
    }

    private hideOverlay() {
        this.overlayDiv.current.style.display = 'none';
    }

    private showPicture() {
        this.hideOverlay();
        this.props.showModal(
            <div style={{ width: '100%', height: '100%', textAlign: 'center' }}>
                <p className="dialogMessage">Kliknij zdjęcie by zamknąć</p>
                <img
                    src={URL.createObjectURL(this.props.file.file)}
                    onClick={() => this.props.closeModal()}
                />
            </div>
        );
    }

    render() {
        return (
            <div
                className="uploadedFilesItem"
                onMouseOver={this.displayOverlay}
                onMouseOut={this.hideOverlay}>
                <div className="uploadedFilesItemContent">
                    <img
                        src={URL.createObjectURL(this.props.file.file)}
                        height="100%"
                        width="100%"
                    />
                    <p style={{ wordWrap: 'break-word' }}>
                        {this.props.listId +
                            1 +
                            '. ' +
                            this.props.file.file.name}
                    </p>
                </div>
                <div
                    className="uploadedFilesItemOverlayWrapper"
                    ref={this.overlayDiv}
                    onClick={this.showPicture}>
                    <div className="uploadedFilesItemOverlay" />
                    <div className="uploadedFilesItemOverlayContent">
                        <div
                            className="arrowLeft"
                            onClick={e => {
                                e.stopPropagation();
                                this.props.onMoveBack(this.props.listId);
                            }}>
                            <span style={{ fontSize: '40px', margin: '10px' }}>
                                &lt;
                            </span>
                        </div>
                        <div className="deleteFile">
                            <p style={{ fontSize: '25px' }}>Usuń</p>
                            <div
                                className="uploadedFilesItemDelete"
                                onClick={e => {
                                    e.stopPropagation();
                                    this.props.onDeleteFile(this.props.file.id);
                                }}
                            />
                        </div>
                        <div
                            className="arrowRight"
                            onClick={e => {
                                e.stopPropagation();
                                this.props.onMoveForward(this.props.listId);
                            }}>
                            <span style={{ fontSize: '40px', margin: '10px' }}>
                                &gt;
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connector(UploadedFilesItem);
