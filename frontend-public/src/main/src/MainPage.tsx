import React from 'react';
import { PostsList } from './PostsList';
import { ExternalApi } from './ExternalApi';
import Post, { postDTOToPost } from './Post';
import { fetchApi } from './helper/fetchHelper';
import CustomLinearProgress from './LinearProgress';


interface State {
    posts: Post[] | undefined;
}

export class MainPage extends React.Component<{}, State> {
    private readonly forecastsPerPage = 4;
    private abortController;

    state: State = {
        posts: undefined
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
                response
                    .json()
                    .then(posts => {
                        this.setState({
                            posts: posts.map(post => postDTOToPost(post))
                        });
                    })
                    .catch(error => {
                        console.log(error);
                        this.setState({posts: []});
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
                    <div className="column is-8 posts">
                        {this.state.posts ? this.state.posts.length !== 0 ? (
                            <PostsList posts={this.state.posts} />
                        ) : (
                            <div
                                style={{
                                    textAlign: 'center',
                                    marginTop: '20px'
                                }}>
                                <p className="noPosts">Brak postów.</p>
                            </div>
                        ) : <CustomLinearProgress />}
                    </div>
                    <ExternalApi />
                </div>
            </section>
        );
    }
}
