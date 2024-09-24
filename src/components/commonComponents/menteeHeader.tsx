import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { menteeLogout } from '../../redux/menteeSlice';

const MenteeHeader: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    dispatch(menteeLogout());
    toast.success('Logged out successfully.');
    navigate('/login');
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
        className="bg-white shadow-xl transition-all"
        style={{
          transitionDuration: '2s',
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
          padding: isScrolled ? '0.75rem' : '1.5rem', 
          width: isScrolled ? '100%' : '90%',
          borderRadius: isScrolled ? '0' : '1rem',
        }}
      >
        <div className="flex items-center justify-between">
          <img src="/images/logo.png" alt="Logo" className="h-16" />
          <nav className="flex items-center space-x-8">
            <button
              onClick={() => navigate('/')}
              className="text-black font-semibold"
            >
              Home
            </button>
            <button
              onClick={() => navigate('/courses')}
              className="text-black font-semibold"
            >
              Courses
            </button>
            <button
              onClick={() => navigate('/mentorList')}
              className="text-black font-semibold"
            >
              Mentor
            </button>
            <button
              onClick={() => navigate('/qa')}
              className="text-black font-semibold"
            >
              Q&A
            </button>
            <button
              onClick={() => navigate('/MySlot')}
              className="text-black font-semibold"
            >
              My Slots
            </button>
            <div className="relative">
              <button
                className="text-black font-semibold"
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
                <div className="absolute right-0 mt-2 bg-white border border-gray-300 rounded shadow-md">
                  <button
                    onClick={handleLogout}
                    className="block px-4 py-2 text-sm text-black hover:bg-gray-100 w-full text-left"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>
    </div>
  );
};

export default MenteeHeader;
