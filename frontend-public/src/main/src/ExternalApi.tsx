import React from 'react';

export class ExternalApi extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <div className="externalApiItem">
                    <h3>Wyładowania (blitzortung)</h3>
                    <a href="http://pl.blitzortung.org/live_lightning_maps.php?map=15" target="_blank">
                        <img src="http://images.blitzortung.org/Images/image_b_pl.png?t=25180377" alt="Wyładowania" />
                    </a>
                </div>
                <div className="is-divider" />
                <div className="externalApiItem">
                    <h3>Ostrzeżenia (PŁB)</h3>
                    <a href="http://burze.dzis.net/?page=mapa_ostrzezen" target="_blank">
                        <img src="http://burze.dzis.net/img/zagrozenia.gif" alt="Mapa ostrzeżeń dla Polski" />
                    </a>
                </div>
                <div className="is-divider" />
                <div className="externalApiItem">
                    <h3>Zachmurzenie (Sat24)</h3>
                    <a href="https://pl.sat24.com/pl/pl/visual" target="_blank">
                        <img
                            src="https://api.sat24.com/animated/PL/visual/1/Central%20European%20Standard%20Time/7296177"
                            alt="Zachmurzenie"
                        />
                    </a>
                </div>
                <div className="is-divider" />
                <div className="externalApiItem">
                    <h3>Opady (Sat24)</h3>
                    <a href="https://pl.sat24.com/pl/pl/rainTMC" target="_blank">
                        <img
                            src="https://api.sat24.com/animated/PL/rainTMC/1/Central%20European%20Standard%20Time/847023"
                            alt="Opady"
                        />
                    </a>
                </div>
            </>
        );
    }
}
