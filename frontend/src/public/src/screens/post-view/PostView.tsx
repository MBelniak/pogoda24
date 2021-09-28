import React from 'react';
import PostModel, {postDTOToPost} from '../../model/Post';
import {fetchApi} from '../../helpers/fetchHelper';

import CustomLinearProgress from '../components/LinearProgress';
import '../../sass/main.scss';
import {Post} from "./Post";

interface State {
    loading: boolean;
}

export default class PostView extends React.Component<{}, State> {
    state: State = {
        loading: true
    };

    private post: PostModel | undefined;
    private controller;

    constructor(props) {
        super(props);
        this.post = undefined;
        this.controller = new AbortController();
    }

    async componentDidMount() {
        const postId = location.href.split('/').pop();
        if (postId) {
            try {
                const response = await fetchApi('api/posts/' + postId, {signal: this.controller.signal});
                if (response && response.ok) {
                    const post = await response.json();
                    this.post = postDTOToPost(post);
                }
            } catch (error) {
                console.log(error);
            } finally {
                this.setState({loading: false});
            }
        } else {
            console.log('Incorrect URL for post: ' + location.href);
        }
    }

    componentWillUnmount() {
        this.controller.abort();
    }

    render() {
        return (
            <section className="mainContent">
                <div>
                    {this.state.loading ? (
                        <CustomLinearProgress/>
                    ) : (
                        <div className="posts">
                            {this.post ? (<Post {...this.post}/>) : (
                                <div
                                    style={{
                                        textAlign: 'center',
                                        marginTop: '20px'
                                    }}>
                                    <p className="fontSizeLarge">Nie udało się znaleźć posta.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>
        );
    }
}
