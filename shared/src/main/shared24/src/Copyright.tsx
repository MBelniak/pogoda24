import React from 'react';

export class Copyright extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <footer className="footer">
                <div className="content has-text-centered copyright">
                    <p>Copyright &copy; 2020 by Pogoda24/7</p>
                </div>
            </footer>
        );
    }
}
