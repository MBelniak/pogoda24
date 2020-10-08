import React from 'react';
import Canvas from './Canvas';
import { cityList, imgSrcsDay, imgSrcsNight } from './consts';
import { CityComponent } from './CityComponent';
import './Generator.scss';
import Copyright from '@shared/components/Copyright';
import { DayNightDate } from './DayNightDate';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import { validateField } from '../../helpers/ValidateField';
import { getCookie, saveCookie } from '../../helpers/getCookie';

type CityData = {
    temperature: number;
    iconSrc: string | null;
};

interface CityDataMap {
    [cityMap: string]: CityData;
}

export type DayOrNight = 'day' | 'night';

interface GeneratorState {
    cityDataMap: CityDataMap;
    dayOrNight: DayOrNight;
    date: string;
}

function isValidDate(d) {
    return d instanceof Date && !isNaN(d.getTime());
}

const getInitialCityData = (): CityDataMap => {
    const dataMap: CityDataMap = {};
    cityList.forEach(
        city =>
            (dataMap[city.displayName] = {
                temperature: parseInt(getCookie('generator_' + city.displayName + '_temp') || '0'),
                iconSrc: getCookie('generator_' + city.displayName + '_type')
            })
    );
    return dataMap;
};

export class Generator extends React.Component<{}, GeneratorState> {
    private dateRef = React.createRef();
    constructor(props) {
        super(props);
        this.onDayNightChange = this.onDayNightChange.bind(this);
        this.onTemperatureChange = this.onTemperatureChange.bind(this);
        this.onIconSelected = this.onIconSelected.bind(this);
        this.onDateChange = this.onDateChange.bind(this);
        this.onReady = this.onReady.bind(this);
        const savedDayOrNight = getCookie('generator_time');
        let dayOrNight: DayOrNight;
        dayOrNight = (savedDayOrNight as DayOrNight) || 'night';
        this.state = {
            cityDataMap: getInitialCityData(),
            dayOrNight: dayOrNight,
            date: format(new Date(), 'dd-MM-yyyy')
        };
    }

    private onDayNightChange(dayOrNight: DayOrNight) {
        this.setState({ dayOrNight: dayOrNight });
        this.clearImgSrcs();
    }

    private clearImgSrcs() {
        const map: CityDataMap = {};
        Object.keys(this.state.cityDataMap).forEach(city => {
            map[city] = { ...this.state.cityDataMap[city], iconSrc: null };
        });
        this.setState({ cityDataMap: map });
    }

    private onTemperatureChange(cityName: string, temperature: number) {
        const currentMap = this.state.cityDataMap;
        currentMap[cityName] = { ...currentMap[cityName], temperature: temperature };
        this.setState({ cityDataMap: currentMap });
        saveCookie('new_generator_' + cityName + '_temp', temperature);
    }

    private onIconSelected(cityName: string, iconSrc: string) {
        const currentMap = this.state.cityDataMap;
        currentMap[cityName] = { ...currentMap[cityName], iconSrc: iconSrc };
        this.setState({ cityDataMap: currentMap });
        saveCookie('new_generator_' + cityName + '_type', iconSrc);
    }

    private onDateChange(e) {
        this.setState({ date: e.target.value });
    }

    private onReady() {
        validateField(this.dateRef.current, value => isValidDate(parse(value, 'dd-MM-yyyy', new Date())));
    }

    render() {
        return (
            <div className="main">
                <section className="container is-fluid">
                    <Canvas />
                    <DayNightDate
                        innerRef={this.dateRef}
                        dayOrNight={this.state.dayOrNight}
                        onDayNightChange={this.onDayNightChange}
                        onDateChange={this.onDateChange}
                        date={this.state.date}
                    />
                    <div className="cities">
                        {Object.keys(this.state.cityDataMap).map((cityName, key) => {
                            return (
                                <CityComponent
                                    temperature={this.state.cityDataMap[cityName].temperature}
                                    iconSrc={this.state.cityDataMap[cityName].iconSrc}
                                    key={key}
                                    cityName={cityName}
                                    dayOrNight={this.state.dayOrNight}
                                    onTemperatureChange={this.onTemperatureChange}
                                    onIconSelected={this.onIconSelected}
                                />
                            );
                        })}
                    </div>
                    <button className="button" style={{ width: '100%', fontSize: '1.2rem' }} onClick={this.onReady}>
                        Gotowe
                    </button>
                </section>
                <Copyright fontColor={'white'} />
            </div>
        );
    }
}
