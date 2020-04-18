import React from 'react';
import { PagingBar } from './PagingBar';
import { Posts } from './Posts';

interface Post {
    id: number;
    postDate: Date;
    postType: string;
    description: string;
    imagesPublicIdsJSON: string[];
    addedToTopBar: boolean;
    dueDate: string;
    shortDescription: string;
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
        fetch('api/posts/count?postType=FORECAST')
            .then(response =>
                response.json().then(data => {
                    this.setState({ forecastsCount: data });
                    if (this.state.forecastsCount !== 0) {
                        fetch(
                            'api/posts?postType=FORECAST&page=0&count=' +
                                this.forecastsPerPage
                        )
                            .then(response =>
                                response.json().then(data => {
                                    this.setState({
                                        posts: data,
                                        loading: false
                                    });
                                })
                            )
                            .catch(error => {
                                console.log(error);
                                this.setState({ loading: false });
                            });
                    }
                })
            )
            .catch(error => {
                console.log(error);
                this.setState({ loading: false });
            });
    }

    private handlePageClick(data) {
        const selected = data.selected;
        fetch(
            'api/posts?postType=FORECASTS&page=' +
                selected +
                '&count=' +
                this.forecastsPerPage
        ).then(response =>
            response.json().then(data => {
                this.setState({ posts: data });
            })
        );
    }

    render() {
        return (
            <section className="mainContent">
                <div className="columns">
                    <div className="column is-1" />
                    {this.state.loading ? (
                        <div className="column is-10" />
                    ) : (
                        <div className="column is-10 posts">
                            {this.state.posts.length !== 0 ? (
                                <>
                                    <Posts posts={this.state.posts} />
                                    <PagingBar
                                        pages={Math.ceil(
                                            this.state.forecastsCount /
                                                this.forecastsPerPage
                                        )}
                                        handlePageClick={this.handlePageClick}
                                    />
                                </>
                            ) : (
                                <div
                                    style={{
                                        textAlign: 'center',
                                        marginTop: '20px'
                                    }}>
                                    <p className="noPosts">Brak postów.</p>
                                </div>
                            )}
                        </div>
                    )}
                    <div className="column is-1" />
                </div>
            </section>
        );
    }
}
