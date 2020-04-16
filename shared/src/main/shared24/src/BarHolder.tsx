import React from "react";

export class BarHolder extends React.Component<{handleClick: () => void, warningShort: string}> {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="barHolder" onClick={this.props.handleClick}>
                <div className="barText">{this.props.warningShort}</div>
            </div>
        )
    }
}