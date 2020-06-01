import React from 'react';
import PostsListItem from './PostsListItem';
import Post, { PostDTO, postDTOToPost } from './Post';
import PostEdition from './PostEdition';
import { fetchApi } from './helpers/fetchHelper';
const Copyright = require('shared24').Copyright;
const TopImage = require('shared24').TopImage;
const showModal = require('shared24').showModal;
const closeModal = require('shared24').closeModal;
const PagingBar = require('shared24').PagingBar;
const LoadingIndicator = require('shared24').LoadingIndicator;

interface State {
    posts: Post[] | undefined;
    totalPostsCount: number;
    currentPage: number;
    postEdition: boolean;
    postToEdit?: Post;
}

export default class PostsList extends React.Component<{}, State> {
    private postsPerPage = 10;
    private abortController;

    state: State = {
        posts: [],
        totalPostsCount: 0,
        currentPage: 0,
        postEdition: false,
        postToEdit: undefined
    };

    constructor(props) {
        super(props);
        this.initiatePostEdit = this.initiatePostEdit.bind(this);
        this.onFinishEditing = this.onFinishEditing.bind(this);
        this.handlePageClick = this.handlePageClick.bind(this);
        this.abortController = new AbortController();
    }

    private initiatePostEdit(post: Post) {
        this.setState({ postEdition: true, postToEdit: post });
    }

    private onFinishEditing() {
        showModal(<LoadingIndicator />);
        this.setState({ postEdition: false, postToEdit: undefined });
        this.fetchPostsFromApi(0);
        closeModal();
    }

    private fetchPostsFromApi(page: number): Promise<void> {
        return fetchApi('api/posts?page=' + page + '&count=' + this.postsPerPage, {
            signal: this.abortController.signal
        })
            .then(response => {
                if (response && response.ok) {
                    response
                        .json()
                        .then((posts: PostDTO[]) => {
                            this.setState({
                                posts: posts.map(post => postDTOToPost(post))
                            });
                            closeModal();
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

    private handlePageClick(data) {
        const selected = data.selected;
        this.setState({ posts: undefined, currentPage: selected });
        showModal(<LoadingIndicator />);
        this.fetchPostsFromApi(selected).finally(closeModal);
    }

    componentDidMount() {
        showModal(<LoadingIndicator />);
        fetchApi('api/posts/count', { signal: this.abortController.signal })
            .then(response =>
                response
                    .json()
                    .then(data => {
                        this.setState({ totalPostsCount: data });
                        this.fetchPostsFromApi(0).finally(closeModal);
                    })
                    .catch(error => {
                        console.log(error);
                        closeModal();
                    })
            )
            .catch(error => {
                console.log(error);
                closeModal();
            });
    }

    componentWillUnmount() {
        this.abortController.abort();
    }

    render() {
        return (
            <div className="main">
                <section className="container is-fluid">
                    <TopImage />
                    {this.state.postEdition ? (
                        <PostEdition
                            post={this.state.postToEdit!!}
                            onFinishEditing={this.onFinishEditing}
                        />
                    ) : (
                        <>
                            <h2 className="title">Lista postów: </h2>
                            <div className="container">
                                {!this.state.posts ? null : this.state.posts
                                      .length === 0 ? (
                                    <div
                                        style={{
                                            textAlign: 'center',
                                            marginTop: '20px'
                                        }}>
                                        <p>Brak postów.</p>
                                    </div>
                                ) : (
                                    <div>
                                        {this.state.posts.map((post, i) => (
                                            <PostsListItem
                                                key={i}
                                                post={post}
                                                initiatePostEdit={
                                                    this.initiatePostEdit
                                                }
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                            {this.state.totalPostsCount <=
                            this.postsPerPage ? null : (
                                <PagingBar
                                    pages={Math.ceil(
                                        this.state.totalPostsCount /
                                            this.postsPerPage
                                    )}
                                    handlePageClick={this.handlePageClick}
                                    currentPage={this.state.currentPage}
                                />
                            )}
                        </>
                    )}
                </section>
                <Copyright />
            </div>
        );
    }
}
