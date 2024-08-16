import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store'; 
import { menteeLogout } from '../../redux/menteeSlice';
import toast from 'react-hot-toast';


const MenteeHeader: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectIsLoggedIn = (state: RootState) => Boolean(state.mentee.accessToken);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const loadHome = (): void => {
    navigate('/');
  };
  const loadLogin = (): void => {
    navigate('/login');
  };

  const handleLogout = (): void => {
    dispatch(menteeLogout()); 
    toast.success('Logout successfully...')
    navigate('/login'); 
  };

  return (
    <div className="flex flex-col sm:flex-row items-center w-full px-4 border-b-2 border-cyan-100">
      <img src="/images/logo.png" alt="Logo" className="w-32 sm:w-48 h-auto mb-2 sm:mb-0" />
      <div className="flex flex-wrap sm:flex-nowrap items-center ml-auto space-x-2 sm:space-x-4">
        <button
          className="p-1 sm:p-2 text-xs sm:text-sm"
          onClick={loadHome}
        >
          Home
        </button>
        <button className="p-1 sm:p-2 text-xs sm:text-sm">
          Courses
        </button>
        <button className="p-1 sm:p-2 text-xs sm:text-sm">
          Mentor
        </button>
        <button className="p-1 sm:p-2 text-xs sm:text-sm">
          Q&A
        </button>
        <button className="p-1 sm:p-2 text-xs sm:text-sm">
          Account
        </button>
        {isLoggedIn ? (
          <button
            className="p-1 sm:p-2 text-xs sm:text-sm"
            onClick={handleLogout}
          >
            Logout
          </button>
        ) : (
          <button
            className="p-1 sm:p-2 text-xs sm:text-sm"
            onClick={loadLogin}
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
};

export default MenteeHeader;
