import React from 'react';
import { Switch, Route } from 'react-router';
import { BrowserRouter as Router } from 'react-router-dom';
import Traffic from './screens/traffic/Traffic';
import MainPage from './screens/main-page/MainPage';
import PostsList from './screens/posts-list/PostsList';
import Writer from './screens/writer/Writer';
import FactWriter from './screens/fact-writer/FactWriter';
import Files from './screens/files/Files';
import { Generator } from './screens/generator/Generator';

export default class App extends React.Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path="/write" component={MainPage} />
                    <Route path="/writer" component={Writer} />
                    <Route path="/factwriter" component={FactWriter} />
                    <Route path="/list" component={PostsList} />
                    <Route path="/traffic" component={Traffic} />
                    <Route path="/files" component={Files} />
                    <Route path="/generator" component={Generator} />
                </Switch>
            </Router>
        );
    }
}
