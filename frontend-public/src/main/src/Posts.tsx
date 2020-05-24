import React from 'react';
import { PostsList } from './PostsList';
import Post, { postDTOToPost, PostType } from './Post';
import { fetchApi } from './helper/fetchHelper';
import CustomLinearProgress from './LinearProgress';
const PagingBar = require('shared24').PagingBar;

interface State {
    posts: Post[] | undefined;
    totalPostsCount: number;
    currentPage: number;
}

export class Posts extends React.Component<{ postType: PostType }, State> {
    private readonly postsPerPage = 5;
    private abortController;

    state: State = {
        posts: undefined,
        totalPostsCount: 0,
        currentPage: 0
    };

    constructor(props) {
        super(props);
        this.handlePageClick = this.handlePageClick.bind(this);
        this.abortController = new AbortController();
    }

    private fetchPosts() {
        this.setState({ posts: undefined });
        fetchApi('api/posts/count?postType=' + this.props.postType.toString(), {
            signal: this.abortController.signal
        })
            .then(response => {
                if (response && response.ok) {
                    response
                        .json()
                        .then(data => {
                            this.setState({ totalPostsCount: data });
                            if (this.state.totalPostsCount !== 0) {
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
                                            })
                                            .catch(error => {
                                                console.log(error);
                                            })
                                    )
                                    .catch(error => {
                                        console.log(error);
                                    });
                            } else {
                                this.setState({ posts: [] });
                            }
                        })
                        .catch(error => {
                            console.log(error);
                        });
                } else {
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    private handlePageClick(data) {
        const selected = data.selected;
        this.setState({ posts: undefined, currentPage: selected });
        fetchApi(
            'api/posts?postType=FORECAST&page=' +
                selected +
                '&count=' +
                this.postsPerPage,
            { signal: this.abortController.signal }
        )
            .then(response => {
                if (response && response.ok) {
                    response
                        .json()
                        .then(posts => {
                            this.setState({ posts: posts });
                        })
                        .catch(error => {
                            console.log(error);
                        });
                } else {
                    this.setState({ posts: [] });
                }
            })
            .catch(error => {
                console.log(error);
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
                        {this.state.posts ? (
                            this.state.posts.length !== 0 ? (
                                <>
                                    <PostsList posts={this.state.posts} />
                                    {this.state.totalPostsCount <=
                                    this.postsPerPage ? null : (
                                        <PagingBar
                                            pages={Math.ceil(
                                                this.state.totalPostsCount /
                                                    this.postsPerPage
                                            )}
                                            handlePageClick={
                                                this.handlePageClick
                                            }
                                            currentPage={this.state.currentPage}
                                        />
                                    )}
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
                            )
                        ) : (
                            <CustomLinearProgress />
                        )}
                    </div>
                    <div className="column is-1" />
                </div>
            </section>
        );
    }
}
