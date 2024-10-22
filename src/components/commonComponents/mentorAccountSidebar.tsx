import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  FaUserCog,
  FaCalendarAlt,
  FaClock,
  FaCalendarCheck,
  FaQuestionCircle,
  FaUsers,
  FaSignOutAlt,
  FaBars,
  FaStar,
} from "react-icons/fa";
import { useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { mentorLogout } from "../../redux/mentorSlice";

const MentorAccountSidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();

  const routes = {
    Account: "/mentor/account",
    "Schedule Time": "/mentor/schedule-time",
    "My Slot": "/mentor/my-slot",
    "Booked Slots": "/mentor/booked-slot",
    "Q&A Questions": "/mentor/qa",
    "Community Meet": "/mentor/community-meet",
    "My Community Meet": "/mentor/my-community-meet",
    "My Ratings": "/mentor/my-ratings",
  };

  const handleLogout = () => {
    toast.success("Logout successfully.");
    dispatch(mentorLogout());
  };

  const sidebarItems = [
    { icon: FaUserCog, label: "Account" },
    { icon: FaCalendarAlt, label: "Schedule Time" },
    { icon: FaClock, label: "My Slot" },
    { icon: FaCalendarCheck, label: "Booked Slots" },
    { icon: FaQuestionCircle, label: "Q&A Questions" },
    { icon: FaUsers, label: "Community Meet" },
    { icon: FaUsers, label: "My Community Meet" },
    { icon: FaStar, label: "My Ratings" },
  ];

  useEffect(() => {
    const handleResize = () => {
      const isSmall = window.innerWidth < 1280; 
      setIsSmallScreen(isSmall);
      setIsExpanded(!isSmall);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      {isSmallScreen && !isExpanded && (
        <button
          onClick={toggleSidebar}
          className="fixed top-36 left-4 z-20 p-2 bg-white rounded-lg shadow-lg xl:hidden"
        >
          <FaBars className="text-xl text-black" />
        </button>
      )}

      <aside
        className={`fixed top-36 transition-all duration-300 ease-in-out bg-white shadow-lg rounded-lg z-10 flex flex-col
          ${isExpanded ? "w-64" : "w-16"}
          ${
            isSmallScreen
              ? isExpanded
                ? "left-0"
                : "-left-16"
              : "left-32 xl:left-32"
          }
        `}
      >
        <div className="p-4 flex items-center justify-between border-b">
          {isExpanded ? (
            <>
              <h2 className="text-xl font-bold text-black">Stack Mentor</h2>
              {isSmallScreen && (
                <button
                  onClick={toggleSidebar}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FaBars className="text-xl text-black" />
                </button>
              )}
            </>
          ) : (
            <FaBars 
              className="text-xl text-black mx-auto cursor-pointer" 
              onClick={toggleSidebar}
            />
          )}
        </div>

        <div className="space-y-2 flex-grow p-4">
          {sidebarItems.map((item, index) => {
            const path = routes[item.label as keyof typeof routes];
            return (
              <Link
                key={index}
                to={path}
                className={`flex items-center p-2 cursor-pointer transition-all duration-200
                  ${
                    location.pathname === path
                      ? "text-purple-700"
                      : "text-black hover:text-purple-900"
                  }`}
              >
                <item.icon
                  className={`text-lg ${isExpanded ? "mr-3" : "mx-auto"}`}
                />
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
            <FaSignOutAlt
              className={`text-lg ${isExpanded ? "mr-3" : "mx-auto"}`}
            />
            {isExpanded && (
              <span className="font-medium text-sm" onClick={handleLogout}>
                Logout
              </span>
            )}
          </Link>
        </div>
      </aside>
    </>
  );
};

export default MentorAccountSidebar;