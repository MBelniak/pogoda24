import React from 'react';
const styles = require('./css/main.css');

interface TopBarProps {
    render(): JSX.Element;
}

class TopBar extends React.Component<TopBarProps, {}> {
    constructor(props) {
        super (props)
    }

    render() {
        return(
            <div className="topBar topBarLink">
                <div>
                    {this.props.render()}
                </div>
            </div>
        )
    }
}

class Copyright extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="copyright">
                Copyright &copy; 2020 by Pogoda24/7
            </div>
        )
    }
}


class BarHolder extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="barHolder">
                <div className="barText">Brak ostrzeżeń</div>
            </div>
        )
    }
}

export { BarHolder, Copyright, TopBar };
