import React from 'react';
import { PagingBar } from './PagingBar';
import { Posts } from './Posts';
import { TopBar } from './TopBar';
import {LoadingIndicator} from "../../../../shared/src/main/shared24/src/LoadingIndicator";
const BarHolder = require('shared24').BarHolder;
const Copyright = require('shared24').Copyright;

interface Post {
    id: number;
    postDate: Date;
    description: string;
    imagesPublicIds: string[];
}

interface State {
    forecastsCount: number;
    posts: Post[];
    loading: boolean;
}

export class Prognozy extends React.Component<{}, State> {

    private readonly forecastsPerPage = 4;

    state: State = {
        forecastsCount: 0,
        posts: [],
        loading: true
    };

    constructor(props) {
        super(props);
        this.handlePageClick = this.handlePageClick.bind(this);
    }

    componentDidMount() {
        fetch("api/forecasts/count").then(response => response.json().then(data => {
            this.setState({ forecastsCount: data });
            fetch("api/forecasts?page=0&count=" + this.forecastsPerPage)
                .then(response => response.json().then(data => {
                    console.log(data);
                    this.setState({ posts: data, loading: false });
                }));
        }));
    }

    private handlePageClick(data) {
        const selected = data.selected;
        fetch("api/forecasts?page=" + selected +  "&count=" + this.forecastsPerPage)
            .then(response => response.json().then(data => {
                this.setState({ posts: data });
            }));
    }

    render() {
        return (
            <div className="main">
                <BarHolder />
                <TopBar />
                <section className="mainContent">
                    <div className="columns">
                        <div className="column is-1"/>
                        {this.state.loading
                            ? <div className='column is-10'/>
                            : <div className="column is-10 posts">
                                <Posts posts={this.state.posts}/>
                                <PagingBar pages={Math.ceil(this.state.forecastsCount / this.forecastsPerPage)}
                                            handlePageClick={this.handlePageClick}/>
                            </div>
                        }
                        <div className="column is-1"/>
                    </div>
                </section>
                <Copyright />
            </div>
        )
    }

}