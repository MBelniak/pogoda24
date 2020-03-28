import React from 'react';
import { PagingBar } from './PagingBar';
import { PostsShort } from './PostsShort';
import { TopBar } from './TopBar';
const BarHolder = require('shared24').BarHolder;
const Copyright = require('shared24').Copyright;
const TopImage = require('shared24').TopImage;

export class Prognozy extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            page: 0
        }
    }

    render() {
        return (
            <section className="mainFrame">
                <BarHolder />
                <TopBar />
                <TopImage />
                <div className="container fluid mainContent">
                    <PostsShort forecastCount={1} className='is-full'/>
                </div>
                <Copyright />
                <PagingBar />
            </section>
        )
    }

}