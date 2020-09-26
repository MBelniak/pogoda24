import React from 'react';
import ReactDOM from 'react-dom';
import { validateField } from '../../../helpers/ValidateField';
import { closeModal, StyledModal } from './Modal';

type AuthenticationModalProps = {
    authFailed?: boolean;
    handleLoginClick: () => void;
    loginInputRef: React.Ref<HTMLInputElement>;
    passwordInputRef: React.Ref<HTMLInputElement>;
}

export function showAuthModal(props: AuthenticationModalProps) {
    closeModal();
    ReactDOM.render(
        <StyledModal
            render={
                <div className="container mainLoginWindow">
                    <span className="loginTitle">Pogoda 24/7</span>
                    <span style={{ margin: '5px 0', fontSize: '18px' }}>Zaloguj się, aby zapisać post</span>
                    <div className="mainForm">
                        {props.authFailed ? <p className="loginFailMessage">Nieprawidłowe dane logowania</p> : null}
                        <label className="label">Login: </label>
                        <input
                            className="input"
                            type="text"
                            placeholder="Login"
                            autoFocus={true}
                            maxLength={100}
                            ref={props.loginInputRef}
                            onKeyUp={e => validateField(e.target)}
                            onBlur={e => validateField(e.target)}
                        />
                        <br />
                        <label className="label">Hasło:</label>
                        <input
                            className="input"
                            type="password"
                            placeholder="Hasło"
                            maxLength={100}
                            ref={props.passwordInputRef}
                            onKeyUp={e => validateField(e.target)}
                            onBlur={e => validateField(e.target)}
                        />
                        <br />
                        <input
                            className="button is-primary"
                            style={{ marginTop: '10px' }}
                            type="submit"
                            value="Zaloguj"
                            onClick={props.handleLoginClick}
                        />
                        <input
                            className="button is-secondary"
                            style={{ marginTop: '10px' }}
                            type="submit"
                            value="Anuluj"
                            onClick={closeModal}
                        />
                    </div>
                </div>
            }
        />,
        document.getElementById('modal')
    );
}