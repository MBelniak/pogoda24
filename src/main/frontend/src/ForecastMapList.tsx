import React from "react";

interface State {
    loading: boolean;
    imageURL?: string;
}

export default class ForecastMapList extends React.Component<{id: number}, State> {

    constructor(props) {
        super(props);
    }
    state: State = {
      loading: true,
      imageURL: undefined
    };

    async componentDidMount() {
        let url = 'api/images?postId=' + this.props.id;
        try {
            let response = await fetch(url);
            this.setState({loading: false, imageURL: window.URL.createObjectURL(response)})
        } catch (error) {
            this.setState({loading: false, imageURL: undefined});
            console.log("Cannot load image");
        }
    }

    render() {
        if (this.state.loading === true) {
            return (
                <div>
                    Loading...
                </div>
            )
        }
        if (this.state.imageURL == null) {
            return (
                <div>
                    Cannot load image.
                </div>
            )
        }
        return (
            <a href={this.state.imageURL}>
                <img className="pimg" src={this.state.imageURL} width='49%'/>
            </a>
        )
    }
}