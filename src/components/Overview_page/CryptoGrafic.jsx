import { useEffect, useRef } from "react";
import { Chart } from "chart.js";

function CryptoGrafic() {
    const chartRef = useRef(null);
    let myChart = useRef(null);

    const createChart = (ctx, data) => {
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(0, 183, 255, 0.7)');
        gradient.addColorStop(1, 'rgba(0, 183, 255, 0.1)');

        return new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map((item) => item.date),
                datasets: [{
                    label: false,
                    data: data.map((item) => item.sum),
                    fill: true,
                    backgroundColor: gradient,
                    borderColor: 'rgba(0, 183, 255, 1)',
                    borderWidth: 2,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 5,
                    pointBackgroundColor: 'rgba(0, 183, 255, 1)',
                    pointHoverBackgroundColor: 'rgba(255, 255, 255, 1)',
                    pointHoverBorderWidth: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        intersect: false,
                        mode: 'nearest',
                        backgroundColor: 'rgba(0, 183, 255, 0.5)',
                        bodyColor: 'white',
                        callbacks: {
                            label: (tooltipItem) => `$${tooltipItem.raw}`,
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
                        min: 0,
                        max: 8000,
                        ticks: {
                            stepSize: 1000,
                            display: true,
                            color: '#ffffff',
                            font: { size: getDynamicFontSize() },
                            callback: function(value) {
                                return `$${value}`;
                            }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    x: {
                        grid: { display: false },
                        ticks: {
                            display: true,
                            color: '#ffffff',
                            font: { size: getDynamicFontSize() }
                        }
                    }
                },
                layout: {
                    padding: {
                        left: 20,
                        right: 20,
                        top: 20,
                        bottom: 20
                    }
                }
            }
        });
    };

    const getDynamicFontSize = () => {
        const width = window.innerWidth;
        if (width > 1200) return 14;
        if (width > 800) return 12;
        return 10;
    };

    useEffect(() => {
        const generateDataForLastNDays = (n) => {
            const data = [];
            const today = new Date();

            for (let i = 0; i < n; i++) {
                const pastDate = new Date();
                pastDate.setDate(today.getDate() - (n - i - 1));

                data.push({
                    number: i + 1,
                    date: pastDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    sum: Math.floor(Math.random() * 7800)
                });
            }
            return data;
        };

        const data = generateDataForLastNDays(7);
        const ctx = chartRef.current.getContext('2d');

        myChart.current = createChart(ctx, data);

        const handleResize = () => {
            myChart.current.options.scales.y.ticks.font.size = getDynamicFontSize();
            myChart.current.options.scales.x.ticks.font.size = getDynamicFontSize();
            myChart.current.update();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            myChart.current.destroy();
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <canvas ref={chartRef} style={{ height: '100%', width: '100%' }} />
    );
}

export default CryptoGrafic;
