import React from "react";
import { Copyright } from "./Copyright";
import { PostsShort } from "./PostsShort";
import { ExternalApi } from "./ExternalApi";
import { TopBar } from "./TopBar";
import { BarHolder } from "./BarHolder";
import { Links } from "./Links";
import img from '../public/img/bg.jpg';


export class MainPage extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="mainFrame">
                <BarHolder/>
                <TopBar render={() => <Links/>}/>
                <div className="mainContent">
                    <img src={img} className="bgimg"/>
                    <ExternalApi/>
                    <PostsShort forecastCount={5}/>
                    <Copyright/>
                </div>
            </div>
        )
    }

}