import React from 'react';
import { Canvas } from './Canvas';
import { cityList, iconLabelH, iconLabelW, imgSrcsDay, imgSrcsNight } from './consts';
import { CityComponent } from './CityComponent';
import './Generator.scss';
import Copyright from '@shared/components/Copyright';
import { DayNightDate } from './DayNightDate';
import format from 'date-fns/format';
import { getCookie, saveCookie } from '../../helpers/getCookie';
import { showInfoModal } from '../components/modals/InfoModalWindow';
import { Link } from 'react-router-dom';

type CityData = {
    temperature: string;
    iconCode: string | null;
};

export interface CityDataMap {
    [cityKey: string]: CityData;
}

export type DayOrNight = 'day' | 'night';

interface GeneratorState {
    cityDataMap: CityDataMap;
    dayOrNight: DayOrNight;
    date: string;
}

const getInitialCityData = (): CityDataMap => {
    const dataMap: CityDataMap = {};
    cityList.forEach(city => {
        dataMap[city.name] = {
            temperature: getCookie('new_generator_' + city.name + '_temp') || '0',
            iconCode: getCookie('new_generator_' + city.name + '_type')
        };
    });
    return dataMap;
};

export class Generator extends React.Component<{}, GeneratorState> {
    private canvas;
    public context;

    constructor(props) {
        super(props);
        this.onDayNightChange = this.onDayNightChange.bind(this);
        this.onTemperatureChange = this.onTemperatureChange.bind(this);
        this.onIconSelected = this.onIconSelected.bind(this);
        this.onDateChange = this.onDateChange.bind(this);
        const savedDayOrNight = getCookie('new_generator_time');
        let dayOrNight: DayOrNight;
        dayOrNight = (savedDayOrNight as DayOrNight) || 'night';
        this.state = {
            cityDataMap: getInitialCityData(),
            dayOrNight: dayOrNight,
            date: format(new Date(), 'dd-MM-yyyy')
        };
        document.getElementById('viewport')!.outerHTML = '';
    }

    componentDidMount() {
        this.redrawMap(false, this.state.dayOrNight);
    }

    private onDayNightChange(dayOrNight: DayOrNight) {
        this.setState({ dayOrNight: dayOrNight, cityDataMap: getInitialCityData() });
        this.redrawMap(false, dayOrNight);
        saveCookie('new_generator_time', dayOrNight);
    }

    private onTemperatureChange(cityName: string, temperature: string) {
        const currentMap = this.state.cityDataMap;
        currentMap[cityName] = { ...currentMap[cityName], temperature: temperature };
        this.setState({ cityDataMap: currentMap });
        saveCookie('new_generator_' + cityName + '_temp', temperature);
    }

    private onIconSelected(cityName: string, iconCode: string) {
        const currentMap = this.state.cityDataMap;
        currentMap[cityName] = { ...currentMap[cityName], iconCode: iconCode };
        this.setState({ cityDataMap: currentMap });
        saveCookie('new_generator_' + cityName + '_type', iconCode);
    }

    private onDateChange(e) {
        this.setState({ date: e.target.value });
    }

    private redrawMap(generateIcons: boolean, dayOrNight: DayOrNight) {
        const cImg = new Image();
        cImg.src =
            dayOrNight === 'day'
                ? 'https://res.cloudinary.com/pogoda24/image/upload/w_1080,h_720/mapa-dzien_wqfijp.png'
                : 'https://res.cloudinary.com/pogoda24/image/upload/w_1080,h_720/mapa-noc_mm8tzj.png';
        cImg.onload = () => {
            this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
            this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;
            this.context.clearRect(0, 0, Canvas.canvasWidth, Canvas.canvasHeight);
            this.context.drawImage(cImg, 0, 0, Canvas.canvasWidth, Canvas.canvasHeight);

            if (generateIcons) {
                this.generateIcons();
            }
        };
    }

    private generateIcons(): void {
        window.scrollTo(0, 0);
        const iconsJson = this.state.dayOrNight === 'day' ? imgSrcsDay : imgSrcsNight;
        for (let index = 0; index < cityList.length; ++index) {
            const iconCode = this.state.cityDataMap[cityList[index].name].iconCode;
            if (iconCode === null || typeof iconsJson[iconCode] === 'undefined') {
                showInfoModal('Uzupełnij wszystkie ikonki!');
                return;
            }
        }
        cityList.forEach(city => {
            const cityIconCode = this.state.cityDataMap[city.name].iconCode!;
            const icon = new Image();
            icon.src =
                `https://res.cloudinary.com/pogoda24/image/upload/w_${iconLabelW},h_${iconLabelH}/` +
                iconsJson[cityIconCode] +
                '.png';
            icon.onload = e => {
                if (['Tatry', 'Sudety', 'Bieszczady'].indexOf(city.name) > -1) {
                    this.context.drawImage(e.target, city.x, city.y, 55, 55);
                } else {
                    this.context.drawImage(e.target, city.x, city.y, 65, 65);
                }
            };
            const temperature = this.state.cityDataMap[city.name].temperature;
            if (temperature === '' || parseInt(temperature) < 0) {
                this.context.fillStyle = '#7CE';
            } else {
                this.context.fillStyle = '#F40';
            }

            this.context.font = 'bold 33px Calibri';

            if (city.name === 'Poznań') {
                this.context.fillText(temperature + '°C', city.x + 60, city.y + 45);
                this.context.strokeText(temperature + '°C', city.x + 60, city.y + 45);
            } else if (city.name === 'Radom') {
                this.context.fillText(temperature + '°C', city.x + 10, city.y + 5);
                this.context.strokeText(temperature + '°C', city.x + 10, city.y + 5);
            } else {
                if (['Tatry', 'Sudety', 'Bieszczady'].indexOf(city.name) > -1) {
                    this.context.font = 'bold 30px Calibri';
                }
                this.context.fillText(temperature + '°C', city.x + 60, city.y + 30);
                this.context.strokeText(temperature + '°C', city.x + 60, city.y + 30);
            }
        });
        this.context.font = 'bold 45px Calibri';
        this.context.fillStyle = 'white';
        this.context.strokeStyle = 'black';
        this.context.fillText(this.state.date, 55, 620);
        this.context.strokeText(this.state.date, 55, 620);
    }

    render() {
        return (
            <div className="main">
                <section className="container is-fluid">
                    <Canvas />
                    <div className="cities">
                        <DayNightDate
                            dayOrNight={this.state.dayOrNight}
                            onDayNightChange={this.onDayNightChange}
                            onDateChange={this.onDateChange}
                            date={this.state.date}
                        />
                        <div className="break" />
                        {Object.keys(this.state.cityDataMap).map((cityName, key) => {
                            return (
                                <CityComponent
                                    temperature={this.state.cityDataMap[cityName].temperature}
                                    iconCode={this.state.cityDataMap[cityName].iconCode}
                                    key={key}
                                    cityName={cityName}
                                    dayOrNight={this.state.dayOrNight}
                                    onTemperatureChange={this.onTemperatureChange}
                                    onIconSelected={this.onIconSelected}
                                />
                            );
                        })}
                    </div>
                    <button
                        className="button"
                        style={{ width: '100%', fontSize: '1.2rem' }}
                        onClick={() => this.redrawMap(true, this.state.dayOrNight)}>
                        Generuj
                    </button>
                    <Link to="/write" className="button" style={{ width: '100%', fontSize: '1.2rem' }}>
                        Wróć
                    </Link>
                </section>
                <Copyright fontColor={'white'} />
            </div>
        );
    }
}
