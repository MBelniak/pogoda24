import React from 'react';
import { PagingBar } from './PagingBar';
import { PostsList } from './PostsList';
import Post, { postDTOToPost, PostType } from './Post';
import { fetchApi } from './helper/fetchHelper';
const LoadingIndicator = require('shared24').LoadingIndicator;
const showModal = require('shared24').showModal;
const closeModal = require('shared24').closeModal;

interface State {
    posts: Post[] | undefined;
}

export class Posts extends React.Component<{ postType: PostType }, State> {
    private readonly postsPerPage = 5;
    private postsCount;
    private abortController;

    state: State = {
        posts: undefined
    };

    constructor(props) {
        super(props);
        this.handlePageClick = this.handlePageClick.bind(this);
        this.postsCount = 0;
        this.abortController = new AbortController();
    }

    private fetchPosts() {
        this.setState({ posts: undefined });
        showModal(<LoadingIndicator />);
        fetchApi('api/posts/count?postType=' + this.props.postType.toString(), {
            signal: this.abortController.signal
        })
            .then(response => {
                if (response && response.ok) {
                    response
                        .json()
                        .then(data => {
                            this.postsCount = data;
                            if (this.postsCount !== 0) {
                                fetchApi(
                                    'api/posts?postType=' +
                                        this.props.postType.toString() +
                                        '&page=0&count=' +
                                        this.postsPerPage
                                )
                                    .then(response =>
                                        response
                                            .json()
                                            .then(posts => {
                                                this.setState({
                                                    posts: posts.map(post =>
                                                        postDTOToPost(post)
                                                    )
                                                });
                                                closeModal();
                                            })
                                            .catch(error => {
                                                closeModal();
                                                console.log(error);
                                            })
                                    )
                                    .catch(error => {
                                        closeModal();
                                        console.log(error);
                                    });
                            } else {
                                closeModal();
                                this.setState({posts: []})
                            }
                        })
                        .catch(error => {
                            closeModal();
                            console.log(error);
                        });
                } else {
                    closeModal();
                }
            })
            .catch(error => {
                closeModal();
                console.log(error);
            });
    }

    private handlePageClick(data) {
        const selected = data.selected;
        this.setState({ posts: [] });
        showModal(<LoadingIndicator />);
        fetchApi(
            'api/posts?postType=FORECASTS&page=' +
                selected +
                '&count=' +
                this.postsPerPage,
            { signal: this.abortController.signal }
        )
            .then(response => {
                if (response && response.ok) {
                    response
                        .json()
                        .then(data => {
                            this.setState({ posts: data });
                            closeModal();
                        })
                        .catch(error => {
                            closeModal();
                            console.log(error);
                        });
                } else {
                    closeModal();
                }
            })
            .catch(error => {
                console.log(error);
                closeModal();
            });
    }

    private postTypeToText(): string {
        return this.props.postType == PostType.FACT
            ? 'ciekawostek'
            : this.props.postType == PostType.WARNING
            ? 'ostrzeżeń'
            : 'prognoz';
    }

    componentDidUpdate(prevProps) {
        if (this.props.postType !== prevProps.postType) {
            this.fetchPosts();
        }
    }

    componentDidMount() {
        this.fetchPosts();
    }

    componentWillUnmount() {
        this.abortController.abort();
    }

    render() {
        return (
            <section className="mainContent">
                <div className="columns">
                    <div className="column is-1" />
                    <div className="column is-10 posts">
                        {this.state.posts ? this.state.posts.length !== 0 ? (
                            <>
                                <PostsList posts={this.state.posts} />
                                <PagingBar
                                    pages={Math.ceil(
                                        this.postsCount / this.postsPerPage
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
                                <p className="noPosts">
                                    Brak {this.postTypeToText()}.
                                </p>
                            </div>
                        ) : null}
                    </div>
                    <div className="column is-1" />
                </div>
            </section>
        );
    }
}
