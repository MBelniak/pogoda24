    import React from 'react';
import img from './img/bg.jpg';

export class TopImage extends React.Component {
    render() {
        return (
            <div>
                <img src={img} className="bgimg" />
            </div>
        );
    }
}
