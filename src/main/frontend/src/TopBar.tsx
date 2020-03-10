import React from "react";
import { Link } from "react-router-dom";

export class TopBar extends React.Component {
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

                    <ul>
                        <li><Link to="/about">O Nas</Link></li>
                        <li><Link to="/ciekawostki">Ciekawostki</Link></li>
                        <li><Link to="/prognozy">Ostrzeżenia i Prognozy</Link></li>
                    </ul>
                </div>
            </div>
        )
    }
}