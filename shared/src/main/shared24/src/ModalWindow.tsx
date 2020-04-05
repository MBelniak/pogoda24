import React from 'react';
import Modal from 'react-modal';

const customStyles = {
    content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)'
    }
};

export class ModalWindow extends React.Component<{isShown: boolean, render: () => JSX.Element}> {

    componentWillMount() {
        Modal.setAppElement('body');
    }

    render() {
        return (
                <Modal isOpen={this.props.isShown}
                         style={customStyles}>
                    {this.props.render}
                </Modal>
        )
    }
}