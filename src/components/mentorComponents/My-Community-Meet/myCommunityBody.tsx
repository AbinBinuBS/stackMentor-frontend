import { useEffect, useState } from "react";
import { Calendar, Clock, Calendar as CalendarIcon, ChevronDown, ChevronUp, Loader } from "lucide-react";
import toast from "react-hot-toast";
import apiClient from "../../../services/apiClient";
import { LOCALHOST_URL } from "../../../constants/constants";
import { useNavigate } from "react-router-dom";

export interface ICommunityMeet {
  _id: string;
  date: Date;
  startTime: string;
  endTime: string;
  about: string;
  mentorInfo: {
    _id: string;
    name: string;
    image: string;
  };
  RoomId: string;
  image: string;
  stack: string;
}

const MyCommunityBody = () => {
  const [communityMeets, setCommunityMeets] = useState<ICommunityMeet[]>([]);
  const [expandedMeetId, setExpandedMeetId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchMeetData();
  }, []);

  const fetchMeetData = async () => {
    setIsLoading(true);
    try {
      const { data } = await apiClient.get(`${LOCALHOST_URL}/api/mentor/getMyCommunityMeet`);
      
      if (Array.isArray(data.meetData)) {
        setCommunityMeets(data.meetData);
        console.log(data);
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

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const date = new Date(2000, 0, 1, parseInt(hours), parseInt(minutes));
    return date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  };

  const toggleExpand = (meetId: string) => {
    setExpandedMeetId(expandedMeetId === meetId ? null : meetId);
  };

  const NoDataMessage = () => (
    <div className="bg-white p-8 rounded-lg shadow-md text-center">
      <CalendarIcon className="mx-auto h-16 w-16 text-violet-500 mb-4" />
      <h3 className="text-2xl font-semibold text-gray-800 mb-2">No Community Meets For You</h3>
      <p className="text-gray-600 mb-4">Add Some Community Meets!</p>
    </div>
  );

  const LoadingMessage = () => (
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

    // Check if the current date and time is between the start and end times
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

  if (isLoading) {
    return <LoadingMessage />;
  }

  return (
    <div className="flex justify-center items-start">
      <div className="max-w-2xl w-full space-y-6">
        {communityMeets.length === 0 ? (
          <NoDataMessage />
        ) : (
          communityMeets.map((meet) => {
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
      </div>
    </div>
  );
};

export default MyCommunityBody;
