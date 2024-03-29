import React from 'react';
import ReactDOM from 'react-dom';
import { CloudinaryContext } from 'cloudinary-react';
import config from './config/config';
import App from './App';
const suneditorStyle = require('suneditor/dist/css/suneditor.min.css');
import './sass/main.scss';

const { cloud_name, upload_preset, api_key, api_secret } = config;

ReactDOM.render(
    <CloudinaryContext
        cloudName={cloud_name}
        api_key={api_key}
        api_secret={api_secret}
        upload_preset={upload_preset}>
            <App />
    </CloudinaryContext>,
    document.getElementById('root')
);
