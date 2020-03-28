import React from 'react';
import img from './img/bg.jpg';

export class TopImage extends React.Component {

    render () {
        return (
            <div className="topImage">
                <img src={img} className="bgimg"/>
            </div>
        )
    }
}