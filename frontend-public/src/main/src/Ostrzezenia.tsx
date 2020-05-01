import React from 'react';
import { Posts } from './Posts';
import { PagingBar } from './PagingBar';
import Post, { postDTOToPost } from './Post';
import { fetchApi } from './helper/fetchHelper';

interface State {
    posts: Post[];
    loading: boolean;
    warningsCount: number;
}

export class Ostrzezenia extends React.Component<{}, State> {
    private readonly warningsPerPage = 4;
    private abortController;

    state: State = {
        posts: [],
        loading: true,
        warningsCount: 0
    };

    constructor(props) {
        super(props);
        this.abortController = new AbortController();
    }

    componentDidMount() {
        fetchApi('api/posts/count?postType=WARNING')
            .then(response =>
                response.json().then(data => {
                    this.setState({ warningsCount: data });

                    fetchApi(
                        'api/posts?postType=WARNING&page=0&count=' +
                            this.warningsPerPage,
                        { signal: this.abortController.signal }
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
            'api/posts?postType=WARNING&page=' +
                selected +
                '&count=' +
                this.warningsPerPage,
            { signal: this.abortController.signal }
        )
            .then(response =>
                response.json().then(data => {
                    this.setState({ posts: data, loading: false });
                }).catch(error => {
                    console.log(error);
                })
            )
            .catch(error => {
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
                        <div className="column is-10">
                            <div />
                        </div>
                    ) : (
                        <div className="column is-10 posts">
                            {this.state.posts.length !== 0 ? (
                                <>
                                    <Posts posts={this.state.posts} />
                                    <PagingBar
                                        pages={Math.ceil(
                                            this.state.warningsCount /
                                                this.warningsPerPage
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
