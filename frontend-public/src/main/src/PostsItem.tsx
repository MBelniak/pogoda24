import React from 'react';
import Post from './Post';
import { ForecastMapList } from './ForecastMapList';

interface PostsItemProps {
    post: Post;
    registerView: (id: number) => void;
}

interface PostsItemState {
    isExpanded: boolean;
}

export default class PostsItem extends React.Component<PostsItemProps, PostsItemState> {

    constructor(props) {
        super(props);
        this.expandPost = this.expandPost.bind(this);
        this.state = {
            isExpanded: this.isExpandedByDefault()
        };
        if (this.state.isExpanded) {
            //post is too short to enable its expanding - it will be registered as viewed by default, which a little incorrect :/
            this.props.registerView(this.props.post.id);
        }
    }

    private isExpandedByDefault() {
        return (this.props.post.description.length < 70 &&
            this.props.post.description.split(/[(\r\n)(\n)]/g)
                .length <= 2)
    }

    private processDate() {
        const date = this.props.post.postDate.toLocaleString('pl-PL');
        return date.replace(', ', ' o ');
    }

    private expandPost() {
        this.setState({ isExpanded: true });
    }

    private processDescription() {
        let description = this.props.post.description;
        if (!this.state.isExpanded) {
            if (this.props.post.description.length >= 70) {
                description = description.substr(0, 70);
            }
            if (description.split('/(\r\n)|(\n)/g').length <= 2) {
                description = description
                    .split(/[(\r\n)(\n)]/g)
                    .slice(0, 2)
                    .join('\n');
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
        }

        description = description
            .replace(/\r\n/g, '<br/>')
            .replace(/\n/g, '<br/>');

        return (
            <div className="postDescription">
                <span dangerouslySetInnerHTML={{ __html: description }}/>
                {this.state.isExpanded ? null : (
                    <a
                        className="postLink"
                        onClick={this.expandPost}>
                        więcej
                    </a>
                )}
            </div>
        );
    }

    render() {
        return (
            <div className="post">
                <div className="postdate">
                    {this.processDate()}
                </div>
                <br />
                {this.processDescription()}
                <div
                    className="is-divider"
                    style={{ margin: '15px 0 10px 0' }}
                />
                <div style={{ textAlign: 'center' }}>
                    <ForecastMapList
                        imagesPublicIds={this.props.post.imagesPublicIdsJSON}
                    />
                </div>
            </div>
        );
    }
}
