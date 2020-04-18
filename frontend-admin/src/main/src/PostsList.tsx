import React from 'react';
import img from './img/bg.jpg';
import PostsListItem from './PostsListItem';
const ModalWindow = require('shared24').ModalWindow;
const Copyright = require('shared24').Copyright;

interface Post {
    id: number;
    postDate: Date;
    description: string;
    imagesPublicIds: string[];
}

interface State {
    showModal: boolean;
    loading: boolean;
    renderModal: JSX.Element | undefined;
    postsCount: number;
    posts: Post[];
}
export default class PostsList extends React.Component<{}, State> {
    private postsPerPage = 10;

    state: State = {
        showModal: false,
        loading: true,
        renderModal: undefined,
        postsCount: 0,
        posts: []
    };

    componentDidMount() {
        fetch('api/posts/count')
            .then(response =>
                response.json().then(data => {
                    this.setState({ postsCount: data });
                    fetch('api/posts?&page=0&count=' + this.postsPerPage)
                        .then(response =>
                            response.json().then(data => {
                                this.setState({ posts: data, loading: false });
                            })
                        )
                        .catch(error => {
                            console.log(error);
                            this.setState({ loading: false });
                        });
                })
            )
            .catch(error => {
                console.log(error);
                this.setState({ loading: false });
            });
    }

    render() {
        return (
            <div className="main">
                <ModalWindow
                    isShown={this.state.showModal}
                    render={this.state.renderModal}
                />
                <section className="container fluid">
                    <img src={img} className="bgimg" />
                    <h2 className="title">Lista postów: </h2>
                    <div className="container fluid">
                        {!this.state.posts || this.state.posts.length === 0 ? (
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
                                    <PostsListItem key={i} post={post} />
                                ))}
                            </div>
                        )}
                    </div>
                </section>
                <Copyright />
            </div>
        );
    }
}
