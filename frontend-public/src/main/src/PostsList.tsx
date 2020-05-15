import React from 'react';
import Post from './Post';
import { fetchApi } from './helper/fetchHelper';
import PostsListItem from './PostsListItem';

interface PostsProps {
    posts: Post[];
}

export class PostsList extends React.Component<PostsProps> {
    private postsViewed: number[] = [];

    constructor(props) {
        super(props);
        this.registerView = this.registerView.bind(this);
    }

    private registerView(id: number) {
        if (this.postsViewed.indexOf(id) < 0) {
            this.postsViewed.push(id);
        }
    }

    //send info about viewed posts to backend
    componentWillUnmount() {
        const body = this.postsViewed.map(postId => {
            return {
                postId: postId,
                views: 1
            };
        });
        fetchApi('api/views/registerViews', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    render() {
        if (!this.props.posts || this.props.posts.length === 0) {
            return (
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <p>Brak postów.</p>
                </div>
            );
        }
        return (
            <div>
                {this.props.posts.map((post, i) => (
                    <PostsListItem
                        post={post}
                        registerView={this.registerView}
                        key={i}
                    />
                ))}
            </div>
        );
    }
}
