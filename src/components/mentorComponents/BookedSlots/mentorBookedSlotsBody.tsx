import React, { useEffect, useState } from 'react';
import { LOCALHOST_URL } from '../../../constants/constants';
import apiClient from '../../../services/apiClient';
import { ISlotMentor } from '../../../interfaces/mentorInterfaces';
import { useDispatch } from 'react-redux';
import { setSelectedChat } from '../../../redux/chatSlice';
import { useNavigate } from 'react-router-dom';

const MentorBookedSlotsBody: React.FC = () => {
  const [bookedSlots, setBookedSlots] = useState<ISlotMentor[] | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [slotsPerPage] = useState<number>(5); // Number of slots to display per page
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch()
  const navigate = useNavigate()
  useEffect(() => {
    const getBookedSlots = async () => {
      try {
        const response = await apiClient.get(`${LOCALHOST_URL}/api/mentor/getBookedSlots`);
        setBookedSlots(response.data.Slots);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    getBookedSlots();
  }, []);

  const handleChat = async(slot:ISlotMentor)=>{
    try{
      const response = await apiClient.post(`${LOCALHOST_URL}/api/chat/mentor`,slot)
      if(response.data.message == "Success"){
        dispatch(setSelectedChat(response.data.chat))
        navigate('/mentor/chat')
      }
    }catch(error){
      console.log("error occured during chat:",error)
    }

  }

  const indexOfLastSlot = currentPage * slotsPerPage;
  const indexOfFirstSlot = indexOfLastSlot - slotsPerPage;
  const currentSlots = bookedSlots?.slice(indexOfFirstSlot, indexOfLastSlot);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) {
    return <div className="ml-36 mt-10">Loading...</div>;
  }

  if (error) {
    return <div className="ml-36 mt-10 text-red-500">Error: {error}</div>;
  }

  if (!bookedSlots || bookedSlots.length === 0) {
    return <div className="ml-36 mt-10">No booked slots available.</div>;
  }

  const totalPages = Math.ceil(bookedSlots.length / slotsPerPage);

  return (
    <div className="w-[750px] ml-36 bg-white shadow-lg rounded-lg p-6">
      <h1 className="text-3xl font-bold mb-6">Booked Slots</h1>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Date</th>
            <th className="py-2 px-4 border-b">Start Time</th>
            <th className="py-2 px-4 border-b">End Time</th>
            <th className="py-2 px-4 border-b">Action</th>
          </tr>
        </thead>
        <tbody>
          {currentSlots?.map((slot) => (
            <tr key={slot._id.toString()}>
              <td className="py-2 px-4 border-b">{new Date(slot.date).toLocaleDateString()}</td>
              <td className="py-2 px-4 border-b">{slot.startTime}</td>
              <td className="py-2 px-4 border-b">{slot.endTime}</td>
              <td className="py-2 px-4 border-b">
                <button 
                onClick={()=>handleChat(slot)}
                className="text-white bg-purple-500 hover:bg-purple-700 py-1 px-3 rounded">
                  Chat
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
            className={`py-1 px-3 mx-1 rounded ${index + 1 === currentPage ? 'bg-purple-700 text-white' : 'bg-gray-200'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MentorBookedSlotsBody;
