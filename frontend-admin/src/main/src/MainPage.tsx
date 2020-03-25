import React from 'react';
import img from '../public/img/bg.jpg';
import { Links } from "./Links";


export class MainPage extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="mainFrame">
                <div className="mainContent">
                    <img src={img} className="bgimg"/>
                    <Links />
                </div>
            </div>
        )
    }

}