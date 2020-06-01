import React from 'react';
import { Switch, Route } from 'react-router';
import { BrowserRouter as Router } from 'react-router-dom';
import { MainPage } from './MainPage';
import { ONas } from './ONas';
import { CloudinaryContext } from 'cloudinary-react';
import './sass/main.scss';
import 'shared24/src/sass/main.scss';
import { TopBar } from './TopBar';
import PostView from './PostView';
import { Posts } from './Posts';
import { PostType } from './Post';
const Copyright = require('shared24').Copyright;

export default class App extends React.Component {
    private abortController;

    constructor(props) {
        super(props);
        this.abortController = new AbortController();
    }

    private additionalRender() {
        return (
            <div className="social-container">
                <a
                    href="https://twitter.com"
                    className="icon-button twitter">
                    <i className="icon-twitter" />
                    <span />
                </a>
                <a href="https://www.facebook.com/Polska24nadobe"
                   target="_blank" className="icon-button facebook">
                    <i className="icon-facebook" />
                    <span />
                </a>
            </div>
        );
    }

    componentDidMount() {}

    componentWillUnmount() {
        this.abortController.abort();
    }

    render() {
        return (
            <Router>
                <div className="main">
                    <TopBar />
                    <Switch>
                        <Route exact path="/" component={MainPage} />
                        <Route path="/prognozy">
                            <Posts postType={PostType.FORECAST} />
                        </Route>
                        <Route path="/ostrzezenia">
                            <Posts postType={PostType.WARNING} />
                        </Route>
                        <Route path="/ciekawostki">
                            <Posts postType={PostType.FACT} />
                        </Route>
                        <Route path="/about" component={ONas} />
                        <Route
                            path="/posts/([a-zA-Z0-9]+)"
                            component={PostView}
                        />
                    </Switch>
                    <Copyright additionalRender={this.additionalRender} />
                </div>
            </Router>
        );
    }
}
