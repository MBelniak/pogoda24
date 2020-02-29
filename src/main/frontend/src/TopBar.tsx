import React from "react";
import BarTitle from "./BarTitle";
import BarMenu from "./BarMenu";

class TopBar extends React.Component {
    constructor(props) {
        super (props)
    }

    render() {
        return(
            <div className="topBar">
                <BarTitle/>
                <BarMenu/>
            </div>
        )
    }
}

export default TopBar