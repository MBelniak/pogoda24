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
            <div className="main">
                <BarHolder />
                <TopBar />
                <TopImage />
                <section className="container fluid">
                    <div className="columns">
                        <PostsShort forecastCount={1} className='is-full'/>
                    </div>
                    <PagingBar />
                </section>
                <Copyright />
            </div>
        )
    }

}