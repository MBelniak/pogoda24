import React from 'react';
import { Posts } from './Posts';
import { ExternalApi } from './ExternalApi';

interface Post {
    id: number;
    postDate: Date;
    postType: string
    description: string;
    imagesPublicIdsJSON: string[];
    addedToTopBar: boolean,
    dueDate: string,
    shortDescription: string
}

interface State {
    posts: Post[],
    loading: boolean;
}

export class MainPage extends React.Component<{}, State> {

    private readonly forecastsPerPage = 4;

    state: State = {
        posts: [],
        loading: true
    };

    componentDidMount() {
        fetch("api/posts?page=0&count=" + this.forecastsPerPage)
            .then(response => response.json().then(data => {
                this.setState({ posts: data, loading: false });
            }));
    }

    render() {
        return (
            <section className="mainContent">
                <div className="columns">
                    <div className="column is-2" />
                    {this.state.loading
                        ? <div className='column is-8' />
                        : <div className="column is-8 posts">
                            {this.state.posts.length !== 0
                                ? <Posts posts={this.state.posts}/>
                                : <div style={{textAlign: "center", marginTop: "20px"}}>
                                    <p className="noPosts">Brak postów.</p>
                                </div>
                            }
                        </div>
                    }
                    <ExternalApi/>
                </div>
            </section>
        );
    }
}