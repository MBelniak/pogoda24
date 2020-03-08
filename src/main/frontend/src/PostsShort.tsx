import React from "react";
import LoadingIndicator from "./LoadingIndicator";
import ForecastMapList from "./ForecastMapList";

interface State {
    loading: boolean;
    posts: ShortPost[];
}

export default class PostsShort extends React.Component<{}, State> {
    constructor(props) {
        super(props)
    }

    state: State = {
        loading: true,
        posts: []
    };

    async componentDidMount() {
        try {
            let response = await fetch("api/posts?page=0&count=10");
            let data = await response.json();
            this.setState({ loading: false, posts: data });
        } catch (error) {
            this.setState({ loading: false, posts: [] })
        }
    }

    private processDescription(description: string) {
        let result = description;
        if (description.length > 170) {
            let length = 170;
            while (description.substr(length, 1) != ' ') {
                --length;
            }
            result = description.substr(0, length) + '...';
        }

        result.replace("\r\n", "<br/>");
        return result;
    }


    renderPosts() {
        return this.state.posts.map(post => (
            <div className="post">
                <div className="postdate ">
                    {post.postDate}
                </div>
                <div className="bold center">
                    {this.processDescription(post.description)}
                    {/*--TODO implement Router */}
                    <a href={'/api/posts/' + post.id} style={{color: "#66AAFF"}}>+ Czytaj dalej</a>
                    <br/>
                    <ForecastMapList id={post.id}/>
                </div>
            </div>
        ))
    }

    render() {
        if (this.state.loading) {
            return <LoadingIndicator />
        }
        if (this.state.posts === null) {
            return (
                <div className="postsShort">
                    No posts available
                </div>
            )
        }
        return (
            <div className="postsShort">
                {this.renderPosts()}
            </div>
        )
    }
}

class ShortPost {
    id: number;
    postDate: Date;
    description: string;

    constructor(id, postDate, description) {
            this.id = id;
            this.postDate = postDate;
            this.description = description;
    }
}