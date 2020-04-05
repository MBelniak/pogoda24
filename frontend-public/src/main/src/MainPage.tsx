import React from 'react';
import { PostsShort } from './PostsShort';
import { ExternalApi } from './ExternalApi';
import { TopBar } from './TopBar';
const Copyright = require('shared24').Copyright;
const BarHolder = require('shared24').BarHolder;
const TopImage = require('shared24').TopImage;


export class MainPage extends React.Component {

    render() {
        return (
            <section>
                <BarHolder/>
                <TopBar />
                <TopImage />
                <div className="container fluid">
                    <div className="columns">
                        <PostsShort forecastCount={5} className='is-three-quarters'/>
                        <ExternalApi/>
                    </div>
                </div>
                <Copyright/>
            </section>
        );
    }
}