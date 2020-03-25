import React from 'react';
import { Router, Switch, Route, useHistory } from 'react-router';
import { MainPage } from './MainPage';
import { Writer } from './Writer';
import { Stats } from './Stats';
import { Traffic } from './Traffic';

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
                    <Route exact path="/" >
                        <MainPage />
                    </Route>
                    <Route path="/writer">
                        <Writer />
                    </Route>
                    <Route path="/elist">
                        <Stats />
                    </Route>
                    <Route path="/traffic">
                        <Traffic />
                    </Route>
                </Switch>
            </Router>
        )
    }
}