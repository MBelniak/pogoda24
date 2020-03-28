import React from 'react';
import { TopBar } from './TopBar';
const Copyright = require('shared24').Copyright;
const BarHolder = require('shared24').BarHolder;
const TopImage = require('shared24').TopImage;

export class Ciekawostki extends React.Component{

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="mainFrame">
                <BarHolder />
                <TopBar />
                <div className="mainContent">
                    <TopImage />
                    <Copyright />
                </div>
            </div>
        )
    }
}