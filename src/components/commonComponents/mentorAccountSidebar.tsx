import React from 'react';
import { FaUserCog, FaCalendarAlt, FaClock, FaCalendarCheck, FaQuestionCircle, FaUsers, FaSignOutAlt } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';

const MentorAccountSidebar: React.FC = () => {
  const location = useLocation();

  const routes = {
    'Account': '/mentor/account',
    'Schedule Time': '/mentor/schedule-time',
    'My Slot': '/mentor/my-slot',
    'Booked Slots': '/mentor/booked-slot',
    'Q&A Questions': '/mentor/qa',
    'Community Meet': '/mentor/community-meet',
    'My Community Meet': '/mentor/my-community-meet',
    'Logout': '/logout'
  };

  return (
    <aside className="fixed top-40 left-32 w-64  bg-white shadow-lg rounded-lg p-4 z-10 flex flex-col">
      <h2 className="text-xl font-bold mb-6 pb-4 border-b text-black text-center">Stack Mentor</h2>
      
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
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <Link
          to="/logout"
          className="flex items-center p-2 cursor-pointer transition-all duration-200 text-purple-500 hover:text-purple-700"
        >
          <FaSignOutAlt className="text-lg mr-3" />
          <span className="font-medium text-sm">Logout</span>
        </Link>
      </div>
    </aside>
  );
};

const sidebarItems = [
  { icon: FaUserCog, label: "Account" },
  { icon: FaCalendarAlt, label: "Schedule Time" },
  { icon: FaClock, label: "My Slot" },
  { icon: FaCalendarCheck, label: "Booked Slots" },
  { icon: FaQuestionCircle, label: "Q&A Questions" },
  { icon: FaUsers, label: "Community Meet" },
  { icon: FaUsers, label: "My Community Meet" },
];

export default MentorAccountSidebar;