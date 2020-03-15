import React from 'react';
import { Link } from "react-router-dom";

export class Links extends React.Component {

    render() {
        return(
            <ul>
                <li><Link to="/about">O Nas</Link></li>
                <li><Link to="/ciekawostki">Ciekawostki</Link></li>
                <li><Link to="/prognozy">Ostrzeżenia i Prognozy</Link></li>
            </ul>
        )
    }
}
