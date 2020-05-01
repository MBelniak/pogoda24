import React from 'react';
import { PagingBar } from './PagingBar';
import { Posts } from './Posts';
import Post, { postDTOToPost } from './Post';
import { fetchApi } from './helper/fetchHelper';

interface State {
    forecastsCount: number;
    posts: Post[];
    loading: boolean;
}

export class Prognozy extends React.Component<{}, State> {
    private readonly forecastsPerPage = 4;
    private abortController;

    state: State = {
        forecastsCount: 0,
        posts: [],
        loading: true
    };

    constructor(props) {
        super(props);
        this.handlePageClick = this.handlePageClick.bind(this);
        this.abortController = new AbortController();
    }

    componentDidMount() {
        fetchApi('api/posts/count?postType=FORECAST', { signal: this.abortController.signal })
            .then(response =>
                response.json().then(data => {
                    this.setState({ forecastsCount: data });
                    if (this.state.forecastsCount !== 0) {
                        fetchApi(
                            'api/posts?postType=FORECAST&page=0&count=' +
                                this.forecastsPerPage
                        )
                            .then(response =>
                                response.json().then(posts => {
                                    this.setState({
                                        posts: posts.map(post =>
                                            postDTOToPost(post)
                                        ),
                                        loading: false
                                    });
                                }).catch(error => {
                                    console.log(error);
                                })
                            )
                            .catch(error => {
                                console.log(error);
                            });
                    } else {
                        this.setState({ loading: false });
                    }
                }).catch(error => {
                    console.log(error);
                })
            )
            .catch(error => {
                console.log(error);
            });
    }

    private handlePageClick(data) {
        const selected = data.selected;
        fetchApi(
            'api/posts?postType=FORECASTS&page=' +
                selected +
                '&count=' +
                this.forecastsPerPage, { signal: this.abortController.signal }
        ).then(response =>
            response.json().then(data => {
                this.setState({ posts: data });
            }).catch(error => {
                console.log(error);
            })
        ).catch(error => {
              console.log(error);
        });
    }

    componentWillUnmount() {
        this.abortController.abort();
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
