import React, { FunctionComponent, ReactElement } from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        maxHeight: '90%',
        maxWidth: '90%'
    },
    overlay: {
        zIndex: 100
    }
};

Modal.setAppElement('body');

export function closeModal() {
    const modal = document.getElementById('modal');
    if (modal) {
        ReactDOM.unmountComponentAtNode(modal); //This is a no-no, but I want to have the modal logic like that sooo much :D
    }
}

type ModalProps = {
    render: JSX.Element;
};

export const StyledModal: FunctionComponent<ModalProps> = ({ render }: ModalProps): ReactElement => (
    <Modal isOpen={true} style={customStyles}>
        {render}
    </Modal>
);

export function showModal(render: JSX.Element) {
    closeModal();
    ReactDOM.render(<StyledModal render={render} />, document.getElementById('modal'));
}
