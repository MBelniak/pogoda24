import React from 'react';
import ReactDOM from 'react-dom';
import { Switch, Route } from 'react-router';
import { BrowserRouter as Router } from 'react-router-dom';
import { MainPage } from './MainPage';
import { Prognozy } from './Prognozy';
import { Ostrzezenia } from './Ostrzezenia';
import { Ciekawostki } from './Ciekawostki';
import { ONas } from './ONas';
import { CloudinaryContext } from 'cloudinary-react';
import config from './config/config';
const Navigation = require('shared24').Navigation;

import './css/main.css';
import './sass/main.scss';
import 'shared24/src/css/main.css';

const {cloud_name, upload_preset, api_key, api_secret} = config;

ReactDOM.render(
    <CloudinaryContext cloudName={cloud_name} api_key={api_key} api_secret={api_secret} upload_preset={upload_preset}>
        <Router>
            <Switch>
                <Route exact path="/" component={MainPage}/>
                <Route path="/prognozy" component={Prognozy}/>
                <Route path="/ostrzezenia" component={Ostrzezenia}/>
                <Route path="/ciekawostki" component={Ciekawostki}/>
                <Route path="/about" component={ONas}/>
            </Switch>
        </Router>
    </CloudinaryContext>
    , document.getElementById('root'));

