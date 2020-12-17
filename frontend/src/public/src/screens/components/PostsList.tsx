import React from 'react';
import Post from '../../model/Post';
import { fetchApi } from '../../helpers/fetchHelper';
import PostsListItem from './PostsListItem';
import config from '../../config/config';

const { nonExpandedPostLength } = config;

interface PostsProps {
    posts: Post[];
}

export class PostsList extends React.Component<PostsProps> {
    constructor(props) {
        super(props);
        this.registerView = this.registerView.bind(this);
    }

    private registerView(ids: number[]) {
        const body = ids.map(postId => {
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

    private registerPostsExpandedByDefault() {
        const expandedPostsIds = this.props.posts.filter(post => this.isExpandedByDefault(post)).map(post => post.id);
        this.registerView(expandedPostsIds);
    }

    private isExpandedByDefault(post: Post) {
        return post.description.length <= nonExpandedPostLength && post.description.split(/[(\r\n)(\n)]/g).length <= 2;
    }

    componentDidMount() {
        this.registerPostsExpandedByDefault();
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
            <>
                {this.props.posts.map((post, i) => (
                    <PostsListItem post={post} registerView={this.registerView} key={i} />
                ))}
            </>
        );
    }
}
