import React from 'react';
import Post, { postDTOToPost } from './Post';
import { fetchApi } from './helper/fetchHelper';
import { ForecastMapList } from './ForecastMapList';

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
        const postId = parseInt(splitted[splitted.length - 1]);
        if (postId && postId > 0) {
            fetchApi('api/posts/' + postId, { signal: this.controller.signal })
                .then(response => {
                    if (response && response.ok) {
                        response.json().then(post => {
                            this.post = postDTOToPost(post);
                            this.setState({ loading: false });
                        }).catch(error => {
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
            console.log('Incorrect URL: ' + location.href);
        }
    }

    private processDate(postDate: Date) {
        const date = postDate.toLocaleString('pl-PL');
        return date.replace(', ', ' o ');
    }

    private processDescription(post: Post) {
        let description = post.description
            .replace(/\r\n/g, '<br/>')
            .replace(/\n/g, '<br/>');
        return (
            <div className="postDescription">
                <span dangerouslySetInnerHTML={{ __html: description }}></span>
            </div>
        );
    }

    componentWillUnmount() {
        this.controller.abort();
    }

    render() {
        return (
            <section className="mainContent">
                <div className="columns">
                    <div className="column is-1" />
                    {this.state.loading ? (
                        <div className="column is-10" />
                    ) : (
                        <div className="column is-10 posts">
                            {this.post ? (
                                <div className="post">
                                    <div className="postdate">
                                        {this.processDate(this.post.postDate)}
                                    </div>
                                    <br />
                                    {this.processDescription(this.post)}
                                    <div
                                        className="is-divider"
                                        style={{ margin: '15px 0 10px 0' }}
                                    />
                                    <div style={{ textAlign: 'center' }}>
                                        <ForecastMapList
                                            imagesPublicIds={this.post.imagesPublicIdsJSON}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div
                                    style={{
                                        textAlign: 'center',
                                        marginTop: '20px'
                                    }}>
                                    <p className="noPosts">
                                        Nie udało się znaleźć posta.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                    <div className="column is-1" />
                </div>
            </section>
        );
    }
}
