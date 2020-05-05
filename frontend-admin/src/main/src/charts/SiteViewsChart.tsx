import React from 'react';
import { Line } from 'react-chartjs-2';
import { fetchApi } from '../helpers/fetchHelper';
import * as fns from 'date-fns';
import { PostType } from '../Post';

interface TrafficDTO {
    id: number;
    date: string;
    views: number;
}

interface SiteViewsChartState {
    siteViewsChartData: any[][] | null;
    daysBack: number;
    loading: boolean;
}

const daysBackInputConstraint = (text: string): boolean => {
    return parseInt(text) >= 0 && parseInt(text) <= 9999;
};

export class SiteViewsChart extends React.Component<{}, SiteViewsChartState> {
    private abortController: AbortController;
    private daysBackInputRef;

    state: SiteViewsChartState = {
        siteViewsChartData: null,
        daysBack: 31,
        loading: true
    };

    constructor(props) {
        super(props);
        this.abortController = new AbortController();
        this.daysBackInputRef = React.createRef();
        this.handleDaysBackChange = this.handleDaysBackChange.bind(this);
    }

    private validateField(
        htmlInput,
        additionalConstraint?: (value) => boolean
    ): boolean {
        if (
            htmlInput.value &&
            (additionalConstraint
                ? !additionalConstraint(htmlInput.value)
                : false)
        ) {
            htmlInput.classList.add('is-danger');
            return false;
        } else {
            htmlInput.classList.remove('is-danger');
            return true;
        }
    }

    componentDidMount() {
        this.fetchSiteViews();
    }

    private fetchSiteViews() {
        fetchApi('api/views/site?daysBack=' + this.state.daysBack, {
            signal: this.abortController.signal
        })
            .then(response => {
                if (response && response.ok) {
                    response
                        .json()
                        .then((siteViewsData: TrafficDTO[]) => {
                            this.setState({
                                siteViewsChartData: this.siteViewsDataToChartData(
                                    siteViewsData
                                ),
                                loading: false
                            });
                        })
                        .catch(error => {
                            console.log(error);
                        });
                } else {
                    this.setState({ siteViewsChartData: null });
                    this.setState({ loading: false });
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    private siteViewsDataToChartData(siteViewsData: TrafficDTO[]) {
        const today = fns.startOfDay(new Date());
        if (!siteViewsData) {
            siteViewsData = [];
        }
        const chartData: any[][] = [[], []];
        for (let i = 0; i < this.state.daysBack; ++i) {
            const dateThen = fns.subDays(today, this.state.daysBack - i - 1);
            if (
                //There are no views registered for that date
                siteViewsData.length > i &&
                fns.isSameDay(fns.parseISO(siteViewsData[i].date), dateThen)
            ) {
                chartData[0].push(dateThen);
                chartData[1].push(siteViewsData[i].views);
            } else {
                chartData[0].push(dateThen);
                chartData[1].push(0);
            }
        }
        console.log(chartData);
        return chartData;
    }

    private handleDaysBackChange() {
        if (this.daysBackInputRef.current.value &&
            this.validateField(this.daysBackInputRef.current, daysBackInputConstraint)
        ) {
            this.setState({ daysBack: this.daysBackInputRef.current.value });
            this.fetchSiteViews();
        }
    }

    componentWillUnmount() {
        this.abortController.abort();
    }

    render() {
        return (
            <div className="columns">
                <div className="column is-4" style={{ marginTop: '1rem' }}>
                    <label htmlFor="daysBackInput">Liczba dni wstecz: </label>
                    <input
                        ref={this.daysBackInputRef}
                        id="daysBackInput"
                        type="number"
                        className="input"
                        max={9999}
                        min={0}
                        placeholder="(0-9999)"
                        onKeyUp={e =>
                            this.validateField(
                                e.target,
                                daysBackInputConstraint
                            )
                        }
                        onBlur={e =>
                            this.validateField(
                                e.target,
                                daysBackInputConstraint
                            )
                        }
                    />
                    <button
                        className="button"
                        onClick={this.handleDaysBackChange}>
                        Ustaw
                    </button>
                </div>
                <div className="column">
                    <div
                        style={{
                            height: '100%'
                        }}>
                        {!this.state.loading ? (
                            this.state.siteViewsChartData === null ? (
                                <p>Nie udało się wczytać danych</p>
                            ) : (
                                <Line
                                    data={{
                                        labels: this.state
                                            .siteViewsChartData[0],
                                        datasets: [
                                            {
                                                label: 'Liczba wyświetleń',
                                                fill: false,
                                                lineTension: 0.1,
                                                fontColor: '#fff',
                                                backgroundColor: '#fff',
                                                borderColor: '#159f9f',
                                                pointBorderColor: '#159f9f',
                                                pointBackgroundColor: '#fff',
                                                pointBorderWidth: 5,
                                                pointHoverRadius: 5,
                                                pointHoverBackgroundColor:
                                                    '#159f9f',
                                                pointHoverBorderColor: '#fff',
                                                pointHoverBorderWidth: 2,
                                                pointRadius: 1,
                                                pointHitRadius: 20,
                                                scaleStepWidth: 1,
                                                data: this.state
                                                    .siteViewsChartData[1],
                                                xAxisID: 'x-axis',
                                                yAxisID: 'y-axis'
                                            }
                                        ]
                                    }}
                                    options={{
                                        legend: {
                                            display: true,
                                            labels: {
                                                fontColor: '#fff',
                                                fontSize: 14,
                                                fontFamily: 'Helvetica'
                                            }
                                        },
                                        title: {
                                            display: true,
                                            text: 'Liczba wyświetleń strony',
                                            fontColor: '#fff',
                                            fontSize: 28,
                                            fontFamily: 'Helvetica'
                                        },
                                        scales: {
                                            xAxes: [
                                                {
                                                    id: 'x-axis',
                                                    type: 'time',
                                                    time: {
                                                        unit: 'day'
                                                    },
                                                    ticks: {
                                                        fontColor: '#fff',
                                                        fontSize: 14,
                                                        fontFamily: 'Helvetica'
                                                    },
                                                    gridLines: {
                                                        lineWidth: 1,
                                                        color:
                                                            'rgba(40, 40, 40, 0.8)'
                                                    }
                                                }
                                            ],
                                            yAxes: [
                                                {
                                                    id: 'y-axis',
                                                    type: 'linear',
                                                    ticks: {
                                                        min: 0,
                                                        fontColor: '#fff',
                                                        fontSize: 14,
                                                        fontFamily: 'Helvetica'
                                                    },
                                                    gridLines: {
                                                        lineWidth: 1,
                                                        color:
                                                            'rgba(40, 40, 40, 0.8)'
                                                    }
                                                }
                                            ]
                                        }
                                    }}
                                />
                            )
                        ) : null}
                    </div>
                </div>
            </div>
        );
    }
}
