import React from 'react';
import { DayOrNight } from './Generator';

interface DayNightDateProps {
    innerRef: any;
    dayOrNight: DayOrNight;
    onDayNightChange: (dayOrNight: DayOrNight) => void;
    date: string;
    onDateChange: (e) => void;
}

export class DayNightDate extends React.Component<DayNightDateProps, { date: string }> {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="dateAndDaySelectDiv">
                <input
                    type="radio"
                    id="day"
                    checked={this.props.dayOrNight === 'day'}
                    onChange={() => this.props.onDayNightChange('day')}
                />
                <label htmlFor="day"> Dzień</label>
                <br />
                <input
                    type="radio"
                    id="night"
                    checked={this.props.dayOrNight === 'night'}
                    onChange={() => this.props.onDayNightChange('night')}
                />
                <label htmlFor="night"> Noc</label>
                <input
                    type="text"
                    placeholder="Data"
                    className="input"
                    value={this.props.date}
                    onChange={this.props.onDateChange}
                    ref={this.props.innerRef}
                />
            </div>
        );
    }
}

export default React.forwardRef<HTMLInputElement, DayNightDateProps>((props, ref) => (
    <DayNightDate innerRef={ref} {...props} />
));
