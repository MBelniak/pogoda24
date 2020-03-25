import React from "react";

export class BarHolder extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="barHolder">
                <div className="barText">Brak ostrzeżeń</div>
            </div>
        )
    }
}