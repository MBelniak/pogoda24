import React from "react";
import LoadingIndicator from "./LoadingIndicator";
import ForecastMapList from "./ForecastMapList";

interface State {
    loading: boolean;
    posts: ShortPost[] | null;
}

export default class PostsShort extends React.Component<{}, State> {
    constructor(props) {
        super(props)
    }

    state: State = {
        loading: true,
        posts: null
    };

    async componentDidMount() {
        try {
            let response = await fetch("api/posts?page=0&count=10");
            let data = await response.json();
            this.setState({ loading: false, posts: data });
        } catch (error) {
            this.setState({ loading: false, posts: null })
        }
    }

    renderPosts() {
        const posts = this.state.posts;
        if (posts != null) {
            return posts.map(post => (
                <div className="post">
                    <div className="postdate ">
                        {post.postDate}
                    </div>
                    <div className="bold">
                        <div className="center">
                            {post.shortDesc}
                            {/*--TODO implement Router */}
                            <a href={'/api/posts/' + post.id} style={{color: "#66AAFF"}}>+ Czytaj dalej</a>
                            <br/>
                            <ForecastMapList id={post.id}/>))}
                        </div>
                    </div>
                </div>
            ))
        }
        else
            return(
                <div className="post">
                </div>
            )
    }

    render() {
        if (this.state.loading) {
            return <LoadingIndicator />
        }

        if (this.state.posts == null) {
            return (
                <div className="postsShort">
                    No posts available
                </div>
            )
        }

        return (
            <div className="postsShort">
                {this.renderPosts}
            </div>
        )
    }
}

class ShortPost {
    id: number;
    postDate: Date;
    shortDesc: string;
    longDescId: number;

    constructor(id, postDate, shortDesc, imagesIds, longDescId) {
            this.id = id;
            this.postDate = postDate;
            this.shortDesc = shortDesc;
            this.longDescId = longDescId;
    }
}