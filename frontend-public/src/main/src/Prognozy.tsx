import React from 'react';
import { PagingBar } from './PagingBar';
import { PostsShort } from './PostsShort';
import { Links } from './Links';
const TopBar = require('shared24').TopBar;
const BarHolder = require('shared24').BarHolder;
const Copyright = require('shared24').Copyright;

export class Prognozy extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            page: 0
        }
    }

    render() {
        return (
            <div className="mainFrame">
                <BarHolder />
                <TopBar render={() => <Links />}/>
                <div className="mainContent">
                    <img src="img/bg.jpg" className="bgimg"/>
                    <PostsShort forecastCount={1} />
                    <Copyright />
                    <PagingBar />
                </div>
            </div>
        )
    }

}