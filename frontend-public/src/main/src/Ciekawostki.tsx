import React from 'react';
import { TopBar } from './TopBar';
const Copyright = require('shared24').Copyright;
const BarHolder = require('shared24').BarHolder;

export class Ciekawostki extends React.Component{

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="main">
                <BarHolder />
                <TopBar />
                <Copyright />
            </div>
        )
    }
}