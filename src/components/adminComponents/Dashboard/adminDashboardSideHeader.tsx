import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const AdminHeaderSideHeader: React.FC = () => {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Revenue',
        data: [4000, 4500, 3000, 5000, 6000, 5500, 6500],
        borderColor: 'rgba(29, 78, 216, 1)',
        backgroundColor: 'rgba(29, 78, 216, 0.2)',
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) => `$${tooltipItem.raw.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        type: 'category' as const,
        grid: {
          display: false,
        },
        ticks: {
          color: 'rgba(0, 0, 0, 0.6)', 
        },
      },
      y: {
        type: 'linear' as const,
        beginAtZero: true,
        grid: {
          borderDash: [5, 5],
        },
        ticks: {
          color: 'rgba(0, 0, 0, 0.6)',
        },
      },
    },
  };

  return (
    <div className="flex-1 bg-gray-100 p-8 ml-56 mt-24 mr-36 rounded-lg shadow-md overflow-hidden">
      <h2 className="text-2xl font-semibold mb-6">Dashboard Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center">
          <span className="text-lg font-medium text-gray-700">Total Revenue</span>
          <span className="text-2xl font-bold text-blue-600">$12,345</span>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center">
          <span className="text-lg font-medium text-gray-700">Mentors</span>
          <span className="text-2xl font-bold text-blue-600">50</span>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center">
          <span className="text-lg font-medium text-gray-700">Institutes</span>
          <span className="text-2xl font-bold text-blue-600">20</span>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center">
          <span className="text-lg font-medium text-gray-700">Mentees</span>
          <span className="text-2xl font-bold text-blue-600">150</span>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-xl font-semibold mb-4">Revenue Trends</h3>
        <div className="relative h-80"> 
          <Line data={data} options={options as any} />
        </div>
      </div>
    </div>
  );
};

export default AdminHeaderSideHeader;