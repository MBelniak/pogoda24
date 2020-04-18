import React from 'react';

interface Post {
    id: number;
    postDate: Date;
    description: string;
    imagesPublicIds: string[];
}

export default class PostsListItem extends React.Component<{ post: Post }> {
    render() {
        return <div className="postsItem">{this.props.post.description}</div>;
    }
}
