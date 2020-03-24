import React from 'react';
const Copyright = require('shared24').Copyright;
const TopBar = require('shared24').TopBar;
const BarHolder = require('shared24').BarHolder;
import { Links } from './Links';

export class Ciekawostki extends React.Component{

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="mainFrame">
                <BarHolder/>
                <TopBar render={() => <Links/>}/>
                <div className="mainContent">
                    <img src="img/bg.jpg" className="bgimg"/>
                    <Copyright/>
                </div>
            </div>
        )
    }
}