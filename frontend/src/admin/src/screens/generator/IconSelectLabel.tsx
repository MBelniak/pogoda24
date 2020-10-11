import React from 'react';
import './Generator.scss';

interface IconSelectLabelProps {
    iconCodesJson: {};
    iconCode: string;
}

export class IconSelectLabel extends React.Component<IconSelectLabelProps> {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="iconSelectItem">
                <div className="iconSelectItemImgDiv">
                    <img
                        className="selectImage"
                        src={this.props.iconCodesJson[this.props.iconCode]}
                        height="50px"
                        width="50px"
                    />
                </div>
                <div className="iconSelectItemSpanDiv">
                    <i style={{ font: 'italic', fontSize: '1rem' }}>({this.props.iconCode})</i>
                </div>
            </div>
        );
    }
}
