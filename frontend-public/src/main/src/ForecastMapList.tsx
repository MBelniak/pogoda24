import React from 'react';
import { Image, Video, Transformation } from 'cloudinary-react';

interface Post {
    id: number;
    postDate: Date;
    description: string;
    imagesPublicIds: string[];
}

export class ForecastMapList extends React.Component<{post: Post}> {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                {this.props.post.imagesPublicIds.map((imagePublicId, i) => (
                        <Image publicId={imagePublicId} format="png" quality="auto" key={i}>
                            <Transformation crop="fill" gravity="faces"/>
                        </Image>
                    ))}
            </div>
        )
    }
}