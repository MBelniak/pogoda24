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
import {TopBar} from "./TopBar";
import {BarHolder} from "../../../../shared/src/main/shared24/src/BarHolder";
import {Copyright} from "../../../../shared/src/main/shared24/src/Copyright";

interface State {
    warningShort: string;
}

export default class App extends React.Component<{}, State> {

    state: State = {
        warningShort: ""
    };

    componentDidMount() {
        fetch("api/warnings/latestShort")
            .then(response => {
                if (response && response.ok) {
                    response.text().then(text => {
                        if (text !== null && text !== "") {
                            this.setState({warningShort: text});
                        } else {
                            this.setState({warningShort: "Brak ostrzeżeń."});
                        }
                    });
                } else {
                    console.log(response);
                    this.setState({warningShort: "Brak ostrzeżeń."});
                }
            }).catch(error => {
                console.log(error);
                this.setState({warningShort: "Brak ostrzeżeń."});
        });
    }

    render() {
        return (
            <Router>
             <div className="main">
                <BarHolder handleClick={() => {return;}} warningShort={this.state.warningShort}/>
                <TopBar />
                 <Switch>
                     <Route exact path="/" component={MainPage}/>
                     <Route path="/prognozy" component={Prognozy}/>
                     <Route path="/ostrzezenia" component={Ostrzezenia}/>
                     <Route path="/ciekawostki" component={Ciekawostki}/>
                     <Route path="/about" component={ONas}/>
                 </Switch>
                 <Copyright/>
             </div>
            </Router>
        );
    }

}