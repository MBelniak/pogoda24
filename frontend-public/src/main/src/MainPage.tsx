import React from 'react';
import { Posts } from './Posts';
import { ExternalApi } from './ExternalApi';
import { TopBar } from './TopBar';
const Copyright = require('shared24').Copyright;
const BarHolder = require('shared24').BarHolder;

interface Post {
    id: number;
    postDate: Date;
    description: string;
    imagesPublicIds: string[];
}

interface State {
    posts: Post[],
    loading: boolean;
}

export class MainPage extends React.Component<{}, State> {

    private readonly forecastsPerPage = 4;

    state: State = {
        posts: [],
        loading: true
    };

    componentDidMount() {
        fetch("api/forecasts?page=0&count=" + this.forecastsPerPage)
            .then(response => response.json().then(data => {
                this.setState({ posts: data, loading: false });
            }));
    }

    render() {
        return (
            <div className="main">
                <BarHolder />
                <TopBar />
                <section className="mainContent">
                    <div className="columns">
                        <div className="column is-2" />
                        {this.state.loading
                            ? <div className='column is-8' />
                            : <div className="column is-8 posts">
                                <Posts posts={this.state.posts}/>
                            </div>
                        }
                        <ExternalApi/>
                    </div>
                </section>
                <Copyright/>
            </div>
        );
    }
}