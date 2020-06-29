import React from 'react';

interface CopyrightProps {
    additionalRender?: () => JSX.Element;
}

export class Copyright extends React.Component<CopyrightProps> {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <footer className="footer">
                <div className="content has-text-centered">
                    <p className="fontSizeSmall copyright">Copyright &copy; 2020 by Pogoda24/7</p>
                    {this.props.additionalRender ? this.props.additionalRender() : null}
                </div>
            </footer>
        );
    }
}
