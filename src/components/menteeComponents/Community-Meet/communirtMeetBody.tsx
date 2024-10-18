import { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronUp,
  Loader,
  Search,
} from "lucide-react";
import toast from "react-hot-toast";
import { LOCALHOST_URL } from "../../../constants/constants";
import apiClientMentee from "../../../services/apiClientMentee";
import { useNavigate } from "react-router-dom";
import { ICommunityMeet } from "../../../interfaces/ImenteeInferfaces";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CommunityMeetBody = () => {
  const [communityMeets, setCommunityMeets] = useState<ICommunityMeet[]>([]);
  const [expandedMeetId, setExpandedMeetId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedStack, setSelectedStack] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMeetData();
  }, []);

  const fetchMeetData = async () => {
    setIsLoading(true);
    try {
      const { data } = await apiClientMentee.get(
        `${LOCALHOST_URL}/api/mentees/getMeets`
      );
      if (Array.isArray(data.meetData)) {
        setCommunityMeets(data.meetData);
      } else {
        toast.error("Received invalid data format from the server.");
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something unexpected happened."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const date = new Date(2000, 0, 1, parseInt(hours), parseInt(minutes));
    return date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  const isMeetOngoing = (
    meetDate: Date,
    startTime: string,
    endTime: string
  ) => {
    const now = new Date();
    const startDate = new Date(meetDate);
    const endDate = new Date(meetDate);

    const [startHours, startMinutes] = startTime.split(":");
    const [endHours, endMinutes] = endTime.split(":");

    startDate.setHours(parseInt(startHours), parseInt(startMinutes), 0);
    endDate.setHours(parseInt(endHours), parseInt(endMinutes), 0);

    if (now < startDate) {
      return { status: "upcoming" };
    } else if (now > endDate) {
      return { status: "completed" };
    } else {
      return { status: "ongoing" };
    }
  };

  const toggleExpand = (meetId: string) => {
    setExpandedMeetId(expandedMeetId === meetId ? null : meetId);
  };

  const handleVideoCall = (roomId: string) => {
    navigate(`/community/room/${roomId}`);
  };

  const filteredMeets = communityMeets.filter(
    (meet) =>
      (!selectedDate ||
        new Date(meet.date).toDateString() === selectedDate.toDateString()) &&
      (!selectedStack || meet.stack === selectedStack) &&
      (searchTerm === "" ||
        meet.mentorInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meet.stack.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredMeets.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredMeets.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const uniqueStacks = Array.from(
    new Set(communityMeets.map((meet) => meet.stack))
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="w-8 h-8 text-[#1D2B6B] animate-spin" />
        <span className="ml-2 text-lg text-gray-600">
          Loading community meets...
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row justify-center items-start space-y-6 lg:space-y-0 lg:space-x-6 p-6">
      <div className="w-full lg:w-3/4 space-y-6">
        {currentItems.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <CalendarIcon className="mx-auto h-16 w-16 text-[#1D2B6B] mb-4" />
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              No Community Meets Available
            </h3>
            <p className="text-gray-600 mb-4">
              Check back later for upcoming events!
            </p>
          </div>
        ) : (
          currentItems.map((meet) => {
            const meetStatus = isMeetOngoing(
              new Date(meet.date),
              meet.startTime,
              meet.endTime
            );

            return (
              <div
                key={meet._id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex flex-col sm:flex-row items-center mb-4">
                  <img
                    src={meet.mentorInfo.image}
                    alt={meet.mentorInfo.name}
                    className="w-16 h-16 mb-4 sm:mb-0 sm:mr-4 rounded-full object-cover shadow-sm"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {meet.mentorInfo.name}
                    </h3>
                    <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-600">
                      <div className="flex items-center mb-2 sm:mb-0 sm:mr-4">
                        <Calendar className="w-4 h-4 mr-1 text-[#1D2B6B]" />
                        <span>{new Date(meet.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1 text-[#1D2B6B]" />
                        <span>
                          {formatTime(meet.startTime)} - {formatTime(meet.endTime)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-[#1D2B6B] mb-2">
                    Tech Stack: {meet.stack}
                  </p>
                  <div className="text-gray-700 break-words">
                    {expandedMeetId === meet._id
                      ? meet.about
                      : `${meet.about.substring(0, 150)}...`}
                  </div>
                  <button
                    onClick={() => toggleExpand(meet._id)}
                    className="text-[#1D2B6B] hover:text-[#2A3F7E] text-sm font-medium flex items-center hover:underline mt-2 focus:outline-none"
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

                <img
                  src={meet.image}
                  alt={`${meet.mentorInfo.name} banner`}
                  className="w-full h-128 object-cover rounded-md shadow-sm mb-4"
                />

                {meetStatus.status === "upcoming" && (
                  <div className="text-center text-green-500 font-semibold mb-2">
                    Meet starts soon!
                  </div>
                )}

                {meetStatus.status === "ongoing" ? (
                  <button
                    onClick={() => handleVideoCall(meet.RoomId)}
                    className="w-full px-4 py-2 bg-[#1D2B6B] text-white rounded-md hover:bg-[#2A3F7E] transition duration-300 focus:outline-none focus:ring-2 focus:ring-[#1D2B6B] focus:ring-opacity-50"
                  >
                    Join Meet
                  </button>
                ) : (
                  <div className="text-center text-red-500 font-semibold">
                    {meetStatus.status === "completed"
                      ? "This meet has ended."
                      : "Upcoming Meet"}
                  </div>
                )}
              </div>
            );
          })
        )}

        {totalPages > 1 && (
          <div className="flex justify-center mt-6 space-x-4">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md focus:outline-none ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-[#1D2B6B] text-white hover:bg-[#2A3F7E] transition duration-300"
              }`}
            >
              Previous
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-md focus:outline-none ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-[#1D2B6B] text-white hover:bg-[#2A3F7E] transition duration-300"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>

      <div className="w-full lg:w-1/4 space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Filters</h4>
          <div className="space-y-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search:
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1D2B6B] focus:border-[#1D2B6B] sm:text-sm"
                  placeholder="Search by mentor or stack"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Select Date:
              </label>
              <DatePicker
                id="date"
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1D2B6B] focus:border-[#1D2B6B] sm:text-sm"
                placeholderText="Pick a date"
              />
            </div>
            <div>
              <label htmlFor="stack" className="block text-sm font-medium text-gray-700 mb-1">
                Select Tech Stack:
              </label>
              <select
                id="stack"
                value={selectedStack}
                onChange={(e) => setSelectedStack(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1D2B6B] focus:border-[#1D2B6B] sm:text-sm"
              >
                <option value="">All</option>
                {uniqueStacks.map((stack) => (
                  <option key={stack} value={stack}>
                    {stack}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityMeetBody;