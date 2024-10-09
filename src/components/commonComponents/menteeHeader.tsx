import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { menteeLogout } from '../../redux/menteeSlice';
import { StoreData } from '../../interfaces/ImenteeInferfaces';
import { Menu } from 'lucide-react';

const MenteeHeader: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const accessToken = useSelector((state: StoreData) => state.mentee.accessToken);

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

  const openWallet = () => {
    navigate('/wallet');
  };

  const NavItem = ({ text, onClick }: { text: string; onClick: () => void }) => (
    <button onClick={onClick} className="text-black font-semibold py-2 px-4 hover:bg-gray-100 w-full text-left">
      {text}
    </button>
  );

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
        className="bg-white shadow-xl transition-all w-full md:w-[90%]"
        style={{
          transitionDuration: '2s',
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
          padding: isScrolled ? '0.75rem' : '1.5rem',
          borderRadius: isScrolled ? '0' : '1rem',
        }}
      >
        <div className="flex items-center justify-between">
          <img src="/images/logo.png" alt="Logo" className="h-16" />
          <nav className="hidden md:flex items-center space-x-8">
            <NavItem text="Home" onClick={() => navigate('/')} />
            <NavItem text="Mentor" onClick={() => navigate('/mentorList')} />
            <NavItem text="Q&A" onClick={() => navigate('/questionsAsked')} />
            <NavItem text="My Slots" onClick={() => navigate('/MySlot')} />
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
                  <NavItem text="Wallet" onClick={openWallet} />
                  {accessToken ? (
                    <NavItem text="Logout" onClick={handleLogout} />
                  ) : (
                    <NavItem text="Login" onClick={() => navigate('/selectionLogin')} />
                  )}
                </div>
              )}
            </div>
          </nav>
          <button
            className="md:hidden text-black"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu size={24} />
          </button>
        </div>
        {isMenuOpen && (
          <div className="md:hidden mt-4">
            <NavItem text="Home" onClick={() => navigate('/')} />
            <NavItem text="Mentor" onClick={() => navigate('/mentorList')} />
            <NavItem text="Q&A" onClick={() => navigate('/questionsAsked')} />
            <NavItem text="My Slots" onClick={() => navigate('/MySlot')} />
            <NavItem text="Wallet" onClick={openWallet} />
            {accessToken ? (
              <NavItem text="Logout" onClick={handleLogout} />
            ) : (
              <NavItem text="Login" onClick={() => navigate('/selectionLogin')} />
            )}
          </div>
        )}
      </header>
    </div>
  );
};

export default MenteeHeader;