import React from 'react';
import { ForecastMapList } from './ForecastMapList';
import Post from './Post';
import { fetchApi } from './helper/fetchHelper';

interface State {
    expandedPosts: number[];
}

interface PostsProps {
    posts: Post[];
}

export class Posts extends React.Component<PostsProps, State> {
    state: State = {
        expandedPosts: []
    };

    private postsViewed: number[] = [];

    constructor(props) {
        super(props);
    }

    private processDate(postDate: Date) {
        const date = postDate.toLocaleString('pl-PL');
        return date.replace(', ', ' o ');
    }

    private expandPost(id: number) {
        const expandedPosts = this.state.expandedPosts;
        this.postsViewed.push(id);
        this.setState({ expandedPosts: [...expandedPosts, id] });
    }

    private processDescription(post: Post) {
        let description = post.description;
        const expanded =
            this.state.expandedPosts.indexOf(post.id) > -1 ||
            post.description.length < 70 && description.split(/[(\r\n)(\n)]/g).length <= 2;
        if (!expanded) {
            if (post.description.length >= 70) {
                description = description.substr(0, 70);
            }
            if (description.split('/(\r\n)|(\n)/g').length <= 2) {
                description = description.split(/[(\r\n)(\n)]/g).slice(0, 2).join('\n');
            }
            const regex = /^.*\s/g;
            const match = description.match(regex);
            if (match) {
                if (typeof match === 'string') {
                    description = match + '...';
                } else {
                    description = match[0] + '...';
                }
            }
        } else {
            //post is too short to enable its expanding - it will be registered as viewed by default, which a little incorrect :/
            if (this.postsViewed.indexOf(post.id) < 0) {
                this.postsViewed.push(post.id);
            }
        }
        description = description
            .replace(/\r\n/g, '<br/>')
            .replace(/\n/g, '<br/>');
        return (
            <div className="postDescription">
                <span dangerouslySetInnerHTML={{ __html: description }}></span>
                {expanded ? null : (
                    <a
                        className="postLink"
                        onClick={() => this.expandPost(post.id)}>
                        więcej
                    </a>
                )}
            </div>
        );
    }

    private renderPost(post: Post, i: number) {
        return (
            <div key={i} className="post">
                <div className="postdate">
                    {this.processDate(post.postDate)}
                </div>
                <br />
                {this.processDescription(post)}
                <div
                    className="is-divider"
                    style={{ margin: '15px 0 10px 0' }}
                />
                <div style={{ textAlign: 'center' }}>
                    <ForecastMapList
                        imagesPublicIds={post.imagesPublicIdsJSON}
                    />
                </div>
            </div>
        );
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
            },
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
                {this.props.posts.map((post, i) => this.renderPost(post, i))}
            </div>
        );
    }
}
