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
        maxHeight: '80%',
        maxWidth: '80%'
    }
};

Modal.setAppElement('body');

function destroyModal() {
    const modal = document.getElementById('modal');
    if (modal) {
        ReactDOM.unmountComponentAtNode(modal); //This is a no-no, but I want to have the modal logic like that sooo much :D
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
