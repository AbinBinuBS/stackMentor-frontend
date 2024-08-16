import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store'; 
import { adminLogout } from '../../redux/adminSlice'; 
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminHeader: React.FC = () => {
  const navigate = useNavigate()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const { accessToken } = useSelector((state: RootState) => state.admin);
  
  const adminName = accessToken ? JSON.parse(atob(accessToken.split('.')[1])).name : '';

  const handleLogout = () => {
    dispatch(adminLogout());
    toast.success("Logout successfully.") 
    navigate('/admin')
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-blue-100 px-5 py-1 shadow-lg z-20">
      <div className="flex justify-between items-center">
        <img src="/images/logo.png" alt="Logo" className="h-24" />
        <div className="relative">
          <span className="text-lg font-bold">{adminName}</span>
          <button
            className="ml-2"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 inline"
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
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md">
              <button
                onClick={handleLogout}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
