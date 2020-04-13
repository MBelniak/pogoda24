import React from "react";
import { TopBar } from './TopBar';
import config from './config/config';
import StaffItem from "./StaffItem";
const BarHolder = require('shared24').BarHolder;
const Copyright = require('shared24').Copyright;

export class ONas extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="main">
                <BarHolder />
                <TopBar />
                <section className="container fluid mainContentEkipa">
                    <div className="post ekipa">
                        <p style={{margin: "15px", wordWrap: "break-word"}}>Dziękujemy, że zajrzałeś na naszą stronę.<br/>
                            Zostawiając łapkę w górę na naszej stronie na <a
                                href="https://www.facebook.com/Polska24nadobe"
                                target="_blank"
                                className="basicLink">facebooku</a> motywujesz nas do dalszej pracy, <br/>
                            a my w zamian za to zaoferujemy Ci prognozę pogody pewną w 100 procentach.<br/>
                        Podajemy informacje pogodowe, ostrzeżenia, komunikaty i dużo dużo więcej.
                        Pracujemy nad stroną 24 godziny na dobę, 7 dni w tygodniu za darmo.<br/><br/>
                        Ekipę tworzą:</p>
                        {config.staff.map(((person, i) => {
                            return <StaffItem person={person} key={i}/>
                        }))}
                        <p style={{margin: "15px", wordWrap: "break-word"}}>
                        To właśnie my czuwamy nad waszym bezpieczeństwem, ostrzegamy was w porę oraz przekazujemy wam
                        najświeższe informacje pogodowe z naszego kraju.<br/>
                        Cieszymy się, że wybrałeś/wybrałaś naszą stronę i zaufałeś/zaufałaś nam i naszym prognozom.
                        </p>
                    </div>
                </section>
                <Copyright />
            </div>
        )
    }
}