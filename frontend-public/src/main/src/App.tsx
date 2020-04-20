import React from 'react';
import { Switch, Route } from 'react-router';
import { BrowserRouter as Router } from 'react-router-dom';
import { MainPage } from './MainPage';
import { Prognozy } from './Prognozy';
import { Ostrzezenia } from './Ostrzezenia';
import { Ciekawostki } from './Ciekawostki';
import { ONas } from './ONas';
import { CloudinaryContext } from 'cloudinary-react';
import './sass/main.scss';
import 'shared24/src/sass/main.scss';
import { TopBar } from './TopBar';

const BarHolder = require('shared24').BarHolder;
const Copyright = require('shared24').Copyright;

interface State {
    warningShort: string | null;
}

export default class App extends React.Component<{}, State> {
    state: State = {
        warningShort: null
    };

    componentDidMount() {
        fetch('api/posts/warnings/topBarWarning')
            .then(response => {
                if (response && response.ok) {
                    response.text().then(text => {
                        if (text !== null && text !== '') {
                            this.setState({ warningShort: text });
                        }
                    });
                } else {
                    console.log(response);
                }
            })
            .catch(error => {
                console.log(error);
            });
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
                            this.state.warningShort
                                ? this.state.warningShort
                                : 'Brak ostrzeżeń'
                        }
                    />
                    <TopBar />
                    <Switch>
                        <Route exact path="/" component={MainPage} />
                        <Route path="/prognozy" component={Prognozy} />
                        <Route path="/ostrzezenia" component={Ostrzezenia} />
                        <Route path="/ciekawostki" component={Ciekawostki} />
                        <Route path="/about" component={ONas} />
                    </Switch>
                    <Copyright />
                </div>
            </Router>
        );
    }
}
