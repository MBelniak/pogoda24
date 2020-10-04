import React from 'react';
import { Switch, Route } from 'react-router';
import { BrowserRouter as Router } from 'react-router-dom';
import { MainPage } from './screens/main-page/MainPage';
import { ONas } from './screens/about/ONas';
import './sass/main.scss';
import { TopBar } from './screens/components/TopBar';
import PostView from './screens/post-view/PostView';
import { Posts } from './screens/components/Posts';
import { PostType } from './model/Post';
import Copyright from '@shared/components/Copyright';
import styles from '@shared/scss/main.scss';

export default class App extends React.Component {

    private renderSocialMedia() {
        return (
            <div className="social-container">
                <a href="https://www.facebook.com/Polska24nadobe"
                   target="_blank" className="icon-button facebook">
                    <i className="fa fa-facebook"/>
                    <span />
                </a>
                <a
                    href="https://www.instagram.com/pogoda24_7"
                    target="_blank"
                    className="icon-button instagram">
                    <i className="fa fa-instagram"/>
                    <span />
                </a>
            </div>
        );
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
                        <Route path="/onas" component={ONas} />
                        <Route
                            path="/posts/([a-zA-Z0-9]+)"
                            component={PostView}
                        />
                    </Switch>
                    <div className="is-divider" style={{marginLeft: "4rem", marginRight: "4rem"}}/>
                    <Copyright fontColor={styles.primaryFontColor} additionalRender={this.renderSocialMedia}/>
                </div>
            </Router>
        );
    }
}
