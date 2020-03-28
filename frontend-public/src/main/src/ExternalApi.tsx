import React from 'react';

export class ExternalApi extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="column externalApi" >
                <h3>Wyładowania</h3>
                <img width="80%" style={{marginBottom: '20px'}} src="http://images.blitzortung.org/Images/image_b_pl.png?t=25180377" />

                <h3>Zachmurzenie (Sat24)</h3>
                <img width="80%" style={{marginBottom: '20px'}} src="https://api.sat24.com/animated/PL/visual/1/Central%20European%20Standard%20Time/7296177" />

                <h3>Opady (Sat24)</h3>
                <img width="80%" src="https://api.sat24.com/animated/PL/rainTMC/1/Central%20European%20Standard%20Time/847023" />
            </div>
        )
    }
}
