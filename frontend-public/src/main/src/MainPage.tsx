import React from 'react';
import { PostsShort } from './PostsShort';
import { ExternalApi } from './ExternalApi';
import { Links } from './Links';
import img from './img/bg.jpg';
const Copyright = require('shared24').Copyright;
const TopBar = require('shared24').TopBar;
const BarHolder = require('shared24').BarHolder;


export class MainPage extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="mainFrame">
                <BarHolder/>
                <TopBar render={() => <Links/>}/>
                <div className="mainContent">
                    <img src={img} className="bgimg"/>
                    <ExternalApi/>
                    <PostsShort forecastCount={5}/>
                    <Copyright/>
                </div>
            </div>
        )
    }

}