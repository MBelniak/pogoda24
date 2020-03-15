import React from "react";
import { Link } from "react-router-dom";

interface TopBarProps {
    render(): JSX.Element;
}

export class TopBar extends React.Component<TopBarProps, {}> {
    constructor(props) {
        super (props)
    }

    render() {
        return(
            <div className="topBar topBarLink">
                <div>
                    <Link to="/">
                        <img width="32" height="32" style={{marginBottom: '-8px'}} src="img/logoimg.jpg"></img>
                        E-Pogoda24
                    </Link>

                    {this.props.render()}
                </div>
            </div>
        )
    }
}