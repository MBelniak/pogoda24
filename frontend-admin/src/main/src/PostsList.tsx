import React from 'react';
import img from './img/bg.jpg';
import PostsListItem from './PostsListItem';
import Post, { PostDTO, postDTOsToPostsList } from './Post';
import PostEdition from './PostEdition';
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
        fetch('api/posts/count')
            .then(response =>
                response
                    .json()
                    .then(data => {
                        this.setState({ postsCount: data });
                        fetch('api/posts?&page=0&count=' + this.postsPerPage)
                            .then(response =>
                                response.json().then((data: PostDTO[]) => {
                                    this.setState({
                                        posts: postDTOsToPostsList(data),
                                        loading: false
                                    });
                                    closeModal();
                                })
                            )
                            .catch(error => {
                                console.log(error);
                                this.setState({ loading: false });
                                closeModal();
                            });
                    })
                    .catch(error => {
                        console.log(error);
                        this.setState({ loading: false });
                        closeModal();
                    })
            )
            .catch(error => {
                console.log(error);
                this.setState({ loading: false });
                closeModal();
            });
    }

    componentDidMount() {
        this.fetchPostsFromApi();
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
