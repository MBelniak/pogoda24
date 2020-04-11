import React from 'react';
import { ForecastMapList } from './ForecastMapList';

interface State {
    loading: boolean;
    posts: Post[];
    expandedPosts: number[];
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
        posts: [],
        expandedPosts: []
    };

    constructor(props) {
        super(props);
    }

    async componentDidMount() {
        try {
            let response = await fetch("api/forecasts?page=0&count="+this.props.forecastCount);
            this.setState({ loading: false, posts: await response.json() });
        } catch (error) {
            this.setState({ loading: false, posts: [] })
        }
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
                    : <a style={{color: "blue"}}
                         onClick={() => this.expandPost(post.id)}> więcej</a>
                }
            </div>
        );
    }

    private renderPost(post: Post, i: number) {
        return (
            <div  style={{padding: "10px"}} key={i}>
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
            <div className={'column post ' + this.props.className}>
                {this.state.posts.map((post, i) => this.renderPost(post, i))}
            </div>
        )
    }
}

