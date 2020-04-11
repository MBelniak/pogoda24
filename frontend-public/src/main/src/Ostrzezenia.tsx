import React from 'react';
import {TopBar} from './TopBar';

const BarHolder = require('shared24').BarHolder;
const Copyright = require('shared24').Copyright;

export class Ostrzezenia extends React.Component {

    render() {
        return (
            <div className="main">
                <BarHolder />
                <TopBar />
                <div className="mainContent">
                </div>
                <Copyright />
            </div>
        )
    }
}