import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
// import { RootState } from '../../redux/store'; 
import { adminLogout } from '../../redux/adminSlice'; 
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminHeader: React.FC = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dispatch = useDispatch();
  // const { accessToken } = useSelector((state: RootState) => state.admin);

  // const adminName = accessToken ? JSON.parse(atob(accessToken.split('.')[1])).name : '';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    toast.success("Logout successfully.");
    dispatch(adminLogout());
    navigate('/admin');
  };

  return (
    <div
      className={`fixed top-0 left-0 w-full flex justify-center z-20 transition-all`}
      style={{
        transitionDuration: '2s',
        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
        padding: isScrolled ? '0' : '0.5rem', 
      }}
    >
      <header
        className="bg-white shadow-2xl transition-all"
        style={{
          transitionDuration: '2s',
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
          padding: isScrolled ? '0.75rem' : '1.5rem', 
          width: isScrolled ? '100%' : '90%',
          borderRadius: isScrolled ? '0' : '1rem',
        }}
      >
        <div className="flex items-center justify-between">
          <img src="/images/commonLogo.png" alt="Logo" className="h-16" />
          <nav className="flex items-center space-x-8">
            <button
              onClick={() => navigate('/admin/users')}
              className="text-purple-600 hover:text-purple-800 font-semibold"
            >
              Users
            </button>
            <button
              onClick={() => navigate('/admin/mentor-list')}
              className="text-purple-600 hover:text-purple-800 font-semibold"
            >
              Mentors
            </button>
            <div className="relative">
              <button
                className="text-purple-600 hover:text-purple-800 font-semibold"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                More
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 inline-block ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {isDropdownOpen && (
                <button
                  onClick={handleLogout}
                  className="absolute right-0 mt-2 px-4 py-2 text-sm text-purple-600 hover:text-purple-800 font-semibold bg-white rounded shadow-md"
                >
                  Logout
                </button>
              )}
            </div>
          </nav>
        </div>
      </header>
    </div>
  );
};

export default AdminHeader;
