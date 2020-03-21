import React from "react";
import img from '../public/img/bg.jpg';


export class MainPage extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="mainFrame">
                <div className="mainContent">
                    <img src={img} className="bgimg"/>
                </div>
            </div>
        )
    }

}