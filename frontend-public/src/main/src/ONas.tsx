import React from "react";
import { Links } from './Links';
const TopBar = require('shared24').TopBar;
const BarHolder = require('shared24').BarHolder;
const Copyright = require('shared24').Copyright;

export class ONas extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="mainFrame">
                <BarHolder />
                <TopBar render={() => <Links />} />
                <div className="mainContent">
                    <img src="img/bg.jpg" className="bgimg"/>
                    <div className="post">
                        Widzę,że zajrzałeś na naszą stronę.<br/>
                        Zostawiając łapkę w górę na naszym fanpage motywujesz nas do dalszej pracy,<br/>
                        a my w zamian za to zaoferujemy Ci prognozę pogody pewną w 100% ☺<br/>
                        Podajemy informacje pogodowe, ostrzeżenia, komunikaty i dużo dużo więcej.<br/>
                        Pracujemy nad stroną 24 godziny na dobę, 7 dni w tygodniu za darmo.<br/>
                        Ekipę tworzą: Sebastian, Patryk, Przemek, Michał, Krzysztof, Krystian oraz Wojtek.<br/>
                        To właśnie my czuwamy nad waszym bezpieczeństwem,ostrzegamy was w porę i przekazujemy wam
                        najświeższe informacje pogodowe z naszego kraju.<br/>
                        Cieszymy się,że wybrałeś/wybrałaś naszą stronę,że zaufałeś/zaufałaś nam i naszym prognozom ☺

                    </div>
                    <Copyright />
                </div>
            </div>
        )
    }
}