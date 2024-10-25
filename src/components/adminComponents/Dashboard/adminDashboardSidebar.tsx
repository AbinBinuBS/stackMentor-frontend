import { useState } from 'react';
import { 
  FaTachometerAlt, 
  FaUsers, 
  FaChalkboardTeacher, 
  FaQuestionCircle, 
  FaUsersCog,
  FaBars,
  FaTimes 
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

const AdminDashboardSidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const routes = {
    Dashboard: "/admin/dashboard",
    Users: "/admin/users",
    Mentors: "/admin/mentor-list",
    QA: "/admin/qa",
    "Community Meet": "/admin/community-meet",
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Toggle Button for mobile */}
      <button 
        onClick={toggleSidebar}
        className="lg:hidden fixed left-4 mt-32 z-20 p-2 rounded-lg bg-white shadow-lg"
      >
        {isOpen ? (
          <FaTimes className="text-xl text-purple-700" />
        ) : (
          <FaBars className="text-xl text-purple-700" />
        )}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed top-40 left-0 w-64 bg-white shadow-lg rounded-lg p-4 z-10 flex flex-col
        transition-transform duration-300 ease-in-out
        lg:left-32 lg:transform-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <h2 className="text-xl font-bold mb-6 pb-4 border-b text-black text-center">
          Admin Dashboard
        </h2>

        <div className="space-y-4 flex-grow">
          {sidebarItems.map((item, index) => {
            const path = routes[item.label as keyof typeof routes];
            return (
              <Link
                key={index}
                to={path}
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    setIsOpen(false);
                  }
                }}
                className={`flex items-center p-2 cursor-pointer transition-all duration-200
                  ${
                    location.pathname === path
                      ? "text-purple-700"
                      : "text-black hover:text-purple-900"
                  }`}
              >
                <item.icon className="text-lg mr-3" />
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </aside>
    </>
  );
};

const sidebarItems = [
  { icon: FaTachometerAlt, label: "Dashboard" },
  { icon: FaUsers, label: "Users" },
  { icon: FaChalkboardTeacher, label: "Mentors" },
  { icon: FaQuestionCircle, label: "QA" },
  { icon: FaUsersCog, label: "Community Meet" },
];

export default AdminDashboardSidebar;