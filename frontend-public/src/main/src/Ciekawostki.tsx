import React from 'react';
import { Links } from './Links';
const Copyright = require('shared24').Copyright;
const TopBar = require('shared24').TopBar;
const BarHolder = require('shared24').BarHolder;

export class Ciekawostki extends React.Component{

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="mainFrame">
                <BarHolder />
                <TopBar render={() => <Links />} />
                <div className="mainContent">
                    <img src="img/bg.jpg" className="bgimg"/>
                    <Copyright />
                </div>
            </div>
        )
    }
}