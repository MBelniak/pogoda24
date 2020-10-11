import React from 'react';
import { IconSelect } from './IconSelect';

interface CityComponentProps {
    cityName: string;
    dayOrNight: 'day' | 'night';
    temperature: string;
    onTemperatureChange: (cityName: string, temperature: string) => void;
    onIconSelected: (cityName: string, iconCode: string) => void;
    iconCode: string | null;
}

export class CityComponent extends React.Component<CityComponentProps> {
    constructor(props) {
        super(props);
        this.onIconSelected = this.onIconSelected.bind(this);
        this.onTemperatureChange = this.onTemperatureChange.bind(this);
    }

    private onTemperatureChange(e) {
        const input = e.target;
        if (input.value.length > 2) {
            input.value = input.value.substr(0, 2 + (parseInt(input.value) < 0 ? 1 : 0));
        }
        this.props.onTemperatureChange(this.props.cityName, input.value);
    }

    private onIconSelected(iconCode: string) {
        this.props.onIconSelected(this.props.cityName, iconCode);
    }

    render() {
        return (
            <div className="city">
                <p>{this.props.cityName}</p>
                <input
                    className="input"
                    type="number"
                    onChange={this.onTemperatureChange}
                    value={this.props.temperature}
                />
                <IconSelect
                    onIconSelected={this.onIconSelected}
                    dayOrNight={this.props.dayOrNight}
                    defaultIconCode={this.props.iconCode}
                />
            </div>
        );
    }
}
//
// const Canvas = styled(DefaultCanvas)`
//     box-shadow: 0 0 2px black
// `;
// export default Canvas;
