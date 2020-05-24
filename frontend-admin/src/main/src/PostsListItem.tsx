import React from 'react';
import { Image, Transformation } from 'cloudinary-react';
import Post, { PostType } from './Post';
import { fetchApi } from './helpers/fetchHelper';
const showModal = require('shared24').showModal;
const closeModal = require('shared24').closeModal;
const LoadingIndicator = require('shared24').LoadingIndicator;

interface PostListItemProps {
    post: Post;
    initiatePostEdit: (post: Post) => void;
}

export default class PostsListItem extends React.Component<PostListItemProps> {
    private warningInfoDueDate: Date | null;
    private abortController: AbortController;

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

    render() {
        return (
            <div className="postsListItem columns">
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
                    {this.props.post.postType === PostType.WARNING ? (
                        <p>
                            Ważne do:{' '}
                            {this.processDate(this.props.post.dueDate)}
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
                    {this.props.post.imagesPublicIds
                        ? this.props.post.imagesPublicIds.map(
                              (imagePublicId, i) => (
                                  <div key={i} className="postIconListItem">
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
            </div>
        );
    }
}
