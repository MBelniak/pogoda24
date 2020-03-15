import React from "react";
import { LoadingIndicator } from "./LoadingIndicator";
import { ForecastMapList } from "./ForecastMapList";

interface State {
    loading: boolean;
    posts: ShortPost[];
}

export class PostsShort extends React.Component<{forecastCount}, State> {
    constructor(props) {
        super(props)
    }

    state: State = {
        loading: true,
        posts: []
    };

    async componentDidMount() {
        try {
            let response = await fetch("api/posts?page=0&count="+this.props.forecastCount);
            let data = await response.json();
            this.setState({ loading: false, posts: data });
        } catch (error) {
            this.setState({ loading: false, posts: [] })
        }
    }

    private processDate(postDate: Date) {
        const date = postDate.toString().split("T")[0];
        const time = postDate.toString().split("T")[1].substr(0, 5);
        return date + ' o ' + time;
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
                {this.state.posts.map(post => (
                    <div className="post">
                        <div className="postdate ">
                            {this.processDate(post.postDate)}
                        </div>
                        <div className="bold center">
                            {this.processDescription(post.description)}
                            {/*--TODO implement Router */}
                            <a href={'/api/posts/' + post.id} style={{color: "#66AAFF"}}>+ Czytaj dalej</a>
                            <br/>
                            <ForecastMapList id={post.id}/>
                        </div>
                    </div>
                ))}
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