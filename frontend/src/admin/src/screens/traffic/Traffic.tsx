import React from 'react';
import { fetchApi } from '../../helpers/fetchHelper';
import startOfDay from 'date-fns/startOfDay';
import isSameDay from 'date-fns/isSameDay';
import subDays from 'date-fns/subDays';
import parseISO from 'date-fns/parseISO';
import { SiteViewsChart } from '../../charts/SiteViewsChart';
import { TopImage } from '../components/TopImage';
import { Copyright } from '../components/Copyright';
import { Link } from 'react-router-dom';

const daysBackInputConstraint = (text: string): boolean => {
    return parseInt(text) >= 0 && parseInt(text) <= 9999;
};

interface GatheredData {
    allPostsViews: number;
    allSiteViews: number;
    postsCount: number;
    averageViewsPerPost: number;
}

interface TrafficDTO {
    id: number;
    date: string;
    views: number;
}

interface TrafficState {
    gatheredData?: GatheredData | null;
    siteViewsChartData?: any[][];
}

export default class Traffic extends React.Component<{}, TrafficState> {
    private abortController: AbortController;
    private daysBackInputRef;
    private siteViewsDaysBack: number;

    state: TrafficState = {
        gatheredData: undefined,
        siteViewsChartData: undefined
    };

    constructor(props) {
        super(props);
        this.abortController = new AbortController();
        this.siteViewsDaysBack = 30;
        this.daysBackInputRef = React.createRef();
        this.handleDaysBackChange = this.handleDaysBackChange.bind(this);
    }

    componentDidMount() {
        this.fetchGatheredData();
        this.fetchSiteViews();
    }

    private fetchGatheredData() {
        fetchApi('api/views/gathered', {
            signal: this.abortController.signal
        })
            .then(response => {
                if (response && response.ok) {
                    response
                        .json()
                        .then((gatheredData: GatheredData) => {
                            this.setState({
                                gatheredData: gatheredData ? gatheredData : null
                            });
                        })
                        .catch(error => {
                            console.log(error);
                        });
                } else {
                    this.setState({ gatheredData: null });
                }
            })
            .catch(error => {
                this.setState({ gatheredData: null });
                console.log(error);
            });
    }

    private fetchSiteViews() {
        this.setState({ siteViewsChartData: undefined });
        fetchApi('api/views/site?daysBack=' + this.siteViewsDaysBack, {
            signal: this.abortController.signal
        })
            .then(response => {
                if (response && response.ok) {
                    response
                        .json()
                        .then((siteViewsData: TrafficDTO[]) => {
                            this.setState({
                                siteViewsChartData: this.siteViewsDataToChartData(siteViewsData)
                            });
                        })
                        .catch(error => {
                            console.log(error);
                        });
                } else {
                    this.setState({ siteViewsChartData: [] });
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    private siteViewsDataToChartData(siteViewsData: TrafficDTO[]) {
        const today = startOfDay(new Date());
        if (!siteViewsData) {
            siteViewsData = [];
        }
        const chartData: any[][] = [[], []];
        for (let chartLabel = 0, dataIndex = 0; chartLabel <= this.siteViewsDaysBack; ++chartLabel) {
            const chartLabelDate = subDays(today, this.siteViewsDaysBack - chartLabel);
            if (
                dataIndex < siteViewsData.length &&
                isSameDay(chartLabelDate, parseISO(siteViewsData[dataIndex].date))
            ) {
                chartData[0].push(chartLabelDate);
                chartData[1].push(siteViewsData[dataIndex].views);
                ++dataIndex;
            } else {
                chartData[0].push(chartLabelDate);
                chartData[1].push(0);
            }
        }
        return chartData;
    }

    private handleDaysBackChange() {
        if (
            this.daysBackInputRef.current.value &&
            this.validateField(this.daysBackInputRef.current, daysBackInputConstraint)
        ) {
            this.siteViewsDaysBack = this.daysBackInputRef.current.value;
            this.fetchSiteViews();
        }
    }

    private validateField(htmlInput, additionalConstraint?: (value) => boolean): boolean {
        if (htmlInput.value && (additionalConstraint ? !additionalConstraint(htmlInput.value) : false)) {
            htmlInput.classList.add('is-danger');
            return false;
        } else {
            htmlInput.classList.remove('is-danger');
            return true;
        }
    }

    componentWillUnmount() {
        this.abortController.abort();
    }

    render() {
        return (
            <div className="main">
                <section className="container is-fluid">
                    <TopImage />
                    <div className="charts">
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
                                    onKeyUp={e => this.validateField(e.target, daysBackInputConstraint)}
                                    onBlur={e => this.validateField(e.target, daysBackInputConstraint)}
                                />
                                <button className="button" onClick={this.handleDaysBackChange}>
                                    Ustaw
                                </button>
                            </div>
                            <div className="column centerVertically centerHorizontally">
                                {this.state.siteViewsChartData ? (
                                    <SiteViewsChart chartData={this.state.siteViewsChartData} />
                                ) : (
                                    <span>Trwa ładowanie danych...</span>
                                )}
                            </div>
                        </div>
                        <div className="is-divider" />
                        <div>
                            <p>
                                Całkowita liczba odwiedzin strony:{' '}
                                {typeof this.state.gatheredData === 'undefined'
                                    ? null
                                    : this.state.gatheredData === null
                                    ? '--'
                                    : this.state.gatheredData.allSiteViews}
                            </p>
                            <p>
                                Całkowita liczba wyświetleń postów:{' '}
                                {typeof this.state.gatheredData === 'undefined'
                                    ? null
                                    : this.state.gatheredData === null
                                    ? '--'
                                    : this.state.gatheredData.allPostsViews}
                            </p>
                            <p>
                                Całkowita liczba postów:{' '}
                                {typeof this.state.gatheredData === 'undefined'
                                    ? null
                                    : this.state.gatheredData === null
                                    ? '--'
                                    : this.state.gatheredData.postsCount}
                            </p>
                            <p>
                                Średnia liczba wyświetleń wszystkich postów:{' '}
                                {typeof this.state.gatheredData === 'undefined'
                                    ? null
                                    : this.state.gatheredData === null
                                    ? '--'
                                    : Number(this.state.gatheredData.averageViewsPerPost.toFixed(3))}
                            </p>
                        </div>
                    </div>
                    <div className="is-divider"/>
                    <Link to="/write" className="button">
                        Wróć
                    </Link>
                </section>
                <Copyright />
            </div>
        );
    }
}
