import React from "react";
import { Copyright } from "./Copyright";
import { TopBar } from "./TopBar";
import { BarHolder } from "./BarHolder";
import {Links} from "./Links";

export class Ciekawostki extends React.Component{

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="mainFrame">
                <BarHolder/>
                <TopBar render={() => <Links/>}/>
                <div className="mainContent">
                    <img src="img/bg.jpg" className="bgimg"/>
                    <Copyright/>
                </div>
            </div>
        )
    }
}