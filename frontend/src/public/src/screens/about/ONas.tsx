import React from 'react';
import config from '../../config/config';
import StaffItem from './StaffItem';
import './ONas.scss';
import {Divider} from "@shared/components/Divider";

export class ONas extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <section className="container is-widescreen mainContent">
                <div className="post ekipa">
                    <p className="fontSizeMedium" style={{ margin: '15px', wordWrap: 'break-word' }}>
                        Dziękujemy, że zajrzałeś na naszą stronę.
                        <br />
                        Zostawiając łapkę w górę na naszej stronie na{' '}
                        <a
                            href="https://www.facebook.com/Polska24nadobe"
                            target="_blank"
                            className="basicLink"
                            style={{ textDecoration: 'underline' }}>
                            facebooku
                        </a>{' '}
                        motywujesz nas do dalszej pracy, <br />
                        a my w zamian za to zaoferujemy Ci prognozę pogody pewną w 100 procentach.
                        <br />
                        Podajemy informacje pogodowe, ostrzeżenia, komunikaty i dużo dużo więcej. Pracujemy nad stroną
                        24 godziny na dobę, 7 dni w tygodniu za darmo.
                        <br />
                        <br />
                        Ekipę tworzą:
                    </p>
                    {config.staff.map((person, key, list) => (
                        <div key={key}>
                            <StaffItem person={person} />
                            {list.length - 1 !== key ? <Divider /> : null}
                        </div>
                    ))}
                    <p style={{ margin: '15px', wordWrap: 'break-word' }} className="fontSizeMedium">
                        To właśnie my czuwamy nad waszym bezpieczeństwem, ostrzegamy was w porę oraz przekazujemy wam
                        najświeższe informacje pogodowe z naszego kraju.
                        <br />
                        Cieszymy się, że wybrałeś/wybrałaś naszą stronę i zaufałeś/zaufałaś nam i naszym prognozom.
                    </p>
                </div>
            </section>
        );
    }
}
