import React from 'react';
import Post, { PostType } from '../../model/Post';
import { Link } from 'react-router-dom';
import { ForecastMapList } from './ForecastMapList';
import { Image, Transformation } from 'cloudinary-react';
import config from '../../config/config';
import '../../sass/main.scss';
import 'suneditor/dist/css/suneditor.min.css';

const { nonExpandedPostLength } = config;

interface PostsItemProps {
    post: Post;
    registerView: (id: number[]) => void;
}

interface PostsItemState {
    isExpanded: boolean;
}

export default class PostsListItem extends React.Component<PostsItemProps, PostsItemState> {
    private postHref;
    constructor(props) {
        super(props);
        this.expandPost = this.expandPost.bind(this);
        this.state = {
            isExpanded: this.isExpandedByDefault()
        };
        this.postHref = 'posts/' + this.props.post.id;
    }

    private isExpandedByDefault() {
        let description;
        if (this.props.post.postType === 'FACT') {
            return false;
        } else {
            description = this.props.post.description;
        }
        return description.length <= nonExpandedPostLength && description.split(/[(\r\n)(\n)]/g).length <= 2;
    }

    private processDate() {
        const date = this.props.post.postDate.toLocaleString('pl-PL');
        return date.replace(', ', ' o ');
    }

    private expandPost() {
        this.setState({ isExpanded: true });
        this.props.registerView([this.props.post.id]);
    }

    private createDescription() {
        const description = this.processDescription(this.props.post.description);
        return (
            <>
                <span
                    dangerouslySetInnerHTML={{
                        __html: description
                    }}
                    style={{ wordWrap: 'break-word' }}
                />
                {this.state.isExpanded ? null : this.props.post.postType === PostType.FACT ? (
                    <Link to={'/posts/' + this.props.post.id} className="postLink">
                        więcej
                    </Link>
                ) : (
                    <a className="postLink" onClick={this.expandPost}>
                        więcej
                    </a>
                )}
            </>
        );
    }

    private processDescription(description: string): string {
        if (!this.state.isExpanded) {
            if (description.length > nonExpandedPostLength) {
                description = description.substr(0, nonExpandedPostLength);
            }
            if (description.split(/(\r\n)|(\n)/g).length > 2) {
                description = description
                    .split(/(\r\n)|(\n)/g)
                    .slice(0, 2)
                    .join('\n');
            }
            const regex = /^.*\s/g;
            const match = description.match(regex);
            if (match && match[0].length > 70) {
                description = match[0] + '... ';
            } else {
                //let's not clip very long words (does a word over 50 characters long even exist? Probably.)
                description = description + '... ';
            }
        }

        description = description.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>');

        return description;
    }

    private renderMainContent() {
        return (
            <>
                <div className="postDate fontSizeSmall">{this.processDate()}</div>
                <br />
                <div className="postTitle fontSizeLarge">
                    {this.props.post.postType === PostType.FACT ? (
                        <p className="basicLink">{this.props.post.title}</p>
                    ) : (
                        <a href={this.postHref} className="basicLink">
                            {this.props.post.title}
                        </a>
                    )}
                </div>
                {this.props.post.postType !== PostType.FACT && (
                    <div className="postDescription fontSizeSmall">{this.createDescription()}</div>
                )}
                {this.props.post.postType === PostType.FACT ? (
                    <>
                        <div className="is-divider" />
                        <div className="factImage">
                            <Image
                                publicId={
                                    this.props.post.imagesPublicIds.length > 0
                                        ? this.props.post.imagesPublicIds[0]
                                        : 'fb_main_logo_cukiun'
                                }
                                format="png"
                                quality="auto">
                                <Transformation crop="fill" gravity="faces" />
                            </Image>
                        </div>
                    </>
                ) : (
                    this.props.post.imagesPublicIds.length > 0 && (
                        <>
                            <div className="is-divider" />
                            <ForecastMapList imagesPublicIds={this.props.post.imagesPublicIds} />
                        </>
                    )
                )}
            </>
        );
    }

    render() {
        return (
            <div className="post">
                {this.props.post.postType === PostType.FACT ? (
                    <a href={this.postHref}>{this.renderMainContent()}</a>
                ) : (
                    this.renderMainContent()
                )}
            </div>
        );
    }
}
