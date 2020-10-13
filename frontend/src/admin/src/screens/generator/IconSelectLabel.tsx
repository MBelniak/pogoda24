import React from 'react';
import './Generator.scss';
import { iconLabelH, iconLabelW } from './consts';
import { Image, Transformation } from 'cloudinary-react';

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
                    <Image
                        publicId={this.props.iconCodesJson[this.props.iconCode] + '.png'}
                        format="png"
                        quality="auto">
                        <Transformation width={iconLabelW} height={iconLabelH} />
                    </Image>
                </div>
                <div className="iconSelectItemSpanDiv">
                    <i style={{ font: 'italic', fontSize: '1rem' }}>({this.props.iconCode})</i>
                </div>
            </div>
        );
    }
}
