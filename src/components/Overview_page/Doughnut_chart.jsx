import { useEffect, useRef, useContext } from 'react';
import { Chart } from 'chart.js/auto';
import { userBalanceContext } from '../../context/userBalance/userBalanceContext';

const DoughnutChart = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const { userBalance } = useContext(userBalanceContext);

  useEffect(() => {
    if (userBalance.updatedInfo) {
      const ctx = chartRef.current.getContext('2d');

      chartInstance.current = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: userBalance.updatedInfo.map((item) => item.name),
          datasets: [
            {
              label: 'USD',
              data: userBalance.updatedInfo.map((item) => item.balance),
              backgroundColor: [
                'rgba(1, 143, 255, 0.6)',
                'rgba(245, 251, 254, 0.6)',
                'rgba(0, 128, 85, 0.6)',
                'rgba(250, 214, 121, 0.6)',
              ],
              hoverBackgroundColor: [
                'rgba(1, 143, 255, 1)',
                'rgba(245, 251, 254, 1)',
                'rgba(0, 128, 85, 1)',
                'rgba(250, 214, 121, 1)',
              ],
              borderColor: 'rgba(0, 0, 0, 1)', 
              borderWidth: window.innerWidth <= 600 ? 0.5 : 1, 
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
            title: { display: false },
          },
        },
      });

      const handleResize = () => {
        const newBorderWidth = window.innerWidth <= 600 ? 0.5 : 1;
        chartInstance.current.data.datasets[0].borderWidth = newBorderWidth;
        chartInstance.current.update();
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        chartInstance.current.destroy();
      };
    }
  }, [userBalance.updatedInfo]);

  return <canvas ref={chartRef} width="400" height="400"></canvas>;
};

export default DoughnutChart;
