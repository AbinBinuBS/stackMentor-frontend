import React, { useEffect, useState } from 'react';
import { LOCALHOST_URL } from '../../../constants/constants';
import toast from 'react-hot-toast';
import axios from 'axios';
import Swal from 'sweetalert2'; 
import { useNavigate } from 'react-router-dom';

const ITEMS_PER_PAGE = 8;

interface IMentorData {
  _id: string;
  name: string;
  email: string;
  isActive: boolean;
  isVerified: string; 
}

const AdminMentorListBody: React.FC = () => {
  const [mentors, setMentors] = useState<IMentorData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate()
  useEffect(() => {
    fetchMentorList();
  }, []);

  const fetchMentorList = async () => {
    setLoading(true); 
    try {
      const response = await axios.post(`${LOCALHOST_URL}/api/admin/getMentor`, { status: "applied" });
      if (response.data.message === "Success") {
        setMentors(response.data.mentorData || []);
      } else {
        toast.error(response.data.message || "Something went wrong, please try again later.");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || "Something went wrong, please try again later.");
      }
    } finally {
      setLoading(false); 
    }
  };

  const totalPages = Math.ceil((mentors.length || 0) / ITEMS_PER_PAGE);

  const currentMentors = mentors.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleBlock = async (id: string, isActive: boolean) => {
    const result = await Swal.fire({
      title: isActive ? 'Are you sure you want to block this mentor?' : 'Are you sure you want to unblock this mentor?',
      text: `You are about to ${isActive ? 'block' : 'unblock'} this mentor.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: isActive ? 'Yes, block it!' : 'Yes, unblock it!'
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.put(`${LOCALHOST_URL}/api/admin/blockMentor`, {
          id,
          isActive
        });

        if (response.data.message === 'Mentor blocked successfully.' || response.data.message === 'Mentor unblocked successfully.') {
          setMentors((prevMentors) =>
            prevMentors.map((mentor) =>
              mentor._id === id ? { ...mentor, isActive: !isActive } : mentor
            )
          );
          toast.success(response.data.message || 'Mentor status updated successfully.');
        } else {
          toast.error(response.data.message || 'Failed to update mentor status.');
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message || 'Unknown error occurred, please try again later.');
        }
      }
    }
  };

  const handleView = (id: string) => {
    navigate(`/admin/mentor-details/${id}`);
  };  

  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value);
  };

  const handleApplyFilter = async () => {
    if (!selectedStatus) {
      toast.error("Please select a status first.");
      return;
    }
    setLoading(true); 
    try {
      const response = await axios.post(`${LOCALHOST_URL}/api/admin/getMentor`, { status: selectedStatus });
      if (response.data.message === "Success") {
        setMentors(response.data.mentorData || []);
        toast.success("Mentors filtered successfully.");
      } else {
        toast.error(response.data.message || "Failed to filter mentors.");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || "Failed to apply filter. Please try again.");
      }
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Mentor List</h2>
        <div className="flex items-center">
          <select
            value={selectedStatus}
            onChange={handleStatusChange}
            className="mr-2 p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select Status</option>
            <option value="applied">Pending</option>
            <option value="beginner">Beginner</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
          </select>
          <button
            onClick={handleApplyFilter}
            className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition duration-150"
          >
            Apply Filter
          </button>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        {loading ? (
          <div className="py-6 text-center text-gray-500">Loading...</div>
        ) : mentors.length === 0 ? (
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
                {currentMentors.map((mentor) => (
                  <tr key={mentor._id} className="hover:bg-gray-50 transition duration-150">
                    <td className="py-4 px-6 border-b border-gray-200">{mentor.name}</td>
                    <td className="py-4 px-6 border-b border-gray-200">{mentor.email}</td>
                    <td className="py-4 px-6 border-b border-gray-200">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          mentor.isActive ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                        }`}
                      >
                        {mentor.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4 px-6 border-b border-gray-200">
                      <button
                        onClick={() => handleBlock(mentor._id, mentor.isActive)}
                        className={`px-4 py-2 rounded-md mr-2 transition duration-150 ${
                          mentor.isActive ? 'bg-green-800 text-white hover:bg-green-600' : 'bg-red-800 text-white hover:bg-red-600'
                        }`}
                      >
                        {mentor.isActive ? 'Block' : 'Unblock'}
                      </button>
                      {mentor.isVerified !== 'beginner' && (
                        <button
                          onClick={() => handleView(mentor._id)}
                          className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition duration-150"
                        >
                          View
                        </button>
                      )}
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

export default AdminMentorListBody;
