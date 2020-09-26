import React from 'react';
import ReactDOM from 'react-dom';
import { closeModal, destroyModal, StyledModal } from './Modal';

export function showInfoModal(message: string) {
    destroyModal();
    ReactDOM.render(
        <StyledModal
            render={
                <div>
                    <p className="dialogMessage">{message}</p>
                    <button className="button is-primary" style={{ float: 'right' }} onClick={closeModal}>
                        Ok
                    </button>
                </div>
            }
        />,
        document.getElementById('modal')
    );
}
