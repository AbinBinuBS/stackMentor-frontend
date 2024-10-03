import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import toast from 'react-hot-toast';
import apiClientAdmin from '../../../services/apiClientAdmin';
import { LOCALHOST_URL } from '../../../constants/constants';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const formatIndianCurrency = (number: number) => {
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return formatter.format(number);
};

const AdminHeaderSideHeader: React.FC = () => {
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState<number[]>(new Array(12).fill(0));
  const [mentorCount, setMentorCount] = useState<number>(0);
  const [menteeCount, setMenteeCount] = useState<number>(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await apiClientAdmin.get(`${LOCALHOST_URL}/api/admin/getgraphData`);
      const { data } = response;
      console.log(data);

      if (data && data.data && data.data.monthlyRevenue && Array.isArray(data.data.monthlyRevenue)) {
        const revenueData = data.data.monthlyRevenue;
        setMonthlyRevenue(revenueData);
        const total = revenueData.reduce((acc: number, value: number) => acc + value, 0);
        setTotalRevenue(total);

        if (data.data.mentorCount !== undefined) {
          setMentorCount(data.data.mentorCount);
        }
        if (data.data.menteeCount !== undefined) {
          setMenteeCount(data.data.menteeCount);
        }
      } else {
        console.error("monthlyRevenue is not available in the response or is not an array.");
        setTotalRevenue(0);
        setMonthlyRevenue(new Array(12).fill(0));
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred while fetching data.");
      }
      console.error("Error fetching data:", error);
    }
  };

  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Revenue',
        data: monthlyRevenue,
        borderColor: 'rgba(29, 78, 216, 1)',
        backgroundColor: 'rgba(29, 78, 216, 0.2)',
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Hide legend to save space
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) => formatIndianCurrency(tooltipItem.raw),
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
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 6, // Limit the number of x-axis labels
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
          callback: (value: number) => formatIndianCurrency(value),
          maxTicksLimit: 5, // Limit the number of y-axis labels
        },
      },
    },
  };

  return (
    <div className="flex-1 bg-gray-100 p-6 ml-56 mt-24 mr-36 rounded-lg shadow-md overflow-hidden">
      <h2 className="text-xl font-semibold mb-4">Dashboard Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center">
          <span className="text-sm font-medium text-gray-700">Total Revenue</span>
          <span className="text-lg font-bold text-blue-600">{formatIndianCurrency(totalRevenue)}</span>
        </div>
        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center">
          <span className="text-sm font-medium text-gray-700">Mentors</span>
          <span className="text-lg font-bold text-blue-600">{mentorCount}</span>
        </div>
        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center">
          <span className="text-sm font-medium text-gray-700">Mentees</span>
          <span className="text-lg font-bold text-blue-600">{menteeCount}</span>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-2">Revenue Trends</h3>
        <div className="relative h-48 w-full"> 
          <Line data={data} options={options as any} />
        </div>
      </div>
    </div>
  );
};

export default AdminHeaderSideHeader;