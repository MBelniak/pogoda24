import React from "react"
import ExternalApi from "./ExternalApi";
import PostsShort from "./PostsShort";
import Copyright from "./Copyright";

class MainContent extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="mainContent">
                <img src="img/bg.jpg" className="bgimg"/>
                <ExternalApi/>
                <PostsShort/>
                <Copyright/>
            </div>
        )
    }
}

export default MainContent