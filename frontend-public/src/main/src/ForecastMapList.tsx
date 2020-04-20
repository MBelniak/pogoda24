import React from 'react';
import { Image, Transformation } from 'cloudinary-react';

export class ForecastMapList extends React.Component<{
    imagesPublicIds?: string[];
}> {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                {this.props.imagesPublicIds
                    ? this.props.imagesPublicIds.map((imagePublicId, i) => (
                          <Image
                              publicId={imagePublicId}
                              format="png"
                              quality="auto"
                              key={i}>
                              <Transformation crop="fill" gravity="faces" />
                          </Image>
                      ))
                    : null}
            </div>
        );
    }
}
