import React from 'react';
import { Switch, Route } from 'react-router';
import { BrowserRouter as Router } from 'react-router-dom';
import Traffic from './Traffic';
import MainPage from './MainPage';
import PostsList from './PostsList';
import Writer from './Writer';

export default class App extends React.Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path="/write" component={MainPage} />
                    <Route path="/writer" component={Writer} />
                    <Route path="/elist" component={PostsList} />
                    <Route path="/traffic" component={Traffic} />
                </Switch>
            </Router>
        );
    }
}
