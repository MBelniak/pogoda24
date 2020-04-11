import React from 'react';
import { PostsShort } from './PostsShort';
import { ExternalApi } from './ExternalApi';
import { TopBar } from './TopBar';
const Copyright = require('shared24').Copyright;
const BarHolder = require('shared24').BarHolder;


export class MainPage extends React.Component {

    render() {
        return (
            <div className="main">
                <BarHolder />
                <TopBar />
                <section className="container fluid mainContent">
                    <div className="columns">
                        <PostsShort forecastCount={3} className='is-three-fifths is-offset-one-fifth'/>
                        <ExternalApi/>
                    </div>
                </section>
                <Copyright/>
            </div>
        );
    }
}