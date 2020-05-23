import React from 'react';
import { Image, Transformation } from 'cloudinary-react';
import Post, { PostType } from './Post';
import { fetchApi } from './helpers/fetchHelper';
import * as fnstz from 'date-fns-tz';
const showModal = require('shared24').showModal;
const closeModal = require('shared24').closeModal;
const LoadingIndicator = require('shared24').LoadingIndicator;

interface PostListItemProps {
    post: any;
    initiatePostEdit: (post: Post) => void;
}

interface State {
    loading: boolean;
}

export default class PostsListItem extends React.Component<
    PostListItemProps,
    State
> {

    private warningInfoDueDate: Date | null;
    private abortController: AbortController;

    state: State = {
        loading: true
    };

    constructor(props) {
        super(props);
        this.warningInfoDueDate = null;
        this.abortController = new AbortController();
        this.handleDeleteClick = this.handleDeleteClick.bind(this);
        this.deletePost = this.deletePost.bind(this);
    }

    private handleDeleteClick() {
        showModal(
            <div>
                <p className="dialogMessage">
                    Czy na pewno chcesz usunąć ten post?
                </p>
                <button
                    className="button is-secondary"
                    style={{ float: 'right' }}
                    onClick={closeModal}>
                    Nie
                </button>
                <button
                    className="button is-primary"
                    style={{ float: 'right' }}
                    onClick={this.deletePost}>
                    Tak
                </button>
            </div>
        );
    }

    private deletePost() {
        showModal(<LoadingIndicator />);
        fetchApi('api/posts/' + this.props.post.id, {
            method: 'DELETE'
        })
            .then(response => {
                if (response && response.ok) {
                    location.reload();
                } else {
                    console.log(response);
                    showModal(
                        <div>
                            <p className="dialogMessage">
                                Wystąpił błąd podczas usuwania posta.
                            </p>
                            <button
                                className="button is-primary"
                                style={{ float: 'right' }}
                                onClick={closeModal}>
                                Ok
                            </button>
                        </div>
                    );
                }
            })
            .catch(error => {
                console.log(error);
                showModal(
                    <div>
                        <p className="dialogMessage">
                            Wystąpił błąd podczas usuwania posta.
                        </p>
                        <button
                            className="button is-primary"
                            style={{ float: 'right' }}
                            onClick={closeModal}>
                            Ok
                        </button>
                    </div>
                );
            });
    }

    private processDescription() {
        let description = this.props.post.description;
        description = description.substr(0, 70);
        const regex = /^.*\s/g;
        const match = description.match(regex);
        if (match) {
            if (typeof match === 'string') {
                description = match + '...';
            } else {
                description = match[0] + '...';
            }
        }

        return description;
    }

    private processDate(date?: Date) {
        if (date) {
            return date.toLocaleString('pl-PL');
        }
        return '';
    }

    private processPostType() {
        switch (this.props.post.postType) {
            case 'FORECAST': {
                return 'prognoza';
            }
            case 'WARNING': {
                return 'ostrzeżenie';
            }
            case 'FACT': {
                return 'ciekawostka';
            }
            default:
                return 'nieokreślony';
        }
    }

    componentDidMount() {
        if (this.props.post.postType === PostType.WARNING) {
            fetchApi('api/warningInfo/byPostId/' + this.props.post.id, {signal: this.abortController.signal}).then(response => {
                if (response && response.ok) {
                    response.json().then(warningInfo => {
                        this.warningInfoDueDate = fnstz.zonedTimeToUtc(warningInfo.dueDate, 'Europe/Warsaw');
                        this.setState({ loading: false });
                    }).catch(error => {
                        this.setState({ loading: false });
                        console.log(error);
                    })
                }
            }).catch(error => {
                console.log(error);
            });
        } else {
            this.setState({ loading: false });
        }
    }

    render() {
        return (
            <div className="postsListItem columns">
                {this.state.loading ? null : (
                    <>
                        <div className="column is-half">
                            <p>
                                Data dodania:{' '}
                                {this.processDate(this.props.post.postDate)}
                            </p>
                            <p>Tytuł: {this.props.post.title}</p>
                            <p>Opis: {this.processDescription()}</p>
                            <p>
                                Liczba wyświetleń:{' '}
                                {this.props.post.views === null
                                    ? 0
                                    : this.props.post.views}
                            </p>
                            <p>Rodzaj postu: {this.processPostType()}</p>
                            {this.warningInfoDueDate ? (
                                <p>
                                    Ważne do:{' '}
                                    {this.processDate(this.warningInfoDueDate)}
                                </p>
                            ) : null}
                            <input
                                type="button"
                                className="button"
                                value="Edytuj"
                                onClick={() =>
                                    this.props.initiatePostEdit(this.props.post)
                                }
                            />
                            <input
                                type="button"
                                className="button"
                                value="Usuń"
                                onClick={this.handleDeleteClick}
                            />
                        </div>
                        <div className="postIconList">
                            {this.props.post.imagesPublicIdsJSON
                                ? this.props.post.imagesPublicIdsJSON.map(
                                      (imagePublicId, i) => (
                                          <div
                                              key={i}
                                              className="postIconListItem">
                                              <Image
                                                  publicId={imagePublicId}
                                                  format="png"
                                                  quality="auto">
                                                  <Transformation
                                                      crop="fill"
                                                      gravity="faces"
                                                  />
                                              </Image>
                                          </div>
                                      )
                                  )
                                : null}
                        </div>
                    </>
                )}
            </div>
        );
    }
}
