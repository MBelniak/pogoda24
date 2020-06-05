import React from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../img/logo-wHalo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBolt } from '@fortawesome/free-solid-svg-icons'
import { faCloudSun } from '@fortawesome/free-solid-svg-icons'
import { faNewspaper } from '@fortawesome/free-solid-svg-icons'
import { faSmileBeam } from '@fortawesome/free-solid-svg-icons'
import '../sass/main.scss';

export class TopBar extends React.Component {
    componentDidMount() {
        const $navbarBurgers = Array.prototype.slice.call(
            document.querySelectorAll('.navbar-burger'),
            0
        );

        if ($navbarBurgers.length > 0) {
            $navbarBurgers.forEach(el => {
                el.addEventListener('click', () => {
                    const target = el.dataset.target;
                    const $target = document.getElementById(target);

                    el.classList.toggle('is-active');
                    $target?.classList.toggle('is-active');
                });
            });
        }
        const links = Array.prototype.slice.call(
            document.getElementsByClassName('navbar-item'),
            0
        );
        links.forEach(link =>
            link.addEventListener('focus', () => link.blur())
        );
    }

    render() {
        return (
            <nav
                className="topBar navbar topBarFontSizeMedium"
                role="navigation"
                aria-label="main navigation">
                <div className="navbar-brand">
                    <Link to="/" className="navbar-item">
                        <img src={logoImg} className="logoImg" />
                        <div style={{ marginLeft: '5px' }}>E-Pogoda24/7</div>
                    </Link>
                    <a
                        role="button"
                        className="navbar-burger burger"
                        aria-label="menu"
                        aria-expanded="false"
                        data-target="pogodaMenu">
                        <span aria-hidden="true" />
                        <span aria-hidden="true" />
                        <span aria-hidden="true" />
                    </a>
                </div>
                <div id="pogodaMenu" className="navbar-menu">
                    <div className="navbar-end">
                        <Link to="/prognozy" className="navbar-item">
                            Prognozy<FontAwesomeIcon icon={faCloudSun}/>
                        </Link>
                        <Link to="/ostrzezenia" className="navbar-item">
                            Ostrzeżenia<FontAwesomeIcon icon={faBolt}/>
                        </Link>
                        <Link to="/ciekawostki" className="navbar-item">
                            Ciekawostki<FontAwesomeIcon icon={faNewspaper}/>
                        </Link>
                        <Link to="/about" className="navbar-item last">
                            O Nas<FontAwesomeIcon icon={faSmileBeam}/>
                        </Link>
                    </div>
                </div>
            </nav>
        );
    }
}
