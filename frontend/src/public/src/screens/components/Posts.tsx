import React from 'react';
import {PostsList} from './PostsList';
import Post, {postDTOToPost, PostType} from '../../model/Post';
import {fetchApi} from '../../helpers/fetchHelper';
import CustomLinearProgress from './LinearProgress';
import './Posts.scss';
import PagingBar from '@shared/components/PagingBar';
import styles from '@shared/scss/main.scss';

interface State {
    posts: Post[] | undefined;
    totalPostsCount: number;
    currentPage: number;
}

export class Posts extends React.Component<{ postType: PostType }, State> {
    private readonly postsPerPage;
    private abortController;

    state: State = {
        posts: undefined,
        totalPostsCount: 0,
        currentPage: 0
    };

    constructor(props) {
        super(props);
        this.handlePageClick = this.handlePageClick.bind(this);
        this.abortController = new AbortController();
        this.postsPerPage = this.props.postType === PostType.FACT ? 10 : 5;
    }

    private async fetchPosts() {
        try {
            const response = await fetchApi(
                'api/posts?postType=' + this.props.postType.toString() + '&page=' + this.state.currentPage + '&count=' + this.postsPerPage
            );
            if (response && response.ok) {

                const posts = await response.json();
                this.setState({
                    posts: posts.map(post => postDTOToPost(post))
                });
            } else {
                this.setState({posts: []});
            }
        } catch (error) {
            this.setState({posts: []});
            console.log(error);
        }
    }

    private async refreshPosts(): Promise<void> {
        this.setState({posts: undefined});
        try {
            const response = await fetchApi('api/posts/count?postType=' + this.props.postType.toString(), {
                signal: this.abortController.signal
            });
            if (response && response.ok) {
                const data = await response.json();
                this.setState({totalPostsCount: data}, () => {
                    if (this.state.totalPostsCount !== 0) {
                        this.fetchPosts();
                    } else {
                        this.setState({posts: []});
                    }
                });
            } else {
                this.setState({posts: []});
            }
        } catch (error) {
            this.setState({posts: []});
            console.log(error);
        }
    }

    private handlePageClick(data) {
        const selected = data.selected;
        this.setState({posts: undefined, currentPage: selected}, this.fetchPosts);
    }

    private postTypeToText(): string {
        return this.props.postType == PostType.FACT
            ? 'ciekawostek'
            : this.props.postType == PostType.WARNING
                ? 'ostrzeżeń'
                : 'prognoz';
    }

    componentDidUpdate(prevProps) {
        if (this.props.postType !== prevProps.postType) {
            this.setState({totalPostsCount: 0, currentPage: 0});
            this.refreshPosts();
        }
    }

    componentDidMount() {
        this.refreshPosts();
    }

    componentWillUnmount() {
        this.abortController.abort();
    }

    render() {
        return (
            <section className="mainContent">
                <div className="columns">
                    <div className="column is-1"/>
                    <div className="column is-10 posts">
                        {this.state.posts ? (
                            this.state.posts.length !== 0 ? (
                                <div>
                                    <PostsList posts={this.state.posts}/>
                                    {this.state.totalPostsCount <= this.postsPerPage ? null : (
                                        <PagingBar
                                            pages={Math.ceil(this.state.totalPostsCount / this.postsPerPage)}
                                            handlePageClick={this.handlePageClick}
                                            currentPage={this.state.currentPage}
                                            mainColor={styles.secondaryColor}
                                            shadowColor={styles.primaryColor}
                                        />
                                    )}
                                </div>
                            ) : (
                                <div
                                    style={{
                                        textAlign: 'center',
                                        marginTop: '20px'
                                    }}>
                                    <p className="fontSizeLarge">Brak {this.postTypeToText()}.</p>
                                </div>
                            )
                        ) : (
                            <CustomLinearProgress/>
                        )}
                    </div>
                    <div className="column is-1"/>
                </div>
            </section>
        );
    }
}
