import { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import PropTypes from 'prop-types';

function LineChart({ datas }) {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        const mergeObjectsByNumber = (arr) => {
            const merged = {};

            arr.forEach(item => {
                const { number, sum } = item;

                if (merged[number]) {
                    merged[number].sum += sum;
                } else {
                    merged[number] = { number, date: item.date, sum }; 
                }
            });

            return Object.values(merged);
        };

        const mergedData = mergeObjectsByNumber(datas);
        const ctx = chartRef.current.getContext('2d');

        chartInstance.current = new Chart(ctx, {
            type: 'line',
            data: {
                labels: mergedData.map((item) => item.date),
                datasets: [{
                    label: false,
                    data: mergedData.map((item) => item.sum),
                    fill: true,
                    backgroundColor: 'rgba(0, 183, 255, 0.15)',
                    borderColor: 'rgba(0, 183, 255, 1)',
                    borderWidth: window.innerWidth <= 600 ? 1.5 : 3, 
                    tension: 0.4,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        intersect: false,
                        mode: 'nearest',
                        backgroundColor: 'rgba(0, 183, 255, 0.5)',
                        bodyColor: 'white',
                        callbacks: {
                            label: (tooltipItem) => `USD: ${tooltipItem.raw} `,
                            title: () => ''
                        },
                        displayColors: false,
                        borderColor: 'rgba(0, 183, 255, 1)',
                        borderWidth: 1,
                        position: 'nearest',
                    },
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            display: false
                        },
                        grid: {
                            display: false
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            display: true
                        }
                    }
                }
            },
            plugins: [{
                beforeDatasetDraw(chart) {
                    const ctx = chart.ctx;
                    const chartArea = chart.chartArea;

                    chart.data.labels.forEach((label, index) => {
                        const meta = chart.getDatasetMeta(0);
                        const point = meta.data[index].getProps(['x', 'y'], true);
                        ctx.save();
                        ctx.beginPath();
                        ctx.moveTo(point.x, chartArea.bottom);
                        ctx.lineTo(point.x, point.y);
                        ctx.strokeStyle = 'rgba(0, 183, 255, 0.4)';
                        ctx.lineWidth = 1.4;
                        ctx.stroke();
                        ctx.restore();
                    });
                }
            }]
        });

        const handleResize = () => {
            const newBorderWidth = window.innerWidth <= 600 ? 1 : 3;
            chartInstance.current.data.datasets[0].borderWidth = newBorderWidth;
            chartInstance.current.update();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chartInstance.current.destroy();
        };
    }, [datas]);

    return (
        <canvas ref={chartRef} style={{ height: '100%', width: '100%' }} />
    );
}

LineChart.propTypes = {
    datas: PropTypes.array.isRequired 
};

export default LineChart;
