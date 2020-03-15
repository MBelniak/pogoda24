import React from "react";
import { PagingBar } from "./PagingBar";
import { BarHolder } from "./BarHolder";
import { TopBar } from "./TopBar";
import { PostsShort } from "./PostsShort";
import { Copyright } from "./Copyright";
import {Links} from "./Links";

export class Prognozy extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            page: 0
        }
    }

    render() {
        return (
            <div className="mainFrame">
                <BarHolder/>
                <TopBar render={() => <Links/>}/>
                <div className="mainContent">
                    <img src="img/bg.jpg" className="bgimg"/>
                    <PostsShort forecastCount={1}/>
                    <Copyright/>
                    <PagingBar/>
                </div>
            </div>
        )
    }

}