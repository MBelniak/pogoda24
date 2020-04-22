import React from 'react';
import img from './img/bg.jpg';
import { Links } from './Links';
const Copyright = require('shared24').Copyright;

export default class MainPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="main">
                <section className="container fluid">
                    <img src={img} className="bgimg" />
                    <Links />
                </section>
                <Copyright />
            </div>
        );
    }
}
