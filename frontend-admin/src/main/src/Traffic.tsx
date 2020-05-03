import React from 'react';
import { fetchApi } from './helpers/fetchHelper';
import { SiteViewsChart } from './charts/SiteViewsChart';
const Copyright = require('shared24').Copyright;
const TopImage = require('shared24').TopImage;

interface GatheredData {
    allPostsViews: number;
    allSiteViews: number;
    postsCount: number;
    averageViewsPerPost: number;
}

interface TrafficState {
    gatheredData: GatheredData | null;
    loading: boolean;
}

export default class Traffic extends React.Component<{}, TrafficState> {
    private abortController: AbortController;

    state: TrafficState = {
        gatheredData: null,
        loading: true
    };

    constructor(props) {
        super(props);
        this.abortController = new AbortController();
    }

    componentDidMount() {
        this.fetchGatheredData();
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
                                gatheredData: gatheredData,
                                loading: false
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

    render() {
        return (
            <div className="main">
                <section className="container fluid">
                    <TopImage />
                    <div className="charts">
                        <SiteViewsChart />
                        <div className="is-divider" />
                        <div>
                            <p>
                                Całkowita liczba odwiedzin strony:{' '}
                                {this.state.loading
                                    ? null
                                    : this.state.gatheredData === null
                                    ? '--'
                                    : this.state.gatheredData.allSiteViews}
                            </p>
                            <p>
                                Całkowita liczba wyświetleń postów:{' '}
                                {this.state.loading
                                    ? null
                                    : this.state.gatheredData === null
                                    ? '--'
                                    : this.state.gatheredData.allPostsViews}
                            </p>
                            <p>
                                Całkowita liczba postów:{' '}
                                {this.state.loading
                                    ? null
                                    : this.state.gatheredData === null
                                    ? '--'
                                    : this.state.gatheredData.postsCount}
                            </p>
                            <p>
                                Średnia liczba wyświetleń wszystkich postów:{' '}
                                {this.state.loading
                                    ? null
                                    : this.state.gatheredData === null
                                    ? '--'
                                    : this.state.gatheredData
                                          .averageViewsPerPost}
                            </p>
                        </div>
                    </div>
                </section>
                <Copyright />
            </div>
        );
    }
}
