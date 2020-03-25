import React from 'react';
import ReactDOM from 'react-dom';
import { Switch, Route } from 'react-router';
import { BrowserRouter as Router } from 'react-router-dom';
import { MainPage } from './MainPage';
import { Ciekawostki } from './Ciekawostki';
import { ONas } from './ONas';
import { Prognozy } from './Prognozy';
import {Navigation} from './Navigation';

import './css/newstyle.css';
import 'shared24/src/css/main.css';

ReactDOM.render(
    <Router>
        <Switch>
            <Route exact path="/" component={MainPage}/>
            <Route path="/about" component={ONas}/>
            <Route path="/ciekawostki" component={Ciekawostki}/>
            <Route path="/prognozy" component={Prognozy}/>
        </Switch>
    </Router>
    , document.getElementById('root'));

