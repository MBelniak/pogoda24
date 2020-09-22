import React from 'react';
import { Link } from 'react-router-dom';
import generatorImg from '../../img/poland.png';
import newImg from '../../img/add.png';
import newFact from '../../img/addFact.png';
import elistImg from '../../img/list.png';
import trafficImg from '../../img/statistics.png';
import logoutImg from '../../img/logout.png';
import filesImg from '../../img/files.png';

export class Links extends React.Component {
    render() {
        return (
            <div className="mainPageLinks">
                <div className="mainPageLinksItem centerHorizontally">
                    <a href="/generator">
                        <img src={generatorImg} />
                        <span>Generator</span>
                    </a>
                </div>
                <div className="mainPageLinksItem centerHorizontally">
                    <Link to="/writer">
                        <img src={newImg} />
                        <span>Nowy post</span>
                    </Link>
                </div>
                <div className="mainPageLinksItem centerHorizontally">
                    <Link to="/factwriter">
                        <img src={newFact} />
                        <span>Nowa ciekawostka</span>
                    </Link>
                </div>
                <div className="mainPageLinksItem centerHorizontally">
                    <Link to="/list">
                        <img src={elistImg} />
                        <span>Lista postów</span>
                    </Link>
                </div>
                <div className="mainPageLinksItem centerHorizontally">
                    <Link to="/traffic">
                        <img src={trafficImg} />
                        <span>Statystyki</span>
                    </Link>
                </div>
                <div className="mainPageLinksItem centerHorizontally">
                    <Link to="/files">
                        <img src={filesImg} />
                        <span>Przydatne mapki</span>
                    </Link>
                </div>
                <div className="mainPageLinksItem centerHorizontally">
                    <a href="/logout">
                        <img src={logoutImg} />
                        <span>Wyloguj</span>
                    </a>
                </div>
            </div>
        );
    }
}
