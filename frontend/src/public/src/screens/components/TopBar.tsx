import React from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../../img/logo-wHalo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt } from '@fortawesome/free-solid-svg-icons';
import { faCloudSun } from '@fortawesome/free-solid-svg-icons';
import { faNewspaper } from '@fortawesome/free-solid-svg-icons';
import { faSmileBeam } from '@fortawesome/free-solid-svg-icons';
import '../../sass/main.scss';

export class TopBar extends React.Component {
    componentDidMount() {
        const $navbarBurger = document.querySelectorAll('.navbar-burger')[0];
        const $target = document.getElementById(($navbarBurger as HTMLElement).dataset.target!);

        $navbarBurger.addEventListener('click', () => {
            $navbarBurger.classList.toggle('is-active');
            $target?.classList.toggle('is-active');
        });

        const links = Array.prototype.slice.call(document.getElementsByClassName('navbar-item'), 0);
        links.forEach(link => {
            link.addEventListener('focus', () => link.blur());
            link.addEventListener('click', () => {
                $target?.classList.remove('is-active');
                $navbarBurger.classList.remove('is-active');
            });
        });
    }

    render() {
        return (
            <nav className="topBar navbar topBarFontSizeMedium" role="navigation" aria-label="main navigation">
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
                            <FontAwesomeIcon icon={faCloudSun} />
                            Prognozy
                        </Link>
                        <Link to="/ostrzezenia" className="navbar-item">
                            <FontAwesomeIcon icon={faBolt} />
                            Ostrzeżenia
                        </Link>
                        <Link to="/ciekawostki" className="navbar-item">
                            <FontAwesomeIcon icon={faNewspaper} />
                            Ciekawostki
                        </Link>
                        <Link to="/onas" className="navbar-item last">
                            <FontAwesomeIcon icon={faSmileBeam} />O Nas
                        </Link>
                    </div>
                </div>
            </nav>
        );
    }
}
