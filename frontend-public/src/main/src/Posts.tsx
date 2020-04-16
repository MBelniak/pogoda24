import React from 'react';
import { ForecastMapList } from './ForecastMapList';

interface State {
    expandedPosts: number[];
}

interface Post {
    id: number;
    postDate: Date;
    description: string;
    imagesPublicIds: string[];
}

interface PostsProps {
    posts: Post[];
}

export class Posts extends React.Component<PostsProps, State> {

    state: State = {
        expandedPosts: []
    };

    constructor(props) {
        super(props);
    }


    private processDate(postDate: Date) {
        const date = postDate.toString().split("T")[0];
        const time = postDate.toString().split("T")[1].substr(0, 5);
        return date + ' o ' + time;
    }

    private expandPost(id: number) {
        const expandedPosts = this.state.expandedPosts;
        this.setState({expandedPosts: [...expandedPosts, id]});
    }

    private processDescription(post: Post) {
        let description = post.description;
        const expanded = this.state.expandedPosts.indexOf(post.id) > -1 || post.description.length < 170;
        if (!expanded) {
            let length = 170;
            while (post.description.substr(length, 1) != ' ') {
                --length;
            }
            description  = post.description.substr(0, length) + ' ...';
        }

        description = description.replace("\r\n", "<br/><br/>").replace("\n", "<br/><br/>");
        return (
            <div className="postDescription">
                <span dangerouslySetInnerHTML={{ __html: description }}>
                </span>
                {expanded ? null
                    : <a className="postLink"
                         onClick={() => this.expandPost(post.id)}> więcej</a>
                }
            </div>
        );
    }

    private renderPost(post: Post, i: number) {
        return (
            <div key={i} className="post">
                <div className="postdate">
                    {this.processDate(post.postDate)}
                </div>
                <br/>
                {this.processDescription(post)}
                <div className="is-divider" style={{margin: "15px 0 10px 0"}}/>
                <div style={{textAlign: "center"}}>
                    <ForecastMapList imagesPublicIds={post.imagesPublicIds} />
                </div>
            </div>
        );
    }

    render() {
        if (!this.props.posts || this.props.posts.length === 0) {
            return (
                <div style={{textAlign: "center", marginTop: "20px"}}>
                    <p>Brak postów.</p>
                </div>
            )
        }
        return (
            <div>
                {this.props.posts.map((post, i) => this.renderPost(post, i))}
            </div>
        )
    }
}

