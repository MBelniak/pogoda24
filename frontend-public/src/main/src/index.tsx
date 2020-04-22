import React from 'react';
import ReactDOM from 'react-dom';
import { CloudinaryContext } from 'cloudinary-react';
import config from './config/config';
import './sass/main.scss';
import 'shared24/src/sass/main.scss';
import App from './App';

const images = require.context('./img/', false, /\.(png|jpe?g|svg)$/);
const Navigation = require('shared24').Navigation;

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
