import React from 'react';
import styled from 'styled-components';

interface CopyrightProps {
    additionalRender?: () => JSX.Element;
}

interface CopyrightStyles {
    fontColor: string;
}

class DefaultCopyright extends React.Component<{className?: string} & CopyrightProps & CopyrightStyles> {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <footer className={`${this.props.className} footer`}>
                <div className="content has-text-centered">
                    <p className="fontSizeSmall copyright">Copyright &copy; 2020 by Pogoda24/7</p>
                    {this.props.additionalRender ? this.props.additionalRender() : null}
                </div>
            </footer>
        );
    }
}

const Copyright = styled(DefaultCopyright)<CopyrightStyles>`
    color: ${props => props.fontColor};
`;

export default Copyright;