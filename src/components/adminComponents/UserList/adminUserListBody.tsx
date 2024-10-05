import React, { useEffect, useState } from 'react';
import { LOCALHOST_URL } from '../../../constants/constants';
import toast from 'react-hot-toast';
import axios from 'axios';
import Swal from 'sweetalert2'; 
import apiClientAdmin from '../../../services/apiClientAdmin';

const ITEMS_PER_PAGE = 8;

interface IUserData {
  _id: string;
  name: string;
  email: string;
  isActive: boolean;
  isVerified: string; 
}

const AdminUserListBody: React.FC = () => {
  const [users, setUsers] = useState<IUserData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true); 
  
  useEffect(() => {
    fetchUserList();
  }, []);

  const fetchUserList = async () => {
    setLoading(true); 
    try {
      setLoading(true);
    
      const response = await apiClientAdmin.post(`${LOCALHOST_URL}/api/admin/getUser`, { status: "applied" });
      
      if (response.status === 200 && response.data.message === "Success") {
        setUsers(response.data.userData || []); 
      } else {
        toast.error(response.data.message || "Something went wrong, please try again later.");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Request failed, please try again later.");
      } else if (error instanceof Error) {
        toast.error(error.message || "An unexpected error occurred, please try again later.");
      }
    } finally {
      setLoading(false); 
    }
    
  };

  const totalPages = Math.ceil((users.length || 0) / ITEMS_PER_PAGE);

  const currentUsers = users.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleBlock = async (id: string, isActive: boolean) => {
    const result = await Swal.fire({
      title: isActive ? 'Are you sure you want to block this user?' : 'Are you sure you want to unblock this user?',
      text: `You are about to ${isActive ? 'block' : 'unblock'} this user.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: isActive ? 'Yes, block it!' : 'Yes, unblock it!'
    });

    if (result.isConfirmed) {
      try {
        const response = await apiClientAdmin.put(`${LOCALHOST_URL}/api/admin/blockUser`, {
          id,
          isActive,
        });
        if (
          response.status === 200 &&
          (response.data.message === 'User blocked successfully.' || response.data.message === 'User unblocked successfully.')
        ) {
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user._id === id ? { ...user, isActive: !isActive } : user
            )
          );
          toast.success(response.data.message || 'User status updated successfully.');
        } else {
          toast.error(response.data.message || 'Failed to update user status.');
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data?.message || 'Request failed, please try again later.');
        } else if (error instanceof Error) {
          toast.error(error.message || 'An unexpected error occurred, please try again later.');
        }
      }
      
      
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">User List</h2>
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        {loading ? (
          <div className="py-6 text-center text-gray-500">Loading...</div>
        ) : users.length === 0 ? (
          <div className="py-6 text-center text-gray-500">No data is present</div>
        ) : (
          <>
            <table className="w-full bg-white border-collapse">
              <thead className="bg-purple-400 text-white">
                <tr>
                  <th className="py-4 px-6 text-left">Name</th>
                  <th className="py-4 px-6 text-left">Email</th>
                  <th className="py-4 px-6 text-left">Status</th>
                  <th className="py-4 px-6 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition duration-150">
                    <td className="py-4 px-6 border-b border-gray-200">{user.name}</td>
                    <td className="py-4 px-6 border-b border-gray-200">{user.email}</td>
                    <td className="py-4 px-6 border-b border-gray-200">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          user.isActive ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                        }`}
                      >
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4 px-6 border-b border-gray-200">
                      <button
                        onClick={() => handleBlock(user._id, user.isActive)}
                        className={`px-4 py-2 rounded-md mr-2 transition duration-150 ${
                          user.isActive ? 'bg-green-800 text-white hover:bg-green-600' : 'bg-red-800 text-white hover:bg-red-600'
                        }`}
                      >
                        {user.isActive ? 'Block' : 'Unblock'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-center my-6">
              <nav className="flex items-center">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-l-md hover:bg-gray-400 disabled:opacity-50 transition duration-150"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => handlePageChange(index + 1)}
                    className={`px-4 py-2 border-t border-b ${
                      currentPage === index + 1
                        ? 'bg-purple-500 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-r-md hover:bg-gray-400 disabled:opacity-50 transition duration-150"
                >
                  Next
                </button>
              </nav>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminUserListBody;
