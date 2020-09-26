import React from 'react';
import { Image, Transformation } from 'cloudinary-react';
import { PostImage } from '../../model/PostImage';
import { closeModal, showModal } from '../components/modals/Modal';

interface UploadedFilesItemProps {
    file: PostImage;
    listId: number;
    onRemoveFile: (id: number) => void;
    onMoveForward: (id: number) => void;
    onMoveBackward: (id: number) => void;
}

export default class FileToUploadItem extends React.Component<UploadedFilesItemProps> {
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
        showModal(
            <div
                style={{
                    textAlign: 'center',
                    maxWidth: '100%',
                    maxHeight: '100%'
                }}
                onClick={() => closeModal()}>
                {this.props.file.file ? (
                    <img src={URL.createObjectURL(this.props.file.file)} />
                ) : (
                    <div onClick={() => closeModal()}>
                        <Image publicId={this.props.file.publicId} format="png" quality="auto">
                            <Transformation crop="fill" gravity="faces" />
                        </Image>
                    </div>
                )}
            </div>
        );
    }

    render() {
        return (
            <div className="uploadedFilesItem" onMouseOver={this.displayOverlay} onMouseOut={this.hideOverlay}>
                <div className="uploadedFilesItemContent">
                    {this.props.file.file ? (
                        <img src={URL.createObjectURL(this.props.file.file)} />
                    ) : (
                        <Image publicId={this.props.file.publicId} format="png" quality="auto">
                            <Transformation crop="fill" gravity="faces" />
                        </Image>
                    )}
                    <p style={{ wordWrap: 'break-word' }}>
                        {this.props.listId +
                            1 +
                            '. ' +
                            (this.props.file.file ? this.props.file.file.name : this.props.file.publicId)}
                    </p>
                </div>
                <div className="uploadedFilesItemOverlayWrapper" ref={this.overlayDiv} onClick={this.showPicture}>
                    <div className="uploadedFilesItemOverlay" />
                    <div className="uploadedFilesItemOverlayContent ">
                        <div
                            className="arrowLeft"
                            onClick={e => {
                                e.stopPropagation();
                                this.props.onMoveBackward(this.props.listId);
                            }}>
                            <i style={{ fontSize: '40px', margin: '10px' }} className={'fa fa-angle-left'} />
                        </div>
                        <div>
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
                            <i style={{ fontSize: '40px', margin: '10px' }} className={'fa fa-angle-right'} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
