import React from 'react';
import img from './img/logo_bg.jpg';

export class TopImage extends React.Component {

    render () {
        return (
            <div className="topImage">
                <img src={img} className="bgimg"/>
            </div>
        )
    }
}