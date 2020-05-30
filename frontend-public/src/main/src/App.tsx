import React from 'react';
import { Switch, Route } from 'react-router';
import { BrowserRouter as Router } from 'react-router-dom';
import { MainPage } from './MainPage';
import { ONas } from './ONas';
import { CloudinaryContext } from 'cloudinary-react';
import './sass/main.scss';
import 'shared24/src/sass/main.scss';
import * as fnstz from 'date-fns-tz';
import { TopBar } from './TopBar';
import PostView from './PostView';
import ErrorPage from './ErrorPage';
import { fetchApi } from './helper/fetchHelper';
import { Posts } from './Posts';
import { PostType } from './Post';
const BarHolder = require('shared24').BarHolder;
const Copyright = require('shared24').Copyright;

interface WarningInfo {
    postId: string;
    dueDate: Date;
    shortDescription?: string;
}

interface State {
    warningInfo: WarningInfo | null;
}

export default class App extends React.Component<{}, State> {
    private abortController;

    state: State = {
        warningInfo: null
    };

    constructor(props) {
        super(props);
        this.abortController = new AbortController();
    }

    componentDidMount() {
        fetchApi('api/posts/topBarWarning', {
            signal: this.abortController.signal
        })
            .then(response => {
                if (response && response.ok) {
                    response
                        .json()
                        .then(warningInfo => {
                            this.setState({
                                warningInfo: {
                                    ...warningInfo,
                                    dueDate: warningInfo.dueDate
                                        ? fnstz.zonedTimeToUtc(
                                              warningInfo.dueDate,
                                              'Europe/Warsaw'
                                          )
                                        : undefined
                                }
                            });
                        })
                        .catch(error => {
                            console.log(error);
                            this.setState({ warningInfo: null });
                        });
                } else {
                    console.log(response);
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    componentWillUnmount() {
        this.abortController.abort();
    }

    render() {
        return (
            <Router>
                <div className="main">
                    <BarHolder
                        handleClick={() => {
                            return;
                        }}
                        warningShort={
                            this.state.warningInfo
                                ? this.state.warningInfo.shortDescription
                                : 'Brak ostrzeżeń'
                        }
                    />
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
                        <Route path="/posts/([a-zA-Z0-9]+)" component={PostView} />
                        <Route component={ErrorPage} />
                    </Switch>
                    <Copyright />
                </div>
            </Router>
        );
    }
}
