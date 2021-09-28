import React from 'react';
import {PostsList} from '../components/PostsList';
import {ExternalApi} from './ExternalApi';
import Post, {postDTOToPost} from '../../model/Post';
import {fetchApi} from '../../helpers/fetchHelper';
import zonedTimeToUtc from 'date-fns-tz/zonedTimeToUtc';
import CustomLinearProgress from '../components/LinearProgress';
import {CurrentWarnings} from './CurrentWarnings';
import '../../sass/main.scss';

export interface WarningInfo {
    title: string;
    postId: string;
    dueDate: Date;
}

interface State {
    posts: Post[] | undefined;
    warningInfo?: WarningInfo[];
}

export class MainPage extends React.Component<{}, State> {
    private readonly forecastsPerPage = 4;
    private abortController;

    state: State = {
        posts: undefined,
        warningInfo: undefined
    };

    constructor(props) {
        super(props);
        this.abortController = new AbortController();
    }

    private async fetchPosts() {
        try {
            const response = await fetchApi('api/posts?page=0&count=' + this.forecastsPerPage, {
                signal: this.abortController.signal
            });
            if (response && response.ok) {

                const posts = await response.json();
                this.setState({
                    posts: posts.map(post => postDTOToPost(post))
                });
            } else {
                this.setState({posts: []});
            }
        } catch (error) {
            console.log(error);
            this.setState({posts: []});
        }
    }

    private async fetchWarningInfo() {
        try {
            const response = await fetchApi('api/posts/currentWarnings', {
                signal: this.abortController.signal
            });
            if (response && response.ok) {
                const warningInfo = await response.json();
                this.setState({
                    warningInfo: warningInfo.map(info => {
                        return {
                            ...info,
                            dueDate: warningInfo.dueDate
                                ? zonedTimeToUtc(warningInfo.dueDate, 'Europe/Warsaw')
                                : undefined
                        };
                    })
                });

            } else {
                this.setState({warningInfo: []});
                console.log(response);
            }
        } catch (error) {
            console.log(error);
            this.setState({warningInfo: []});
        }
    }

    componentDidMount() {
        this.fetchPosts();
        this.fetchWarningInfo();
    }

    componentWillUnmount() {
        this.abortController.abort();
    }

    render() {
        return (
            <section className="mainContent">
                <div className="columns">
                    {!this.state.warningInfo && !this.state.posts ? (
                        <div className="column is-10">
                            <CustomLinearProgress/>
                        </div>
                    ) : (
                        <>
                            <div className="column is-2 warnings">
                                {this.state.warningInfo ? (
                                    <CurrentWarnings warningInfo={this.state.warningInfo}/>
                                ) : (
                                    <CustomLinearProgress/>
                                )}
                            </div>
                            <div className="column is-8 posts">
                                {this.state.posts ? (
                                    this.state.posts.length !== 0 ? (
                                        <PostsList posts={this.state.posts}/>
                                    ) : (
                                        <div
                                            style={{
                                                textAlign: 'center',
                                                marginTop: '20px'
                                            }}>
                                            <p className="fontSizeLarge">Brak postów.</p>
                                        </div>
                                    )
                                ) : (
                                    <CustomLinearProgress/>
                                )}
                            </div>
                        </>
                    )}
                    <div className="column is-2 fontSizeMedium">
                        <ExternalApi/>
                    </div>
                </div>
            </section>
        );
    }
}
