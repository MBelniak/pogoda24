import React from 'react';
import { Posts } from './Posts';
import { ExternalApi } from './ExternalApi';
import Post, { postDTOToPost } from './Post';
import { fetchApi } from './helper/fetchHelper';

interface State {
    posts: Post[];
    loading: boolean;
}

export class MainPage extends React.Component<{}, State> {
    private readonly forecastsPerPage = 4;
    private abortController;

    state: State = {
        posts: [],
        loading: true
    };

    constructor(props) {
        super(props);
        this.abortController = new AbortController();
    }

    componentDidMount() {
        fetchApi('api/posts?page=0&count=' + this.forecastsPerPage, {
            signal: this.abortController.signal
        })
            .then(response =>
                response.json().then(posts => {
                    this.setState({
                        posts: posts.map(post => postDTOToPost(post)),
                        loading: false
                    });
                }).catch(error => {
                    console.log(error);
                })
            )
            .catch(error => {
                console.log(error);
            });
    }

    componentWillUnmount() {
        this.abortController.abort();
    }

    render() {
        return (
            <section className="mainContent">
                <div className="columns">
                    <div className="column is-2" />
                    {this.state.loading ? (
                        <div className="column is-8" />
                    ) : (
                        <div className="column is-8 posts">
                            {this.state.posts.length !== 0 ? (
                                <Posts posts={this.state.posts} />
                            ) : (
                                <div
                                    style={{
                                        textAlign: 'center',
                                        marginTop: '20px'
                                    }}>
                                    <p className="noPosts">Brak postów.</p>
                                </div>
                            )}
                        </div>
                    )}
                    <ExternalApi />
                </div>
            </section>
        );
    }
}
