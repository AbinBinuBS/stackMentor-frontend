import React, { useState, useEffect } from "react";
import apiClientMentee from "../../../services/apiClientMentee";
import { LOCALHOST_URL } from "../../../constants/constants";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSelectedChat } from "../../../redux/chatSlice";

interface MentorData {
  _id:string;
  name: string;
  image: string;
}

interface Slot {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
  price: number;
  mentorData: MentorData;
}

interface RescheduleOption {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
  price: number;
  isBooked: boolean;
}

interface ApiResponse {
  availableSlots: RescheduleOption[];
  message: string;
}

const convertTo12HourFormat = (time: string): string => {
  const [hour, minute] = time.split(':').map(Number);
  const period = hour >= 12 ? 'PM' : 'AM';
  const adjustedHour = hour % 12 || 12;
  return `${adjustedHour}:${minute.toString().padStart(2, '0')} ${period}`;
};

const MySlotBody: React.FC = () => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [rescheduleOptions, setRescheduleOptions] = useState<RescheduleOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [slotsPerPage] = useState(5);
  const [slotType, setSlotType] = useState("booked");
  const [isReloading, setIsReloading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    fetchSlots();
  }, [slotType]);

  const fetchSlots = async () => {
    setIsLoading(true);
    try {
      let response;
      switch (slotType) {
        case "booked":
          response = await apiClientMentee.get<{ bookedSlot: Slot[] }>(
            `${LOCALHOST_URL}/api/mentees/getBookedSlots`
          );
          setSlots(response.data.bookedSlot);
          break;
        case "cancelled":
          response = await apiClientMentee.get<{ cancelledSlot: Slot[] }>(
            `${LOCALHOST_URL}/api/mentees/getCancelledSlots`
          );
          setSlots(response.data.cancelledSlot);
          break;
        case "expired":
          response = await apiClientMentee.get<{ expiredSlot: Slot[] }>(
            `${LOCALHOST_URL}/api/mentees/getExpiredSlots`
          );
          setSlots(response.data.expiredSlot);
          break;
      }
    } catch (error) {
      console.error("Error fetching slots:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReschedule = async (slot: Slot) => {
    setSelectedSlot(slot);
    setIsRescheduleModalOpen(true);
    setIsLoading(true);

    try {
      const response = await apiClientMentee.get<ApiResponse>(
        `${LOCALHOST_URL}/api/mentees/availableSlots/${slot._id}/${slot.price}`
      );
      console.log("API response:", response.data);

      if (response.status === 200 && response.data.message === "Success") {
        setRescheduleOptions(response.data.availableSlots || []);
      } else {
        console.error("Failed to fetch reschedule options:", response.data.message);
        setRescheduleOptions([]);
      }
    } catch (error) {
      console.error("Error fetching reschedule options:", error);
      setRescheduleOptions([]);
    } finally {
      setIsLoading(false);
    }
  };

//   const handleCancel = async (slotId: string) => {
//     try {
//       const response = await apiClientMentee.delete(`${LOCALHOST_URL}/api/mentees/cancelBooking/${slotId}`);
//       if (response.status === 200) {
//         setSlots(slots.filter(slot => slot._id !== slotId));
//         setSuccessMessage("Slot cancelled successfully!");
//         setShowSuccessMessage(true);
//       } else {
//         console.error("Failed to cancel slot:", response.statusText);
//       }
//     } catch (error) {
//       console.error("Error cancelling slot:", error);
//     }
//   };

  const handleConfirmReschedule = async (newSlotId: string) => {
    if (!selectedSlot) return;

    try {
      const response = await apiClientMentee.post(`${LOCALHOST_URL}/api/mentees/rescheduleBooking`, {
        oldSlotId: selectedSlot._id,
        newSlotId: newSlotId
      });

      if (response.status === 200) {
        const updatedSlots = slots.map(slot => 
          slot._id === selectedSlot._id ? { ...slot, _id: newSlotId } : slot
        );
        setSlots(updatedSlots);
        setIsRescheduleModalOpen(false);
        setSuccessMessage("Booking rescheduled successfully!");
        setShowSuccessMessage(true);
        
        fetchSlots();
      } else {
        console.error("Failed to reschedule booking:", response.statusText);
      }
    } catch (error) {
      console.error("Error rescheduling booking:", error);
    }
  };

  const handleChat = async(slot:Slot)=>{
    try{
      const response = await apiClientMentee.post(`${LOCALHOST_URL}/api/chat/mentee`,slot)
      if(response.data.message == "Success"){
      console.log("11111111111111111111111",response.data)
        dispatch(setSelectedChat(response.data.chat))
        navigate('/chat')
      }
    }catch(error){
      console.log("error occured during chat:",error)
    }
  }

  const handleSlotTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSlotType(event.target.value);
    setCurrentPage(1);
  };



  const indexOfLastSlot = currentPage * slotsPerPage;
  const indexOfFirstSlot = indexOfLastSlot - slotsPerPage;
  const currentSlots = slots.slice(indexOfFirstSlot, indexOfLastSlot);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">My Slots</h1>
      <div className="flex justify-between items-center mb-4">
        <select 
          value={slotType} 
          onChange={handleSlotTypeChange}
          className="p-2 border rounded"
        >
          <option value="booked">Booked Slots</option>
          <option value="expired">Expired Slots</option>
        </select>
      </div>
      <div className="bg-white shadow-lg rounded-lg p-6 h-[600px]">
        <div className="h-full overflow-y-auto pr-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : currentSlots.length > 0 ? (
            currentSlots.map((slot) => (
              <div key={slot._id} className="bg-white shadow-md rounded-lg p-4 mb-4">
                <div className="flex items-start">
                  <img
                    src={slot.mentorData.image}
                    alt={`${slot.mentorData.name}'s image`}
                    className="w-24 h-24 object-cover rounded-md mr-4"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <h2 className="text-xl font-bold text-gray-800">{slot.mentorData.name}</h2>
                      <span className="text-sm text-gray-600">{new Date(slot.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-sm text-gray-700">Start: {convertTo12HourFormat(slot.startTime)}</p>
                        <p className="text-sm text-gray-700">End: {convertTo12HourFormat(slot.endTime)}</p>
                      </div>
                      <div className="space-x-2">
                        <button
                          onClick={() => handleReschedule(slot)}
                          className="px-3 py-1 bg-green-500 text-white text-sm rounded-md font-medium hover:bg-green-600 transition duration-200"
                        >
                          Reschedule
                        </button>
                        <button 
                        onClick={()=> handleChat(slot)}
                        className="px-3 py-1 bg-gradient-to-r from-[#1D2B6B] to-[#142057] text-white text-sm rounded-md font-medium hover:from-[#2A3F7E] hover:to-[#0A102E] transition duration-200">
                          Chat
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No slots available.</p>
          )}
        </div>
      </div>
      <div className="mt-4 flex justify-center">
        {Array.from({ length: Math.ceil(slots.length / slotsPerPage) }, (_, i) => (
          <button
            key={i}
            onClick={() => paginate(i + 1)}
            className={`mx-1 px-3 py-1 rounded ${
              currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {isRescheduleModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-4">Reschedule Options</h2>
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : rescheduleOptions.length > 0 ? (
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left">Date</th>
                    <th className="text-left">Start Time</th>
                    <th className="text-left">End Time</th>
                    <th className="text-left">Price</th>
                    <th className="text-left">Status</th>
                    <th className="text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {rescheduleOptions.map((option) => (
                    <tr key={option._id}>
                      <td>{new Date(option.date).toLocaleDateString()}</td>
                      <td>{convertTo12HourFormat(option.startTime)}</td>
                      <td>{convertTo12HourFormat(option.endTime)}</td>
                      <td>${option.price}</td>
                      <td>{option.isBooked ? 'Booked' : 'Available'}</td>
                      <td>
                        {!option.isBooked && (
                          <button
                          onClick={() => handleConfirmReschedule(option?._id)}
                          className="px-4 py-2 bg-gradient-to-r from-[#1D2B6B] to-[#142057] text-white rounded-md font-medium hover:from-[#2A3F7E] hover:to-[#0A102E] transition duration-200"
                        >
                          Reschedule
                        </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center text-gray-600">
                No available schedules for this mentor. You may want to cancel this slot.
              </p>
            )}
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsRescheduleModalOpen(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-md font-medium hover:bg-gray-600 transition duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccessMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg max-w-md w-full shadow-2xl">
            <h2 className="text-3xl font-bold mb-4 text-center text-green-600">🎉 Success! 🎉</h2>
            <p className="text-lg text-center mb-6">
              {successMessage}
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => setShowSuccessMessage(false)}
                className="px-6 py-3 bg-gradient-to-r from-[#1D2B6B] to-[#142057] text-white rounded-md font-medium hover:from-[#2A3F7E] hover:to-[#0A102E] transition duration-200"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MySlotBody;