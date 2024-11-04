import { useContext, useEffect, useRef, useState } from 'react';
import { Chart } from 'chart.js/auto';
import { useSelector } from 'react-redux';
import { coinsRateContext } from '../../context/CoinsRate/coinsRate';
import PropTypes from "prop-types"


function BalanceLineChart({func}) {
    const chartRef = useRef(null);

    

    const { coinsRate } = useContext(coinsRateContext);

    const [datas, setDatas] = useState([]);

    const requestedBalance = useSelector((state) => state.requestBalance.value)


    const today = new Date();
    const formattedDate = today.getMonth() + 1;
    useEffect(() => {
        if (requestedBalance[0]?.transactions) {
            setDatas([]);

            const newDates = requestedBalance[0].transactions
                .filter((item) => 
                    item.date.slice(2, 5).replace('.', '').trim() === formattedDate.toString() && item.type === 'recieved'
                )
                .map((item) => {
                    const rate = coinsRate.find(rate => rate.name === item.wallet);
                    return {
                        date: parseFloat(item.date.slice(0, 2).replace('.', '').trim()),
                        number: parseFloat(item.date.slice(0, 2).replace('.', '').trim()),
                        sum: rate ? parseFloat((item.sum * rate.rate).toFixed(2)) : 0
                    };
                });

            newDates.sort((a, b) => a.date - b.date);

            if (newDates.length > 0) {
                setDatas(newDates);
            }
        }
    }, [requestedBalance, formattedDate, coinsRate]);

    useEffect(() => {
        if(datas.length > 0) {
            func(datas)
        }
    }, [datas, func])

    
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

        const myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: mergedData.map((item) => item.date),
                datasets: [{
                    label: false,
                    data: mergedData.map((item) => item.sum),
                    fill: true,
                    backgroundColor: 'rgba(0, 183, 255, 0.25)',
                    borderColor: 'rgba(0, 183, 255, 1)',
                    borderWidth: 3,
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
                            display: true
                        },
                        grid: {
                            display: true,
                            color: 'rgba(0, 183, 255, 0.15)'
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
                        ctx.lineTo(point.x, point.y); // Линия до графика
                        ctx.strokeStyle = 'rgba(0, 183, 255, 0.4)'; // Цвет линии
                        ctx.lineWidth = 1.3;
                        ctx.stroke();
                        ctx.restore();
                    });
                }
            }]
        });

        return () => {
            myChart.destroy();
        };
    }, [datas]);

    return (
        <canvas ref={chartRef} style={{ height: '100%', width: '100%' }} />
    );
}


BalanceLineChart.propTypes ={

    func: PropTypes.func.isRequired
}




export default BalanceLineChart;
