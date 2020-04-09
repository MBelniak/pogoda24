import React from 'react';
import { ForecastMapList } from './ForecastMapList';

interface State {
    loading: boolean;
    posts: Post[];
}

interface Post {
    id: number;
    postDate: Date;
    description: string;
    imagesPublicIds: string[];
}


export class PostsShort extends React.Component<{forecastCount: number, className: string}, State> {
    state: State = {
        loading: true,
        posts: []
    };

    constructor(props) {
        super(props)
    }

    async componentDidMount() {
        try {
            let response = await fetch("api/forecasts?page=0&count="+this.props.forecastCount);
            let data = await response.json();
            console.log(data);
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

    private processDescription(post: any) {
        let result = post.description;
        if (post.description.length > 170) {
            let length = 170;
            while (post.description.substr(length, 1) != ' ') {
                --length;
            }
            result = post.description.substr(0, length) + '...';
            result +=  <a href={'/api/posts/' + post.id} style={{color: "blue"}}>+ Czytaj dalej</a>
        }

        result.replace("\r\n", "<br/>");
        return result;
    }

    render() {
        if (this.state.loading) {
            return <div />
        }
        if (!this.state.posts || this.state.posts.length === 0) {
            return (
                <div className={'column ' + this.props.className} style={{textAlign: "center", marginTop: "20px"}}>
                    <p>No posts available</p>
                </div>
            )
        }
        return (
            <div className={'column ' + this.props.className}>
                {this.state.posts.map((post, i) => (
                    <div className="post" key={i}>
                        <div className="postdate">
                            {this.processDate(post.postDate)}
                        </div>
                        <div className="bold center description">
                            {this.processDescription(post)}
                            {/*--TODO implement Router */}
                            <br/>
                            <ForecastMapList imagesPublicIds={post.imagesPublicIds} />
                        </div>
                    </div>
                ))}
            </div>
        )
    }
}

