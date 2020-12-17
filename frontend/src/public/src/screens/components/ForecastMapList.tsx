import React from 'react';
import { Image, Transformation } from 'cloudinary-react';
import '../../sass/main.scss';
import './ForecastMapList.scss';
import { closeModal, showModal } from './ModalWindow';

export class ForecastMapList extends React.Component<{
    imagesPublicIds: string[];
}> {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const body = document.getElementsByTagName('body')[0];
        body.addEventListener('keydown', event => {
            if (event.key === 'Escape') {
                closeModal();
            }
        });

        if (this.props.imagesPublicIds.length > 0) {
            const images = document.querySelectorAll('.forecastMapImage img');
            images.forEach(img => {
                img.addEventListener('click', event => {
                    event.stopPropagation();
                    showModal(
                        <div
                            style={{
                                textAlign: 'center',
                                maxWidth: '100%',
                                maxHeight: '100%'
                            }}
                            onClick={() => closeModal()}>
                            <img src={img.getAttribute('src')!!} />
                        </div>
                    );
                    const clickListener = () => closeModal();

                    body.addEventListener('click', clickListener);
                    body.addEventListener('click', () => body.removeEventListener('click', clickListener));
                });
            });
        }
    }

    render() {
        return (
            <div className="columns is-centered is-multiline">
                {this.props.imagesPublicIds.map((imagePublicId, i) => (
                    <div className="forecastMapImage column is-half" key={i}>
                        <Image publicId={imagePublicId} format="png" quality="auto">
                            <Transformation crop="fill" gravity="faces" />
                        </Image>
                    </div>
                ))}
            </div>
        );
    }
}
