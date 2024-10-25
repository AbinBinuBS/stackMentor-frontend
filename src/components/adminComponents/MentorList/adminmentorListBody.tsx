import React, { ChangeEvent, useEffect, useState } from "react";
import { LOCALHOST_URL } from "../../../constants/constants";
import toast from "react-hot-toast";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import apiClientAdmin from "../../../services/apiClientAdmin";
import { IMentorData } from "../../../interfaces/IAdminInterface";
import { Spinner } from "react-bootstrap";

const ITEMS_PER_PAGE = 4;

const AdminMentorListBody: React.FC = () => {
  const [mentors, setMentors] = useState<IMentorData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchMentorList();
  }, [currentPage, selectedStatus, searchQuery]);

  const fetchMentorList = async () => {
    setLoading(true);
    try {
      const response = await apiClientAdmin.post(
        `${LOCALHOST_URL}/api/admin/getMentor`,
        {
          status: selectedStatus === "all" ? "" : selectedStatus,
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          search: searchQuery,
        }
      );

      if (response.data.message === "Success") {
        setMentors(response.data.mentorData || []);
        setTotalPages(response.data.totalPages || 0);
      } else {
        toast.error(
          response.data.message || "Something went wrong, please try again later."
        );
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ||
          "Request failed, please try again later."
        );
      } else if (error instanceof Error) {
        toast.error(
          error.message || "An unexpected error occurred, please try again later."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBlock = async (id: string, isActive: boolean) => {
    const result = await Swal.fire({
      title: isActive
        ? "Are you sure you want to block this mentor?"
        : "Are you sure you want to unblock this mentor?",
      text: `You are about to ${isActive ? "block" : "unblock"} this mentor.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: isActive ? "Yes, block it!" : "Yes, unblock it!",
    });

    if (result.isConfirmed) {
      try {
        const response = await apiClientAdmin.put(
          `${LOCALHOST_URL}/api/admin/blockMentor`,
          { id, isActive }
        );

        if (
          response.status === 200 &&
          (response.data.message === "Mentor blocked successfully." ||
            response.data.message === "Mentor unblocked successfully.")
        ) {
          setMentors((prevMentors) =>
            prevMentors.map((mentor) =>
              mentor._id === id ? { ...mentor, isActive: !isActive } : mentor
            )
          );
          toast.success(
            response.data.message || "Mentor status updated successfully."
          );
        } else {
          toast.error(response.data.message || "Failed to update mentor status.");
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(
            error.response?.data?.message ||
            "Request failed, please try again later."
          );
        } else if (error instanceof Error) {
          toast.error(
            error.message || "An unexpected error occurred, please try again later."
          );
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
    setCurrentPage(1);
  };

  const handleApplyFilter = async () => {
    setCurrentPage(1);
    await fetchMentorList();
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentPage(1);
    setSearchQuery(e.target.value);
  };

  const renderMobileCard = (mentor: IMentorData) => (
    <div key={mentor._id} className="bg-white p-4 rounded-lg shadow-md mb-4 md:hidden">
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="font-semibold">{mentor.name}</div>
            <div className="text-sm text-gray-600">{mentor.email}</div>
          </div>
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${
              mentor.isActive
                ? "bg-green-200 text-green-800"
                : "bg-red-200 text-red-800"
            }`}
          >
            {mentor.isActive ? "Active" : "Inactive"}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleBlock(mentor._id, mentor.isActive)}
            className={`flex-1 py-2 px-3 rounded-md text-white text-sm ${
              mentor.isActive
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600"
            } transition duration-150`}
          >
            {mentor.isActive ? "Block" : "Unblock"}
          </button>
          {mentor.isVerified !== "beginner" && (
            <button
              onClick={() => handleView(mentor._id)}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-md text-sm transition duration-150"
            >
              View Details
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
      {/* Header and Filters */}
      <div className="space-y-4 mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          Mentor List
        </h2>
        
        <div className="flex flex-col space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <select
              value={selectedStatus}
              onChange={handleStatusChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All</option>
              <option value="applied">Pending</option>
              <option value="beginner">Beginner</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </select>
            
            <input
              type="text"
              placeholder="Search by name or email"
              value={searchQuery}
              onChange={handleSearch}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            
            <button
              onClick={handleApplyFilter}
              className="w-full sm:w-auto bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition duration-150"
            >
              Apply Filter
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {loading ? (
          <div className="py-6 text-center text-gray-500">
            <Spinner animation="border" className="text-purple-500" /> Loading...
          </div>
        ) : mentors.length === 0 ? (
          <div className="py-6 text-center text-gray-500">No data is present</div>
        ) : (
          <>
            {/* Mobile Cards */}
            <div className="md:hidden">
              {mentors.map(renderMobileCard)}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full bg-white border-collapse">
                <thead className="bg-purple-500 text-white">
                  <tr>
                    <th className="py-4 px-6 text-left">Name</th>
                    <th className="py-4 px-6 text-left">Email</th>
                    <th className="py-4 px-6 text-left">Status</th>
                    <th className="py-4 px-6 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mentors.map((mentor) => (
                    <tr
                      key={mentor._id}
                      className="hover:bg-gray-50 transition duration-150"
                    >
                      <td className="py-4 px-6 border-b border-gray-200">
                        <div className="whitespace-normal break-words">
                          {mentor.name}
                        </div>
                      </td>
                      <td className="py-4 px-6 border-b border-gray-200">
                        <div className="whitespace-normal break-words">
                          {mentor.email}
                        </div>
                      </td>
                      <td className="py-4 px-6 border-b border-gray-200">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            mentor.isActive
                              ? "bg-green-200 text-green-800"
                              : "bg-red-200 text-red-800"
                          }`}
                        >
                          {mentor.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-4 px-6 border-b border-gray-200">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => handleBlock(mentor._id, mentor.isActive)}
                            className={`${
                              mentor.isActive ? "bg-red-500" : "bg-green-500"
                            } text-white px-4 py-1 rounded-md hover:bg-opacity-80 transition duration-150`}
                          >
                            {mentor.isActive ? "Block" : "Unblock"}
                          </button>
                          {mentor.isVerified !== "beginner" && (
                            <button
                              onClick={() => handleView(mentor._id)}
                              className="bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600 transition duration-150"
                            >
                              View
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-wrap items-center justify-center gap-2 py-4 px-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md text-white bg-purple-500 hover:bg-purple-600 transition duration-150 ${
                  currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-3 py-1 rounded-md text-white transition duration-150 ${
                    currentPage === index + 1
                      ? "bg-purple-600 shadow-md"
                      : "bg-gray-400 hover:bg-gray-500"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md text-white bg-purple-500 hover:bg-purple-600 transition duration-150 ${
                  currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminMentorListBody;