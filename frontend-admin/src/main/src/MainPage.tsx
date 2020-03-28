import React from 'react';
import img from './img/bg.jpg';
import { Links } from "./Links";


export class MainPage extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <section>
                <div className="container fluid">
                    <img src={img} className="bgimg"/>
                    <Links />
                </div>
            </section>
        )
    }

}