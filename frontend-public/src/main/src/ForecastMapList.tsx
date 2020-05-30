import React from 'react';
import { Image, Transformation } from 'cloudinary-react';
const showModal = require('shared24').showModal;
const closeModal = require('shared24').closeModal;


export class ForecastMapList extends React.Component<{
    imagesPublicIds?: string[];
}> {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (this.props.imagesPublicIds) {
            const images = document.querySelectorAll(".forecastMapImage img");
            images.forEach(img => {
                img.addEventListener("click", event => {
                    showModal(
                        <div
                            style={{
                                textAlign: 'center',
                                maxWidth: '100%',
                                maxHeight: '100%'
                            }}
                            onClick={() => closeModal()}>
                            <img src={img.getAttribute("src")!!}/>
                        </div>
                    );
                })
            });
        }
    }

    render() {
        return (
            <div className="forecastMapList">
                {this.props.imagesPublicIds
                    ? this.props.imagesPublicIds.map((imagePublicId, i) => (
                          <div
                              className="forecastMapImage"
                              key={i}>
                              <Image
                                  publicId={imagePublicId}
                                  format="png"
                                  quality="auto">
                                  <Transformation crop="fill" gravity="faces" />
                              </Image>
                          </div>
                      ))
                    : null}
            </div>
        );
    }
}
