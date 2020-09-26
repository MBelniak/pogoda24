import React from 'react';
import ReactDOM from 'react-dom';
import { destroyModal, StyledModal } from './Modal';

export function showActionModal(message: string, actions: { text: string; action: () => void }[]) {
    destroyModal();
    ReactDOM.render(
        <StyledModal
            render={
                <div>
                    <p className="dialogMessage">{message}</p>
                    {actions.map((action, key) => {
                        return (
                            <button
                                className={key == 0 ? 'button is-primary' : 'button is-secondary'}
                                style={{ float: 'right' }}
                                onClick={action.action}>
                                {action.text}
                            </button>
                        );
                    })}
                </div>
            }
        />,
        document.getElementById('modal')
    );
}
