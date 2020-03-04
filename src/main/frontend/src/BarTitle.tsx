import React from "react";

class BarTitle extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div>
            <a className="mainLink" href="index.html">
                <img width="32" height="32" style={{marginBottom: '-8px'}} src="img/logoimg.jpg">
            </img> E-Pogoda24</a>
            </div>
        )
    }
}

export default BarTitle