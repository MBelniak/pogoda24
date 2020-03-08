import React from "react";
import BarTitle from "./BarTitle";
import BarMenu from "./BarMenu";

class TopBar extends React.Component {
    constructor(props) {
        super (props)
    }

    render() {
        return(
            <div className="topBar topBarLink">
                <a href="index.html">
                    <img width="32" height="32" style={{marginBottom: '-8px'}} src="img/logoimg.jpg"></img>
                    E-Pogoda24
                </a>
                <ul>
                    <li><a href="about.html" >O Nas</a></li>
                    <li><a href="ciekawostki.html">Ciekawostki</a></li>
                    <li><a href="prognozy.html">Ostrzeżenia i Prognozy</a></li>
                </ul>
            </div>
        )
    }
}

export default TopBar