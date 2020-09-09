import React from 'react';
import Post, { postDTOToPost, PostType } from '../../model/Post';
import { fetchApi } from '../../helpers/fetchHelper';
import { ForecastMapList } from '../components/ForecastMapList';
import CustomLinearProgress from '../components/LinearProgress';
import '../../sass/main.scss';

interface State {
    loading: boolean;
}

export default class PostView extends React.Component<{}, State> {
    state: State = {
        loading: true
    };

    private post: Post | undefined;
    private controller;

    constructor(props) {
        super(props);
        this.post = undefined;
        this.controller = new AbortController();
    }

    componentDidMount() {
        const splitted = location.href.split('/');
        const postId = splitted[splitted.length - 1];
        if (postId) {
            fetchApi('api/posts/' + postId, { signal: this.controller.signal })
                .then(response => {
                    if (response && response.ok) {
                        response
                            .json()
                            .then(post => {
                                this.post = postDTOToPost(post);
                                this.setState({ loading: false });
                            })
                            .catch(error => {
                                this.setState({ loading: false });
                                console.log(error);
                            });
                    } else {
                        this.setState({ loading: false });
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        } else {
            console.log('Incorrect URL for post: ' + location.href);
        }
    }

    private processDate(postDate: Date) {
        const date = postDate.toLocaleString('pl-PL');
        return date.replace(', ', ' o ');
    }

    private processDescription() {
        if (this.post) {
            return this.post.description
                .replace(/\r\n/g, '<br/>')
                .replace(/\n/g, '<br/>');
        }
        return '';
    }

    private processDescriptionForFact(post: Post) {
        return (
            <div
                dangerouslySetInnerHTML={{
                    __html: post.description.replace(/\\"/g, '"')
                }}
                style={{
                    wordWrap: 'break-word'
                }}
            />
        );
    }

    componentWillUnmount() {
        this.controller.abort();
    }

    render() {
        return (
            <section className="mainContent container is-fluid">
                <div>
                    {this.state.loading ? (
                        <CustomLinearProgress />
                    ) : (
                        <div className="posts">
                            {this.post ? (
                                <div className="post">
                                    <div className="postdate fontSizeSmall">
                                        {this.processDate(this.post.postDate)}
                                    </div>
                                    <br />
                                    <div className="postTitle fontSizeLarge">
                                        <span
                                            style={{ wordWrap: 'break-word' }}>
                                            {this.post.title}
                                        </span>
                                    </div>
                                    <div className="postDescription fontSizeSmall">
                                        {this.post.postType ===
                                        PostType.FACT ? (
                                            this.processDescriptionForFact(
                                                this.post
                                            )
                                        ) : (
                                            <span
                                                dangerouslySetInnerHTML={{
                                                    __html: this.processDescription()
                                                }}
                                                style={{
                                                    wordWrap: 'break-word'
                                                }}
                                            />
                                        )}
                                    </div>
                                    <div
                                        className="is-divider"
                                    />
                                    <div style={{ textAlign: 'center' }}>
                                        <ForecastMapList
                                            imagesPublicIds={
                                                this.post.imagesPublicIds
                                            }
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div
                                    style={{
                                        textAlign: 'center',
                                        marginTop: '20px'
                                    }}>
                                    <p className="fontSizeLarge">
                                        Nie udało się znaleźć posta.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>
        );
    }
}
