import React from 'react';
import ReactDOM from 'react-dom';
import { Switch, Route } from 'react-router';
import { BrowserRouter as Router } from 'react-router-dom';
import { MainPage } from './MainPage';
import { Writer } from './Writer';
import { Stats } from './Stats';
import { Traffic } from './Traffic';
import './css/main.css';
import './sass/main.scss';
const Navigation = require('shared24').Navigation;

ReactDOM.render(
    <Router>
        <Switch>
            <Route exact path="/write" component={MainPage} />
            <Route path="/writer" component={Writer} />
            <Route path="/elist" component={Stats} />
            <Route path="/traffic" component={Traffic} />
            <Route path="/" component={MainPage} />
        </Switch>
    </Router>
    , document.getElementById('root'));

