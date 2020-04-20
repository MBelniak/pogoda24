import React from 'react';
import ReactDOM from 'react-dom';
import { CloudinaryContext } from 'cloudinary-react';
import { Provider } from 'react-redux';
import config from './config/config';
import App from './App';
import { store } from './redux/store';
import './sass/main.scss';
import 'shared24/src/sass/main.scss';

const Navigation = require('shared24').Navigation;
const { cloud_name, upload_preset, api_key, api_secret } = config;

ReactDOM.render(
    <CloudinaryContext
        cloudName={cloud_name}
        api_key={api_key}
        api_secret={api_secret}
        upload_preset={upload_preset}>
        <Provider store={store}>
            <App />
        </Provider>
    </CloudinaryContext>,
    document.getElementById('root')
);
