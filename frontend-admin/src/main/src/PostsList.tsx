import React from 'react';
import img from './img/bg.jpg';
import PostsListItem from "./PostsListItem";
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
    renderModal: JSX.Element | undefined;
    posts: Post[];
}
export default class PostsList extends React.Component<{}, State> {

    state: State = {
        showModal: false,
        renderModal: undefined,
        posts: []
    };

    componentDidMount() {
        fetch('api/')
    }

    render() {
        return (
            <div className="main">
                <ModalWindow isShown={this.state.showModal} render={this.state.renderModal}/>
                <section className="container fluid">
                    <img src={img} className="bgimg"/>
                    <h2 className="title">Lista postów: </h2>
                    <div className="container fluid">
                        {!this.state.posts || this.state.posts.length === 0
                            ? (<div style={{textAlign: "center", marginTop: "20px"}}>
                                <p>Brak postów.</p>
                            </div>)
                            : (<div>
                                {this.state.posts.map((post, i) => <PostsListItem key={i} post={post}/>)}
                            </div>)
                        }
                    </div>
                </section>
                <Copyright/>
            </div>
        )
    }
}