import React from 'react';
import { Link } from "react-router-dom";
import generatorImg from '../public/img/generator.png';
import newImg from '../public/img/new.png';
import elistImg from '../public/img/elist.png';
import trafficImg from '../public/img/pstats.png';
import logoutImg from '../public/img/logout.png';

export class Links extends React.Component {

    render() {
        return (
            <div>
                <a href="/generator"><img className='panelIcon' src={generatorImg}/></a>
                <Link to="/writer"><img className='panelIcon' style={{marginBottom: '4px'}} src={newImg}/></Link>
                <Link to="/elist"><img className='panelIcon' src={elistImg}/></Link>
                <Link to="/traffic"><img className='panelIcon' src={trafficImg}/></Link>
                <a href="/logout"><img className='panelIcon' style={{marginBottom: '20px'}} src={logoutImg}/></a>
            </div>
        )
    }
}
