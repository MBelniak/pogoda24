import React from 'react';
import ReactDOM from 'react-dom';
import { Switch, Route } from 'react-router';
import { BrowserRouter as Router } from 'react-router-dom';
import MainPage from './MainPage';
import Writer from './Writer';
import PostsList from './PostsList';
import Traffic from './Traffic';
import { CloudinaryContext } from 'cloudinary-react';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import './sass/main.scss';
import 'shared24/src/sass/main.scss';
const Navigation = require('shared24').Navigation;

ReactDOM.render(
    <Provider store={store}>
        <Router>
            <Switch>
                <Route exact path="/write" component={MainPage}/>
                <Route path="/writer" component={Writer}/>
                <Route path="/elist" component={PostsList} />
                <Route path="/traffic" component={Traffic} />
            </Switch>
        </Router>
    </Provider>
    , document.getElementById('root'));

