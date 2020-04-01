import React from 'react';
import { Image, Video, Transformation } from 'cloudinary-react';

interface State {
    loading: boolean;
    imagesPublicIds: string[];
}

export class ForecastMapList extends React.Component<{id: number}, State> {

    constructor(props) {
        super(props);
    }
    state: State = {
      loading: true,
      imagesPublicIds: []
    };

    async componentDidMount() {
        let url = 'api/images/publicIds?postId=' + this.props.id;
        try {
            let response = await fetch(url);
            let data = await response.json();
            this.setState({loading: false, imagesPublicIds: data})
        } catch (error) {
            this.setState({loading: false, imagesPublicIds: []});
            console.log("Cannot load image");
        }
    }

    renderMaps() {
        return this.state.imagesPublicIds.map((imagePublicId, i) => (
                    <Image publicId="sample" format="jpg" quality="auto" key={i}>
                        <Transformation crop="fill" gravity="faces"/>
                    </Image>
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
        if (this.state.imagesPublicIds == null) {
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