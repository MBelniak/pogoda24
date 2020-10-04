import React from 'react';
import PostsListItem from './PostsListItem';
import Post, { PostDTO, postDTOToPost } from '../../model/Post';
import { fetchApi } from '../../helpers/fetchHelper';
import Writer from '../writer/Writer';
import FactWriter from '../fact-writer/FactWriter';
import { closeModal, showModal } from '../components/modals/Modal';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { TopImage } from '../components/TopImage';
import Copyright from '@shared/components/Copyright';
import { Link } from 'react-router-dom';
import PagingBar from '@shared/components/PagingBar';
import styles from '@shared/scss/main.scss'

interface State {
    posts: Post[] | undefined;
    totalPostsCount: number;
    currentPage: number;
    postToEdit?: Post;
}

export default class PostsList extends React.Component<{}, State> {
    private postsPerPage = 10;
    private abortController;

    state: State = {
        posts: [],
        totalPostsCount: 0,
        currentPage: 0,
        postToEdit: undefined
    };

    constructor(props) {
        super(props);
        this.initiatePostEdit = this.initiatePostEdit.bind(this);
        this.onFinishEditing = this.onFinishEditing.bind(this);
        this.handlePageClick = this.handlePageClick.bind(this);
        this.abortController = new AbortController();
    }

    private initiatePostEdit(post: Post) {
        this.setState({ postToEdit: post });
    }

    private onFinishEditing() {
        showModal(<LoadingIndicator />);
        this.setState({ postToEdit: undefined });
        this.fetchPostsFromApi(0).finally(closeModal);
    }

    private fetchPostsFromApi(page: number): Promise<void> {
        return fetchApi('api/posts?page=' + page + '&count=' + this.postsPerPage, {
            signal: this.abortController.signal
        })
            .then(response => {
                if (response && response.ok) {
                    response
                        .json()
                        .then((posts: PostDTO[]) => {
                            this.setState({
                                posts: posts.map(post => postDTOToPost(post))
                            });
                            closeModal();
                        })
                        .catch(error => {
                            console.log(error);
                        });
                } else {
                    this.setState({ posts: [] });
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    private handlePageClick(data) {
        const selected = data.selected;
        this.setState({ posts: undefined, currentPage: selected });
        showModal(<LoadingIndicator />);
        this.fetchPostsFromApi(selected).finally(closeModal);
    }

    componentDidMount() {
        showModal(<LoadingIndicator />);
        fetchApi('api/posts/count', { signal: this.abortController.signal })
            .then(response =>
                response
                    .json()
                    .then(data => {
                        this.setState({ totalPostsCount: data });
                        this.fetchPostsFromApi(0).finally(closeModal);
                    })
                    .catch(error => {
                        console.log(error);
                        closeModal();
                    })
            )
            .catch(error => {
                console.log(error);
                closeModal();
            });
    }

    componentWillUnmount() {
        this.abortController.abort();
    }

    render() {
        return (
            <>
                {this.state.postToEdit ? (
                    this.state.postToEdit.postType === 'FACT' ? (
                        <FactWriter postToEdit={this.state.postToEdit} />
                    ) : (
                        <Writer postToEdit={this.state.postToEdit} onFinishEditing={this.onFinishEditing} />
                    )
                ) : (
                    <div className="main">
                        <section className="container is-fluid">
                            <TopImage />
                            <h2 className="title">Lista postów: </h2>
                            <div className="container">
                                {!this.state.posts ? null : this.state.posts.length === 0 ? (
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
                                )}
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
                            <div className="is-divider"/>
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
