import React from "react";


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
                    {this.props.render()}
                </div>
            </div>
        )
    }
}
