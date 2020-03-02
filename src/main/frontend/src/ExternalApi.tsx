import React from "react"

class ExternalApi extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="onetab" >
                <h3 className="hh">Wyładowania</h3>
                <img width="80%" style={{marginBottom: '20px'}} src="http://images.blitzortung.org/Images/image_b_pl.png?t=25180377" />

                <h3 className="hh">Zachmurzenie (Sat24)</h3>

                <img width="80%" style={{marginBottom: '20px'}} src="https://api.sat24.com/animated/PL/visual/1/Central%20European%20Standard%20Time/7296177" />
                <h3 className="hh">Opady (Sat24)</h3>
                <img width="80%" src="https://api.sat24.com/animated/PL/rainTMC/1/Central%20European%20Standard%20Time/847023" />
            </div>
        )
    }
}

export default ExternalApi