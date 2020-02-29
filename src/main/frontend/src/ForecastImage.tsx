import React from "react";

interface State {
    loading: boolean;
    imageURL: URL;
}

export default class ForecastImage extends React.Component<{}, State> {

    constructor(props) {
        super(props);
    }
    state: State = {
      loading: true,
      imageURL: null
    };

    async componentDidMount() {
        let url = 'api/images/' + this.imageId;
        try {
            let response = await fetch(url);
            this.setState({loading: false, imageURL: window.createObjectURL(response)})
        } catch (error) {
            this.setState({loading: false, imageURL: null});
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