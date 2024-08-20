import React from 'react';
import { FaTachometerAlt, FaUsers, FaChalkboardTeacher, FaUniversity, FaQuestionCircle, FaUsersCog, FaChartLine, FaBookOpen } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';

const AdminDashboardSidebar: React.FC = () => {
  const location = useLocation();

  const routes = {
    Dashboard: '/admin/dashboard',
    Users: '/admin/users',
    Mentors: '/admin/mentor-list',
    Institute: '/admin/institute',
    QandA: '/admin/qanda',
    CommunityMeet: '/admin/community-meet',
    MeetReport: '/admin/meet-report',
    Courses: '/admin/courses'
  };

  return (
    <aside className="fixed top-40 left-32 w-64 bg-white shadow-lg rounded-lg p-4 z-10 flex flex-col">
      <h2 className="text-xl font-bold mb-6 pb-4 border-b text-black text-center">Admin Dashboard</h2>
      
      <div className="space-y-4 flex-grow">
        {sidebarItems.map((item, index) => {
          const path = routes[item.label as keyof typeof routes];
          return (
            <Link
              key={index}
              to={path}
              className={`flex items-center p-2 cursor-pointer transition-all duration-200
                ${location.pathname === path ? 'text-purple-700' : 'text-black hover:text-purple-900'}`}
            >              
              <item.icon className="text-lg mr-3" />
              <span className="font-medium text-sm">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
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
