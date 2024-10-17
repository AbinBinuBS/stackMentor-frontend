import React, { useEffect, useState } from 'react';
import { LOCALHOST_URL } from '../../../constants/constants';
import apiClient from '../../../services/apiClient';
import { ISlotMentor } from '../../../interfaces/mentorInterfaces';
import { useDispatch } from 'react-redux';
import { setSelectedChatMentor } from '../../../redux/chatSlice';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const MentorBookedSlotsBody: React.FC = () => {
  const [bookedSlots, setBookedSlots] = useState<ISlotMentor[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [slotsPerPage] = useState<number>(5);
  const [isMentorAllowed, setIsMentorAllowed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const getBookedSlots = async () => {
      try {
        const response = await apiClient.get(`${LOCALHOST_URL}/api/mentor/getBookedSlots`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setBookedSlots(response.data.Slots);
        setIsMentorAllowed(true);
      } catch (error) {
        if (error instanceof Error) {
          if (error.message === "Mentor is not verified. Please complete the verification process.") {
            setIsMentorAllowed(false);
          } else {
            toast.error(error.message);
          }
        } else {
          toast.error("Unable to fetch data.");
        }
      } finally {
        setLoading(false);
      }
    };

    getBookedSlots();
  }, []);

  const handleChat = async (slot: ISlotMentor) => {
    try {
      const response = await apiClient.post(`${LOCALHOST_URL}/api/chat/mentor`, {id:slot.bookingData.userId});
      if (response.data.message === "Success") {
        dispatch(setSelectedChatMentor(response.data.chat));
        navigate('/mentor/chat');
      }
    } catch (error) {
      toast.error("Failed to initiate chat.");
    }
  };

  const handleVideoCall = (slot: ISlotMentor) => {
    const roomId = slot.bookingData.roomId;
    navigate(`/mentor/room/${roomId}`);
  };

  const handleConnect = async (slot: ISlotMentor) => {
    try {
      const bookedId = slot.bookingData._id;
      const currentDate = new Date();
      const slotDate = new Date(slot.date);
      const [startHour, startMinute] = slot.startTime.split(':').map(Number);
      slotDate.setHours(startHour, startMinute, 0, 0);

      if (currentDate < slotDate) {
        const result = await Swal.fire({
          title: 'Are you sure?',
          text: "The scheduled time has not been reached yet. Do you want to start the session early?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, start early!',
        });

        if (!result.isConfirmed) {
          return;
        }
      }

      const response = await apiClient.post(`${LOCALHOST_URL}/api/mentor/allowConnection`, { bookedId });
      if (response.data.message === "Success") {
        toast.success("Connection allowed successfully.");
        const updatedSlots = bookedSlots.map(s =>
          s.bookingData._id === bookedId ? { ...s, bookingData: { ...s.bookingData, isAllowed: true } } : s
        );
        setBookedSlots(updatedSlots);
      }
    } catch (error) {
      toast.error("Something unexpected happened while connecting.");
    }
  };

  const handleEndConnection = async (slot: ISlotMentor) => {
    try {
      const bookedId = slot.bookingData._id;
      const response = await apiClient.post(`${LOCALHOST_URL}/api/mentor/endConnection`, { bookedId });

      if (response.data.message === "Success") {
        toast.success("Connection ended successfully.");
        const updatedSlots = bookedSlots.map(s =>
          s.bookingData._id === bookedId
            ? { ...s, bookingData: { ...s.bookingData, isAllowed: false, status: 'completed' } }
            : s
        );
        setBookedSlots(updatedSlots);
      }
    } catch (error) {
      toast.error("Something unexpected happened while ending the connection.");
    }
  };

  const indexOfLastSlot = currentPage * slotsPerPage;
  const indexOfFirstSlot = indexOfLastSlot - slotsPerPage;
  const currentSlots = bookedSlots.slice(indexOfFirstSlot, indexOfLastSlot);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-lg font-semibold text-gray-700">Loading...</p>
      </div>
    );
  }

  if (!isMentorAllowed) {
    return (
      <div className="flex flex-col justify-center items-center ">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-center mt-36 mr-4 ml-4">
          <h2 className="text-xl font-semibold text-red-600 mb-4">You are not verified</h2>
          <p className="text-gray-700 mb-4">Please complete the verification process to access your booked slots.</p>
          <button
            onClick={() => {navigate('/mentor/home')}}
            className="px-4 py-2 text-sm text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none"
          >
            Go Back to Home
          </button>
        </div>
      </div>
    );
  }
  
  
  

  if (!bookedSlots.length) {
    return <div className="p-4">No booked slots available.</div>;
  }

  const totalPages = Math.ceil(bookedSlots.length / slotsPerPage);

  return (
    <div className="w-full max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Booked Slots</h1>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="py-2 px-2 sm:px-4 border-b">Date</th>
              <th className="py-2 px-2 sm:px-4 border-b">Start Time</th>
              <th className="py-2 px-2 sm:px-4 border-b">End Time</th>
              <th className="py-2 px-2 sm:px-4 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentSlots?.map((slot) => (
              <tr key={slot._id.toString()}>
                <td className="py-2 px-2 sm:px-4 border-b">
                  {new Date(slot.date).toLocaleDateString()}
                </td>
                <td className="py-2 px-2 sm:px-4 border-b">{slot.startTime}</td>
                <td className="py-2 px-2 sm:px-4 border-b">{slot.endTime}</td>
                <td className="py-2 px-2 sm:px-4 border-b">
                  {slot.bookingData.status === 'completed' ? (
                    <span className="text-green-500">Completed</span>
                  ) : slot.bookingData.status === 'cancelled' ? (
                    <span className="text-red-500">Cancelled</span>
                  ) : slot.bookingData.isAllowed ? (
                    <div className="flex flex-wrap gap-2">
                      <button 
                        onClick={() => handleChat(slot)}
                        className="text-white bg-purple-500 hover:bg-purple-700 py-1 px-2 sm:px-3 rounded text-sm sm:text-base">
                        Chat
                      </button>
                      <button 
                        onClick={() => handleVideoCall(slot)}
                        className="text-white bg-purple-500 hover:bg-purple-700 py-1 px-2 sm:px-3 rounded text-sm sm:text-base">
                        Video Call
                      </button>
                      <button 
                        onClick={() => handleEndConnection(slot)}
                        className="text-white bg-red-500 hover:bg-red-700 py-1 px-2 sm:px-3 rounded text-sm sm:text-base">
                        End Connection
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleConnect(slot)}
                      className="text-white bg-green-500 hover:bg-green-700 py-1 px-2 sm:px-3 rounded text-sm sm:text-base">
                      Connect
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-4 flex-wrap">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
            className={`py-1 px-2 sm:px-3 m-1 rounded text-sm sm:text-base ${index + 1 === currentPage ? 'bg-purple-700 text-white' : 'bg-gray-200'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MentorBookedSlotsBody;
