import React from 'react';
import img from './img/bg.jpg';
import PostsListItem from './PostsListItem';
import Post, { PostDTO, postDTOToPost } from './Post';
import PostEdition from './PostEdition';
import { fetchApi } from './helpers/fetchHelper';
const Copyright = require('shared24').Copyright;
const showModal = require('shared24').showModal;
const closeModal = require('shared24').closeModal;
const LoadingIndicator = require('shared24').LoadingIndicator;

interface State {
    loading: boolean;
    postsCount: number;
    posts: Post[];
    postEdition: boolean;
    postToEdit?: Post;
}

export default class PostsList extends React.Component<{}, State> {
    private postsPerPage = 10;
    private abortController;

    state: State = {
        loading: true,
        postsCount: 0,
        posts: [],
        postEdition: false,
        postToEdit: undefined
    };

    constructor(props) {
        super(props);
        this.initiatePostEdit = this.initiatePostEdit.bind(this);
        this.onFinishEditing = this.onFinishEditing.bind(this);
        this.abortController = new AbortController();
    }

    private initiatePostEdit(post: Post) {
        this.setState({ postEdition: true, postToEdit: post });
    }

    private onFinishEditing() {
        closeModal();
        this.setState({ postEdition: false, postToEdit: undefined });
        this.fetchPostsFromApi();
    }

    private fetchPostsFromApi() {
        showModal(<LoadingIndicator />);
        fetchApi('api/posts/count', { signal: this.abortController.signal })
            .then(response =>
                response
                    .json()
                    .then(data => {
                        this.setState({ postsCount: data });
                        fetchApi('api/posts?&page=0&count=' + this.postsPerPage, { signal: this.abortController.signal })
                            .then(response =>
                                response.json().then((posts: PostDTO[]) => {
                                    this.setState({
                                        posts: posts.map(post => postDTOToPost(post)),
                                        loading: false
                                    });
                                    closeModal();
                                }).catch(error => {
                                    console.log(error);
                                })
                            )
                            .catch(error => {
                                console.log(error);
                            });
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

    componentDidMount() {
        this.fetchPostsFromApi();
    }

    componentWillUnmount() {
        this.abortController.abort();
    }

    render() {
        return (
            <div className="main">
                <section className="container fluid">
                    <img src={img} className="bgimg" />
                    {this.state.postEdition ? (
                        <PostEdition
                            post={this.state.postToEdit!!}
                            onFinishEditing={this.onFinishEditing}
                        />
                    ) : this.state.loading ? (
                        <div />
                    ) : (
                        <>
                            <h2 className="title">Lista postów: </h2>
                            <div className="container fluid">
                                {!this.state.posts ||
                                this.state.posts.length === 0 ? (
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
                        </>
                    )}
                </section>
                )}
                <Copyright />
            </div>
        );
    }
}
