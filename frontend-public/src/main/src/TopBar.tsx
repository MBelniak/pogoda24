import React from 'react';
import { Link } from 'react-router-dom';
import img from './img/logoimg.jpg';


export class TopBar extends React.Component {

    componentDidMount() {
       const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

        if ($navbarBurgers.length > 0) {
            $navbarBurgers.forEach( el => {
                el.addEventListener('click', () => {
                    const target = el.dataset.target;
                    const $target = document.getElementById(target);

                    el.classList.toggle('is-active');
                    $target?.classList.toggle('is-active');
                });
            });
        }
    }

    render() {
        return(
            <nav className="topBar navbar" role="navigation" aria-label="main navigation">
                <div className="navbar-brand">
                    <Link to="/" className="navbar-item" >
                        <img width="30" height="35" src={img}/>
                        <span>E-Pogoda24</span>
                    </Link>
                    <a role="button" className="navbar-burger burger" aria-label="menu" aria-expanded="false"
                       data-target="pogodaMenu">
                        <span aria-hidden="true"/>
                        <span aria-hidden="true"/>
                        <span aria-hidden="true"/>
                    </a>
                </div>
                <div id="pogodaMenu" className="navbar-menu">
                    <div className="navbar-end">
                        <Link to="/prognozy" className="navbar-item">Prognozy</Link>
                        <Link to="/ostrzezenia" className="navbar-item">Ostrzeżenia</Link>
                        <Link to="/ciekawostki" className="navbar-item">Ciekawostki</Link>
                        <Link to="/about" className="navbar-item">O Nas</Link>
                    </div>
                </div>
            </nav>
        )
    }
}
