import React from 'react';
import { DayOrNight } from './Generator';

interface DayNightDateProps {
    dayOrNight: DayOrNight;
    onDayNightChange: (dayOrNight: DayOrNight) => void;
    date: string;
    onDateChange: (e) => void;
}

interface DayNightDateState {
    date: string;
}

export class DayNightDate extends React.Component<DayNightDateProps, DayNightDateState> {
    constructor(props) {
        super(props);
        this.state = {
            date: this.props.date
        };
    }

    private onDayNightChange(e) {
        if (e.target.checked) {
            this.props.onDayNightChange(e.target.id);
        }
    }

    render() {
        return (
            <div className="dateAndDaySelectDiv">
                <input
                    type="radio"
                    id="day"
                    checked={this.props.dayOrNight === 'day'}
                    onChange={e => this.onDayNightChange(e)}
                />
                <label htmlFor="day"> Dzień</label>
                <br />
                <input
                    type="radio"
                    id="night"
                    checked={this.props.dayOrNight === 'night'}
                    onChange={e => this.onDayNightChange(e)}
                />
                <label htmlFor="night"> Noc</label>
                <input
                    type="text"
                    placeholder="Data"
                    className="input"
                    value={this.props.date}
                    onChange={this.props.onDateChange}
                />
            </div>
        );
    }
}
