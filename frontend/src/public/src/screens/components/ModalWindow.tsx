import React from 'react';
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

function destroyModal() {
    const modal = document.getElementById('modal');
    if (modal) {
        ReactDOM.unmountComponentAtNode(modal);
    }
}
export function showModal(render: JSX.Element) {
    destroyModal();
    ReactDOM.render(
        <Modal isOpen={true} style={customStyles}>
            {render}
        </Modal>,
        document.getElementById('modal')
    );
}
export function closeModal() {
    destroyModal();
}
