import React from 'react';
import { closeModal, showModal } from './redux/actions';
import { connect, ConnectedProps } from 'react-redux';
import { Image, Transformation } from 'cloudinary-react';
import { FileToUpload } from './Writer';

const connector = connect(null, {
    showModal: showModal,
    closeModal: closeModal
});

type PropsFromRedux = ConnectedProps<typeof connector>;

interface UploadedFilesItemProps {
    file: FileToUpload;
    listId: number;
    onRemoveFile: (id: number) => void;
    onMoveForward: (id: number) => void;
    onMoveBackward: (id: number) => void;
}

class FileToUploadItem extends React.Component<
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
                {this.props.file.file ? (
                    <img
                        src={URL.createObjectURL(this.props.file.file)}
                        onClick={() => this.props.closeModal()}
                    />
                ) : (
                    <div onClick={() => this.props.closeModal()}>
                        <Image
                            publicId={this.props.file.publicId}
                            format="png"
                            quality="auto">
                            <Transformation crop="fill" gravity="faces" />
                        </Image>
                    </div>
                )}
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
                    {this.props.file.file ? (
                        <img
                            src={URL.createObjectURL(this.props.file.file)}
                            height="100%"
                            width="100%"
                        />
                    ) : (
                        <Image
                            publicId={this.props.file.publicId}
                            format="png"
                            quality="auto">
                            <Transformation crop="fill" gravity="faces" />
                        </Image>
                    )}
                    <p style={{ wordWrap: 'break-word' }}>
                        {this.props.listId +
                            1 +
                            '. ' +
                            (this.props.file.file
                                ? this.props.file.file.name
                                : this.props.file.publicId)}
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
                                this.props.onMoveBackward(this.props.listId);
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
                                    this.props.onRemoveFile(this.props.file.id);
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

export default connector(FileToUploadItem);
