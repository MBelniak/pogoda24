import React from 'react';
import { Link } from 'react-router-dom';
import img from '../public/img/logoimg.jpg';


export class Links extends React.Component {

    render() {
        return(
            <div>
                <Link to="/">
                    <img width="32" height="32" style={{marginBottom: '-8px'}} src={img}/>
                    E-Pogoda24
                </Link>
                <ul>
                    <li><Link to="/about">O Nas</Link></li>
                    <li><Link to="/ciekawostki">Ciekawostki</Link></li>
                    <li><Link to="/prognozy">Ostrzeżenia i Prognozy</Link></li>
                </ul>
            </div>
        )
    }
}
