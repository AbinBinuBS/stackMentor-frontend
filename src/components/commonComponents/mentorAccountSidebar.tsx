import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FaUserCog, FaCalendarAlt, FaClock, FaCalendarCheck, FaQuestionCircle, FaUsers, FaSignOutAlt, FaBars } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { mentorLogout } from '../../redux/mentorSlice';

const MentorAccountSidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const location = useLocation();
  const dispatch = useDispatch()
  const routes = {
    'Account': '/mentor/account',
    'Schedule Time': '/mentor/schedule-time',
    'My Slot': '/mentor/my-slot',
    'Booked Slots': '/mentor/booked-slot',
    'Q&A Questions': '/mentor/qa',
    'Community Meet': '/mentor/community-meet',
    'My Community Meet': '/mentor/my-community-meet',
  };

  const handleLogout = () => {
    toast.success("Logout successfully.");
    dispatch(mentorLogout())
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

  useEffect(() => {
    const handleResize = () => {
      setIsExpanded(window.innerWidth > 768);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <aside 
      className={`fixed top-40 left-32 bg-white shadow-lg rounded-lg z-10 flex flex-col transition-all duration-300 ease-in-out
        ${isExpanded ? 'w-64' : 'w-16'}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => window.innerWidth <= 768 && setIsExpanded(false)}
    >
      <div className="p-4 flex items-center justify-between border-b">
        {isExpanded ? (
          <h2 className="text-xl font-bold text-black">Stack Mentor</h2>
        ) : (
          <FaBars className="text-xl text-black mx-auto" />
        )}
      </div>

      <div className="space-y-4 flex-grow p-4">
        {sidebarItems.map((item, index) => {
          const path = routes[item.label as keyof typeof routes];
          return (
            <Link
              key={index}
              to={path}
              className={`flex items-center p-2 cursor-pointer transition-all duration-200
                ${location.pathname === path ? 'text-purple-700' : 'text-black hover:text-purple-900'}`}
            >
              <item.icon className={`text-lg ${isExpanded ? 'mr-3' : 'mx-auto'}`} />
              {isExpanded && (
                <span className="font-medium text-sm whitespace-nowrap">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      <div className="mt-6 p-4 border-t border-gray-200">
        <Link
          to="/mentor"
          className="flex items-center p-2 cursor-pointer transition-all duration-200 text-purple-500 hover:text-purple-700"
        >
          <FaSignOutAlt className={`text-lg ${isExpanded ? 'mr-3' : 'mx-auto'}`} />
          {isExpanded && <span className="font-medium text-sm" onClick={handleLogout}>Logout</span>}
        </Link>
      </div>
    </aside>
  );
};

export default MentorAccountSidebar;