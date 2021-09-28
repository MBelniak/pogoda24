import React from 'react';
import Copyright from '@shared/components/Copyright';
import { TopImage } from '../components/TopImage';
import warningImg from '../../img/warning.png';
import thunderWarningImg from '../../img/thunderWarning.png';
import { Link } from 'react-router-dom';
import {Divider} from "@shared/components/Divider";

export default class Files extends React.Component {
    render() {
        return (
            <div className="main">
                <section className="container is-fluid">
                    <TopImage />
                    <div className="filesList">
                        <div className="filesListItem centerHorizontally">
                            <img src={warningImg} />
                            <span>Mapa do ostrzeżeń</span>
                        </div>
                        <div className="filesListItem centerHorizontally">
                            <img src={thunderWarningImg} />
                            <span>Mapa do ostrzeżeń burzowych</span>
                        </div>
                    </div>
                    <Divider />
                    <Link to="/write" className="button">
                        Wróć
                    </Link>
                </section>
                <Copyright fontColor={'white'}/>
            </div>
        );
    }
}
