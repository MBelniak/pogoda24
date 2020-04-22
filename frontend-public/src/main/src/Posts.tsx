import React from 'react';
import { ForecastMapList } from './ForecastMapList';
import Post from './Post';

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

    constructor(props) {
        super(props);
    }

    private processDate(postDate: Date) {
        const date = postDate.toLocaleString('pl-PL');
        return date.replace(', ', ' o ');
    }

    private expandPost(id: number) {
        const expandedPosts = this.state.expandedPosts;
        this.setState({ expandedPosts: [...expandedPosts, id] });
    }

    private processDescription(post: Post) {
        let description = post.description;
        const expanded =
            this.state.expandedPosts.indexOf(post.id) > -1 ||
            post.description.length < 150;
        if (!expanded) {
            description = description.substr(0, 150);
            const regex = /^.*\s/g;
            const match = description.match(regex);
            if (match) {
                if (typeof match === 'string') {
                    description = match + '...';
                } else {
                    description = match[0] + '...';
                }
            }
        }

        description = description
            .replace('\r\n', '<br/><br/>')
            .replace('\n', '<br/><br/>');
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
