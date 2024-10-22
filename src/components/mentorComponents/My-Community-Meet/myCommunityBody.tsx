import React, { useEffect, useState } from "react";
import { Calendar, Clock, Calendar as CalendarIcon, ChevronDown, ChevronUp, Loader, ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import apiClient from "../../../services/apiClient";
import { LOCALHOST_URL } from "../../../constants/constants";
import { ICommunityMeet } from "../../../interfaces/mentorInterfaces";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const MyCommunityBody: React.FC = () => {
  const [communityMeets, setCommunityMeets] = useState<ICommunityMeet[]>([]);
  const [filteredMeets, setFilteredMeets] = useState<ICommunityMeet[]>([]);
  const [expandedMeetId, setExpandedMeetId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [meetsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState<Date | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchMeetData();
  }, []);

  useEffect(() => {
    filterAndSearchMeets();
  }, [communityMeets, searchTerm, filterDate]);

  const fetchMeetData = async () => {
    setIsLoading(true);
    try {
      const { data } = await apiClient.get(`${LOCALHOST_URL}/api/mentor/getMyCommunityMeet`);
      
      if (Array.isArray(data.meetData)) {
        setCommunityMeets(data.meetData);
      } else {
        console.error("Received data is not an array:", data.meetData);
        toast.error("Received invalid data format from the server.");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something unexpected happened.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSearchMeets = () => {
    let filtered = communityMeets;

    if (searchTerm) {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter((meet) =>
        meet.mentorInfo.name.toLowerCase().includes(lowercasedSearchTerm) ||
        meet.stack.toLowerCase().includes(lowercasedSearchTerm) ||
        meet.about.toLowerCase().includes(lowercasedSearchTerm)
      );
    }

    if (filterDate) {
      filtered = filtered.filter((meet) => {
        const meetDate = new Date(meet.date);
        return (
          meetDate.getFullYear() === filterDate.getFullYear() &&
          meetDate.getMonth() === filterDate.getMonth() &&
          meetDate.getDate() === filterDate.getDate()
        );
      });
    }

    setFilteredMeets(filtered);
    setCurrentPage(1);
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const date = new Date(2000, 0, 1, parseInt(hours), parseInt(minutes));
    return date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  };

  const toggleExpand = (meetId: string) => {
    setExpandedMeetId(expandedMeetId === meetId ? null : meetId);
  };

  const NoDataMessage: React.FC = () => (
    <div className="bg-white p-8 rounded-lg shadow-md text-center">
      <CalendarIcon className="mx-auto h-16 w-16 text-violet-500 mb-4" />
      <h3 className="text-2xl font-semibold text-gray-800 mb-2">No Community Meets For You</h3>
      <p className="text-gray-600 mb-4">Add Some Community Meets!</p>
    </div>
  );

  const LoadingMessage: React.FC = () => (
    <div className="flex justify-center items-center h-64">
      <Loader className="w-8 h-8 text-violet-500 animate-spin" />
      <span className="ml-2 text-lg text-gray-600">Loading community meets...</span>
    </div>
  );

  const isOngoing = (meetDate: Date, startTime: string, endTime: string) => {
    const currentDate = new Date();
    const meetStartDateTime = new Date(meetDate);
    const meetEndDateTime = new Date(meetDate);

    const [startHour, startMinute] = startTime.split(":");
    const [endHour, endMinute] = endTime.split(":");

    meetStartDateTime.setHours(Number(startHour), Number(startMinute), 0);
    meetEndDateTime.setHours(Number(endHour), Number(endMinute), 0);

    if (currentDate >= meetStartDateTime && currentDate <= meetEndDateTime) {
      return "ongoing";
    } else if (currentDate > meetEndDateTime) {
      return "completed";
    } else {
      return "upcoming";
    }
  };

  const handleVideoCall = (roomId: string) => {
    navigate(`/mentor/community/room/${roomId}`);
  };

  // Pagination logic
  const indexOfLastMeet = currentPage * meetsPerPage;
  const indexOfFirstMeet = indexOfLastMeet - meetsPerPage;
  const currentMeets = filteredMeets.slice(indexOfFirstMeet, indexOfLastMeet);
  const totalPages = Math.ceil(filteredMeets.length / meetsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (isLoading) {
    return <LoadingMessage />;
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-2xl mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">My Community Meets</h2>
          <div className="flex items-center space-x-2">
            <DatePicker
              selected={filterDate}
              onChange={(date: Date | null) => setFilterDate(date)}
              dateFormat="MMMM d, yyyy"
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholderText="Filter by date"
            />
            {filterDate && (
              <button
                onClick={() => setFilterDate(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search meets..."
                className="border border-gray-300 rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl w-full space-y-6">
        {filteredMeets.length === 0 ? (
          <NoDataMessage />
        ) : (
          currentMeets.map((meet) => {
            const status = isOngoing(meet.date, meet.startTime, meet.endTime);
            return (
              <div key={meet._id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  <img src={meet.mentorInfo.image} alt={meet.mentorInfo.name} className="w-16 h-16 mr-4 rounded-full object-cover shadow-sm" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{meet.mentorInfo.name}</h3>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span className="mr-3">{new Date(meet.date).toLocaleDateString()}</span>
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{formatTime(meet.startTime)} - {formatTime(meet.endTime)}</span>
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-sm font-medium text-violet-600 mb-2">Tech Stack: {meet.stack}</p>
                  <div className="text-gray-700 break-words">
                    {expandedMeetId === meet._id
                      ? meet.about
                      : `${meet.about.substring(0, 150)}...`}
                  </div>
                  <button
                    onClick={() => toggleExpand(meet._id)}
                    className="text-violet-500 text-sm font-medium flex items-center hover:underline mt-2 focus:outline-none"
                  >
                    {expandedMeetId === meet._id ? (
                      <>
                        Show less <ChevronUp className="w-4 h-4 ml-1" />
                      </>
                    ) : (
                      <>
                        Read more <ChevronDown className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </button>
                </div>
                <img src={meet.image} alt={`${meet.mentorInfo.name} banner`} className="w-full h-128 object-cover rounded-md shadow-sm mb-4" />

                {status === "ongoing" ? (
                  <button
                    onClick={() => handleVideoCall(meet.RoomId)}
                    className="w-full px-4 py-2 bg-violet-500 text-white rounded-md hover:bg-violet-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-opacity-50"
                  >
                    Join
                  </button>
                ) : status === "completed" ? (
                  <div className="w-full px-4 py-2 bg-gray-400 text-white rounded-md text-center">
                    Completed
                  </div>
                ) : (
                  <button
                    disabled
                    className="w-full px-4 py-2 bg-gray-300 text-gray-500 rounded-md cursor-not-allowed"
                  >
                    Join
                  </button>
                )}
              </div>
            );
          })
        )}

        {/* Pagination */}
        {filteredMeets.length > meetsPerPage && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="mr-2 px-3 py-1 bg-violet-500 text-white rounded-md disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="mx-2 text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="ml-2 px-3 py-1 bg-violet-500 text-white rounded-md disabled:opacity-50"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCommunityBody;