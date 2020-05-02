import React from 'react';
import img from './img/bg.jpg';
const Copyright = require('shared24').Copyright;

export default class Traffic extends React.Component {
    render() {
        return (<div className="main">
            <section className="container fluid">
                <img src={img} className="bgimg" />

            </section>
            <Copyright />
        </div>);
    }
}
