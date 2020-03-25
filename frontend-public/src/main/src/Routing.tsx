import React from 'react';
import { Router, Switch, Route, useHistory } from 'react-router';
import {MainPage} from './MainPage';
import {Ciekawostki} from './Ciekawostki';
import {ONas} from './ONas';
import {Prognozy} from './Prognozy';

export class Routing extends React.Component {

    private history = useHistory();

    componentDidMount() {
        window.onpopstate  = (e) => {
            if (this.history.length != 0) {
                e.preventDefault();
                this.history.goBack();
            }
        };
    }

    render() {
        return (
            <Router history={this.history}>
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
        )
    }
}