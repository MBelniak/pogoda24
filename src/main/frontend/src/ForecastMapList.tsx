import React from "react";

interface State {
    loading: boolean;
    imagesURLs: string[];
}

export class ForecastMapList extends React.Component<{id: number}, State> {

    constructor(props) {
        super(props);
    }
    state: State = {
      loading: true,
      imagesURLs: []
    };

    async componentDidMount() {
        let url = 'api/images/urls?postId=' + this.props.id;
        try {
            let response = await fetch(url);
            let data = await response.json();
            this.setState({loading: false, imagesURLs: data})
        } catch (error) {
            this.setState({loading: false, imagesURLs: []});
            console.log("Cannot load image");
        }
    }

    renderMaps() {
        return this.state.imagesURLs.map(imageURL => (
            <a href={imageURL}>
                <img className="pimg" src={'api/images/' + imageURL} width='49%'/>
            </a>
        ))
    }



    render() {
        if (this.state.loading === true) {
            return (
                <div>
                    Loading...
                </div>
            )
        }
        if (this.state.imagesURLs == null) {
            return (
                <div>
                    Cannot load images.
                </div>
            )
        }
        return (
            <div>
                {this.renderMaps()}
            </div>
        )
    }
}