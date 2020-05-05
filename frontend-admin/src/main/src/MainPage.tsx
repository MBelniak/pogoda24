import React from 'react';
import { Links } from './Links';
const Copyright = require('shared24').Copyright;
const TopImage = require('shared24').TopImage;

export default class MainPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="main">
                <section className="container fluid">
                    <TopImage/>
                    <Links />
                </section>
                <Copyright />
            </div>
        );
    }
}
