import React from 'react';
import PostsListItem from './PostsListItem';
import Post, {PostDTO, postDTOToPost} from '../../model/Post';
import {fetchApi} from '../../helpers/fetchHelper';
import Writer from '../writer/Writer';
import FactWriter from '../fact-writer/FactWriter';
import {closeModal, showModal} from '../components/modals/Modal';
import {LoadingIndicator} from '../components/LoadingIndicator';
import {TopImage} from '../components/TopImage';
import Copyright from '@shared/components/Copyright';
import {Link} from 'react-router-dom';
import PagingBar from '@shared/components/PagingBar';
import styles from '@shared/scss/main.scss';
import {Divider} from "@shared/components/Divider";
import queryString from "query-string";

interface State {
    posts: Post[] | undefined;
    totalPostsCount: number;
    currentPage: number;
    postToEdit?: Post;
}

export default class PostsList extends React.Component<{}, State> {
    private postsPerPage = 10;
    private abortController;

    constructor(props) {
        super(props);
        const pageParam = queryString.parse(location.search).page;
        const currentPage = pageParam ? Array.isArray(pageParam) ? pageParam[0] : parseInt(pageParam) - 1 : 0;
        this.state = {
            posts: undefined,
            totalPostsCount: 0,
            currentPage,
            postToEdit: undefined
        } as State;
        this.initiatePostEdit = this.initiatePostEdit.bind(this);
        this.onFinishEditing = this.onFinishEditing.bind(this);
        this.handlePageClick = this.handlePageClick.bind(this);
        this.abortController = new AbortController();
    }

    private initiatePostEdit(post: Post) {
        this.setState({postToEdit: post});
    }

    private onFinishEditing() {
        showModal(<LoadingIndicator/>);
        this.setState({postToEdit: undefined});
        this.fetchPostsFromApi().finally(closeModal);
    }

    private async fetchPostsFromApi(): Promise<void> {
        try {
            const response = await fetchApi('api/posts?page=' + this.state.currentPage + '&count=' + this.postsPerPage, {
                signal: this.abortController.signal
            });
            if (response && response.ok) {
                const posts: PostDTO[] = await response.json();
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

    private handlePageClick(data) {
        const selected = data.selected;
        this.setState({posts: undefined, currentPage: selected}, () => {
            showModal(<LoadingIndicator/>);
            this.fetchPostsFromApi().finally(closeModal);
            const pageParams = queryString.parse(location.search)
            pageParams.page = `${this.state.currentPage + 1}`;
            window.history.replaceState(null, "", `?${queryString.stringify(pageParams)}`);
        });
    }

    async componentDidMount() {
        showModal(<LoadingIndicator/>);
        try {
            const response = await fetchApi('api/posts/count', {signal: this.abortController.signal});
            const data = await response.json();
            this.setState({totalPostsCount: data});
            await this.fetchPostsFromApi();
        } catch (error) {
            console.log(error);
        } finally {
            closeModal();
        }
    }

    componentWillUnmount() {
        this.abortController.abort();
    }

    render() {
        return (
            <>
                {this.state.postToEdit ? (
                    this.state.postToEdit.postType === 'FACT' ? (
                        <FactWriter postToEdit={this.state.postToEdit} onFinishEditing={this.onFinishEditing}/>
                    ) : (
                        <Writer postToEdit={this.state.postToEdit} onFinishEditing={this.onFinishEditing}/>
                    )
                ) : (
                    <div className="main">
                        <section className="container is-fluid">
                            <TopImage/>
                            <h2 className="title">Lista postów: </h2>
                            <div className="container">
                                {this.state.posts ? (
                                    this.state.posts.length === 0 ? (
                                        <div
                                            style={{
                                                textAlign: 'center',
                                                marginTop: '20px'
                                            }}>
                                            <p>Brak postów.</p>
                                        </div>
                                    ) : (
                                        <div>
                                            {this.state.posts.map((post, i) => (
                                                <PostsListItem
                                                    key={i}
                                                    post={post}
                                                    initiatePostEdit={this.initiatePostEdit}
                                                />
                                            ))}
                                        </div>
                                    )
                                ) : null}
                            </div>
                            {this.state.totalPostsCount <= this.postsPerPage ? null : (
                                <PagingBar
                                    pages={Math.ceil(this.state.totalPostsCount / this.postsPerPage)}
                                    handlePageClick={this.handlePageClick}
                                    currentPage={this.state.currentPage}
                                    mainColor={styles.secondaryColor}
                                    shadowColor={styles.secondaryColor}
                                    fontColor={'white'}
                                />
                            )}
                            <Divider/>
                            <Link to="/write" className="button">
                                Wróć
                            </Link>
                        </section>
                        <Copyright fontColor={'white'}/>
                    </div>
                )}
            </>
        );
    }
}
