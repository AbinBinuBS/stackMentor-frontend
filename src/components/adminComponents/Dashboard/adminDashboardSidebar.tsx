import React from 'react';
import { FaTachometerAlt, FaUsers, FaChalkboardTeacher, FaUniversity, FaQuestionCircle, FaUsersCog, FaChartLine, FaBookOpen } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom'; 

const AdminDashboardSidebar: React.FC = () => {
  const location = useLocation();

  const routes = {
    Dashboard: '/dashboard',
    Users: '/users',
    Mentors: '/mentors',
    Institute: '/institute',
    QandA: '/qanda',
    CommunityMeet: '/community-meet',
    MeetReport: '/meet-report',
    Courses: '/courses'
  };

  return (
    <aside className="fixed top-40 left-32 w-64 h-full   p-1 space-y-3 z-10"> 
      {sidebarItems.map((item, index) => (
        <Link 
          key={index}
          to={routes[item.label as keyof typeof routes]} 
          className={`flex items-center p-3 rounded-full shadow-md cursor-pointer transition-all duration-200
            ${location.pathname === routes[item.label as keyof typeof routes] ? 'bg-gray-200 text-blue-700' : 'bg-gray-100 hover:bg-gray-200 text-black'}`}
        >
          <div className={`w-10 h-10 flex items-center justify-center rounded-full ${location.pathname === routes[item.label as keyof typeof routes] ? 'bg-blue-300 text-black' : 'bg-blue-200 text-black'} shadow-md`}>
            <item.icon className="text-lg" />
          </div>
          <span className={`ml-3 font-medium text-sm ${location.pathname === routes[item.label as keyof typeof routes] ? 'text-blue-400' : 'text-black'}`}>
            {item.label}
          </span>
        </Link>
      ))}
    </aside>
  );
};

const sidebarItems = [
  { icon: FaTachometerAlt, label: "Dashboard" },
  { icon: FaUsers, label: "Users" },
  { icon: FaChalkboardTeacher, label: "Mentors" },
  { icon: FaUniversity, label: "Institute" },
  { icon: FaQuestionCircle, label: "Q&A" },
  { icon: FaUsersCog, label: "Community Meet" },
  { icon: FaChartLine, label: "Meet Report" },
  { icon: FaBookOpen, label: "Courses" },
];

export default AdminDashboardSidebar;
