import React from 'react';
import Post, { PostType } from './Post';
import { Link } from 'react-router-dom';
import { ForecastMapList } from './ForecastMapList';
import config from './config/config';

const { nonExpandedPostLength } = config;

interface PostsItemProps {
    post: Post;
    registerView: (id: number) => void;
}

interface PostsItemState {
    isExpanded: boolean;
}

export default class PostsListItem extends React.Component<
    PostsItemProps,
    PostsItemState
> {
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
        return (
            this.props.post.description.length <= nonExpandedPostLength &&
            this.props.post.description.split(/[(\r\n)(\n)]/g).length <= 2
        );
    }

    private processDate() {
        const date = this.props.post.postDate.toLocaleString('pl-PL');
        return date.replace(', ', ' o ');
    }

    private expandPost() {
        this.setState({ isExpanded: true });
        this.props.registerView(this.props.post.id);
    }

    private createDescription() {
        const description =
            this.props.post.postType === PostType.FACT
                ? this.processDescriptionForFact()
                : this.processDescription(this.props.post.description);
        return (
            <>
                <span
                    dangerouslySetInnerHTML={{
                        __html: description
                    }}
                    style={{ wordWrap: 'break-word' }}
                />
                {this.state.isExpanded ? null :
                    this.props.post.postType === PostType.FACT ? <Link to={"/posts/" + this.props.post.id} className="postLink">
                        {' '} więcej
                    </Link>: (
                    <a className="postLink" onClick={this.expandPost}>
                        {' '}
                        więcej
                    </a>
                )}
            </>
        );
    }

    private processDescription(description: string): string {
        if (!this.state.isExpanded) {
            if (this.props.post.description.length > nonExpandedPostLength) {
                description = description.substr(0, nonExpandedPostLength);
            }
            if (description.split(/[(\r\n)(\n)]/g).length <= 2) {
                description = description
                    .split(/[(\r\n)(\n)]/g)
                    .slice(0, 2)
                    .join('\n');
            }
            const regex = /^.*\s/g;
            const match = description.match(regex);
            if (match && match.length > 70) {
                if (typeof match === 'string') {
                    description = match + '...';
                } else {
                    description = match[0] + '...';
                }
            } else {
                //let's not clip very long words (does a word over 50 characters long even exist? Probably.)
                description = description + '...';
            }
        }

        description = description
            .replace(/\r\n/g, '<br/>')
            .replace(/\n/g, '<br/>');

        return description;
    }

    private processDescriptionForFact(): string {
        const dummyDomEl = document.createElement('html');
        dummyDomEl.innerHTML = this.props.post.description.replace(/\\"/g, '"');
        const description: string = dummyDomEl.textContent ? dummyDomEl.textContent : '';
        return this.processDescription(description);
    }

    render() {
        return (
            <div className="post">
                <div className="postdate">{this.processDate()}</div>
                <br />
                <div className="postTitle">
                    <span>{this.props.post.title}</span>
                </div>
                <div className="postDescription">
                    {this.createDescription()}
                </div>
                <div
                    className="is-divider"
                    style={{ margin: '15px 0 10px 0' }}
                />
                <div style={{ textAlign: 'center' }}>
                    <ForecastMapList
                        imagesPublicIds={this.props.post.imagesPublicIds}
                    />
                </div>
            </div>
        );
    }
}
