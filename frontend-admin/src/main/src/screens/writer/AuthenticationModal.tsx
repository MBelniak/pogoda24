import React from 'react';

interface AuthenticationModalProps {
    authFailed?: boolean;
    handleLoginClick: () => void;
    loginInputRef: React.Ref<HTMLInputElement>;
    passwordInputRef: React.Ref<HTMLInputElement>;
}

export const AuthenticationModal: React.FC<AuthenticationModalProps> = (props) => {

    const validateField = (htmlInput, additionalConstraint?: (value) => boolean) => {
        if (!htmlInput.value || (additionalConstraint ? !additionalConstraint(htmlInput.value) : false)) {
            htmlInput.classList.add('is-danger');
            return false;
        } else {
            htmlInput.classList.remove('is-danger');
            return true;
        }
    };

    return <div className="container mainLoginWindow">
        <span className="loginTitle">Pogoda 24/7</span>
        <span style={{ margin: '5px 0', fontSize: '18px' }}>Zaloguj się, aby zapisać post</span>
        <div className="mainForm" id="mainForm">
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
        </div>
    </div>
};