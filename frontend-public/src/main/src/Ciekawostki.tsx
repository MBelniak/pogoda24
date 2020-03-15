import React from "react";
import { Copyright } from "./Copyright";
import { TopBar } from "./TopBar";
import { BarHolder } from "./BarHolder";

export class Ciekawostki extends React.Component{

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="mainFrame">
                <BarHolder/>
                <TopBar/>
                <div className="mainContent">
                    <img src="img/bg.jpg" className="bgimg"/>
                    <Copyright/>
                </div>
            </div>
        )
    }
}