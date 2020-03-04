import React from "react";

class BarMenu extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="barMenu">
                <ul className="barMenuUl">
                    <li><a href="about.html">O Nas</a></li>
                    <li><a href="ciekawostki.html">Ciekawostki</a></li>
                    <li><a href="prognozy.html">Ostrzeżenia i Prognozy</a></li>
                </ul>
            </div>
        )
    }
}

export default BarMenu