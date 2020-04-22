import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import img from './img/bg.jpg';
import PostsListItem from './PostsListItem';
const Copyright = require('shared24').Copyright;
import Post, { PostDTO, postDTOsToPostsList } from './Post';
import PostEdition from './PostEdition';
import { closeModal, showModal } from './redux/actions';
const LoadingIndicator = require('shared24').LoadingIndicator;

interface State {
    loading: boolean;
    postsCount: number;
    posts: Post[];
    postEdition: boolean;
    postToEdit?: Post;
}

const connector = connect(null, {
    showModal: showModal,
    closeModal: closeModal
});

type PostsListProps = ConnectedProps<typeof connector>;

class PostsList extends React.Component<PostsListProps, State> {
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
        this.props.closeModal();
        this.setState({ postEdition: false, postToEdit: undefined });
        this.fetchPostsFromApi();
    }

    private fetchPostsFromApi() {
        this.props.showModal(<LoadingIndicator />);
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
                                    this.props.closeModal();
                                })
                            )
                            .catch(error => {
                                console.log(error);
                                this.setState({ loading: false });
                                this.props.closeModal();
                            });
                    })
                    .catch(error => {
                        console.log(error);
                        this.setState({ loading: false });
                        this.props.closeModal();
                    })
            )
            .catch(error => {
                console.log(error);
                this.setState({ loading: false });
                this.props.closeModal();
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

export default connector(PostsList);
