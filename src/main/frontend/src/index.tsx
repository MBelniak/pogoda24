import React from 'react';
import ReactDOM from 'react-dom';
import {MainPage} from "./MainPage";
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import {Ciekawostki} from "./Ciekawostki";
import {ONas} from "./ONas";
import {Prognozy} from "./Prognozy";

ReactDOM.render(
    <Router>
                <Switch>
                    <Route path="/about">
                        <ONas />
                    </Route>
                    <Route path="/ciekawostki">
                        <Ciekawostki />
                    </Route>
                    <Route path="/prognozy">
                        <Prognozy/>
                    </Route>
                    <Route path="/" >
                        <MainPage />
                    </Route>
                </Switch>
            </Router>
    , document.getElementById('root'));

