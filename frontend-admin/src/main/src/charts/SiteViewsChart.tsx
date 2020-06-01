import React from 'react';
import { Line } from 'react-chartjs-2';

interface SiteViewsChartProps {
    chartData: any[][];
}

export const SiteViewsChart = (props: SiteViewsChartProps) => {
    return (
        <div
            style={{
                height: '100%'
            }}>
            <Line
                data={{
                    labels: props.chartData[0],
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
                            pointHoverBackgroundColor: '#159f9f',
                            pointHoverBorderColor: '#fff',
                            pointHoverBorderWidth: 2,
                            pointRadius: 1,
                            pointHitRadius: 20,
                            scaleStepWidth: 1,
                            data: props.chartData[1],
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
                                    color: 'rgba(40, 40, 40, 0.8)'
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
                                    color: 'rgba(40, 40, 40, 0.8)'
                                }
                            }
                        ]
                    }
                }}
            />
        </div>
    );
};
