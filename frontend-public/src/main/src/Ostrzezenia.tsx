import React from 'react';
import {TopBar} from './TopBar';
import {Posts} from "./Posts";
import {PagingBar} from "./PagingBar";

const BarHolder = require('shared24').BarHolder;
const Copyright = require('shared24').Copyright;

interface Post {
    id: number;
    postDate: Date;
    description: string;
    imagesPublicIds: string[];
}

interface State {
    posts: Post[];
    loading: boolean;
    warningsCount: number;
}

export class Ostrzezenia extends React.Component<{}, State> {

    private readonly warningsPerPage = 4;

    state: State = {
        posts: [],
        loading: true,
        warningsCount: 0
    };

    componentDidMount() {
        fetch("api/warnings/count").then(response => response.json().then(data => {
            this.setState({ warningsCount: data });
            fetch("api/warnings?page=0&count=" + this.warningsPerPage)
                .then(response => response.json().then(data => {
                    this.setState({ posts: data, loading: false });
                }));
        }));
    }

    private handlePageClick(data) {
        const selected = data.selected;
        fetch("api/warnings?page=" + selected +  "&count=" + this.warningsPerPage)
            .then(response => response.json().then(data => {
                this.setState({ posts: data });
            }));
    }

    render() {
        return (
            <section className="mainContent">
                <div className="columns">
                    <div className="column is-1"/>
                    {this.state.loading
                        ? <div className='column is-10'>
                            <div/>
                        </div>
                        : <div className="column is-10 posts">
                            <Posts posts={this.state.posts}/>
                            <PagingBar pages={Math.ceil(this.state.warningsCount / this.warningsPerPage)}
                                       handlePageClick={this.handlePageClick}/>
                        </div>
                    }
                    <div className="column is-1"/>
                </div>
            </section>
        );
    }
}