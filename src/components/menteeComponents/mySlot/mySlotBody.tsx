import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import apiClientMentee from "../../../services/apiClientMentee";
import { LOCALHOST_URL } from "../../../constants/constants";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSelectedChat } from "../../../redux/chatSlice";
import toast from "react-hot-toast";
import {
    ApiResponse,
    RescheduleOption,
    Slot,
} from "../../../interfaces/ImenteeInferfaces";
import { ratingSchema } from "../../../validations/menteeValidation";

const ITEMS_PER_PAGE = 5;

const convertTo12HourFormat = (time: string): string => {
    const [hour, minute] = time.split(":").map(Number);
    const period = hour >= 12 ? "PM" : "AM";
    const adjustedHour = hour % 12 || 12;
    return `${adjustedHour}:${minute.toString().padStart(2, "0")} ${period}`;
};

const MySlotBody: React.FC = () => {
    const [slots, setSlots] = useState<Slot[]>([]);
    const [filteredSlots, setFilteredSlots] = useState<Slot[]>([]);
    const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
    const [rescheduleOptions, setRescheduleOptions] = useState<RescheduleOption[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
    const [slotToCancel, setSlotToCancel] = useState<Slot | null>(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
	const [currentModalPage, setCurrentModalPage] = useState(1);
	const itemsPerPage = 5;
    useEffect(() => {
        fetchSlots();
    }, [selectedDate]);

    useEffect(() => {
        filterAndSortSlots();
    }, [slots, statusFilter]);

    const fetchSlots = async () => {
		setIsLoading(true);
		try {
			let url = `${LOCALHOST_URL}/api/mentees/getBookedSlots`;
			if (selectedDate) {
				url += `?date=${selectedDate}`;
			}
			let response = await apiClientMentee.get<{ bookedSlot: Slot[] }>(url);
			setSlots(response.data.bookedSlot);
			setCurrentPage(1);
			setCurrentModalPage(1)
		} catch (error) {
			console.error("Error fetching slots:", error);
		} finally {
			setIsLoading(false);
		}
	};
	const totalPages = Math.ceil(rescheduleOptions.length / itemsPerPage);
	const startIndex = (currentModalPage - 1) * itemsPerPage;
	const currentOptions = rescheduleOptions.slice(startIndex, startIndex + itemsPerPage);

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSelectedDate(event.target.value);
	
		filterAndSortSlots();
	};
	
	const filterAndSortSlots = () => {
		let filtered = slots;
	
		if (selectedDate) {
			filtered = filtered.filter(slot => {
				const slotDate = new Date(slot.date);
				return slotDate.toISOString().split('T')[0] === selectedDate; 
			});
		}
	
		
		if (statusFilter !== "all") {
			filtered = filtered.filter(slot => slot.status === statusFilter);
		}
	
		
		const sorted = filtered.sort((a, b) => {
			if (a.status === "completed" && b.status !== "completed") return 1;
			if (a.status !== "completed" && b.status === "completed") return -1;
			if (a.status === "cancelled" && b.status !== "cancelled") return 1;
			if (a.status !== "cancelled" && b.status === "cancelled") return -1;
			return 0;
		});
	
		
		setFilteredSlots(sorted);
	};
	

    const indexOfLastSlot = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstSlot = indexOfLastSlot - ITEMS_PER_PAGE;
    const currentSlots = filteredSlots.slice(indexOfFirstSlot, indexOfLastSlot);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    

    const handleStatusFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setStatusFilter(event.target.value);
        setCurrentPage(1);
    };
	const handleReschedule = async (slot: Slot) => {
		setSelectedSlot(slot);
		setIsRescheduleModalOpen(true);
		setIsLoading(true);

		try {
			const response = await apiClientMentee.get<ApiResponse>(
				`${LOCALHOST_URL}/api/mentees/availableSlots/${slot._id}/${slot.price}`
			);

			if (response.status === 200 && response.data.message === "Success") {
				setRescheduleOptions(response.data.availableSlots || []);
			} else {
				setRescheduleOptions([]);
			}
		} catch (error) {
			setRescheduleOptions([]);
		} finally {
			setIsLoading(false);
		}
	};

	const handleCancelClick = (slot: Slot) => {
		setSlotToCancel(slot);
		setShowCancelConfirmation(true);
	};

	const handleConfirmCancel = async () => {
		if (!slotToCancel) return;

		try {
			const response = await apiClientMentee.put(
				`${LOCALHOST_URL}/api/mentees/cancelSlot/`,
				slotToCancel
			);
			if (response.status === 200) {
				setShowCancelConfirmation(false);
				setSuccessMessage("Slot cancelled successfully!");
				setShowSuccessMessage(true);
				fetchSlots();
			} else {
				console.error("Failed to cancel slot:", response.statusText);
			}
		} catch (error) {
			console.error("Error cancelling slot:", error);
		}
	};

	const handleConfirmReschedule = async (newSlotId: string) => {
		if (!selectedSlot) return;

		try {
			const response = await apiClientMentee.post(
				`${LOCALHOST_URL}/api/mentees/rescheduleBooking`,
				{
					oldSlotId: selectedSlot._id,
					newSlotId: newSlotId,
				}
			);

			if (response.status === 200) {
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

	const handleChat = async (slot: Slot) => {
		try {
			const response = await apiClientMentee.post(
				`${LOCALHOST_URL}/api/chat/mentee`,
				{ id: slot.mentorData._id }
			);
			if (response.data.message == "Success") {
				dispatch(setSelectedChat(response.data.chat));
				navigate("/chat");
			}
		} catch (error) {
			console.log("error occurred during chat:", error);
		}
	};

	const handleVedioCall = (slot: Slot) => {
		try {
			navigate(`/room/${slot.roomId}`);
		} catch (error) {
			console.log(error);
		}
	};

	const formik = useFormik({
        initialValues: {
            rating: 0,
            comment: "",
        },
        validationSchema: ratingSchema,
        onSubmit: async (values) => {
            try {
                const { data } = await apiClientMentee.post(
                    `${LOCALHOST_URL}/api/mentees/review`,
                    { values, slotId: selectedSlot?.mentorData._id }
                );
                if (data.message == "Success") {
                    toast.success("Rating added");
                    setShowModal(false);
                    formik.resetForm();
                }
            } catch (error) {
                console.log("error occurred during chat:", error);
            }
        },
    });

	const handleRating = (slot: Slot) => {
		setSelectedSlot(slot);
		setShowModal(true);
	};

	return (
		<div className="w-full max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">My Slots</h1>
            <div className="bg-white shadow-lg rounded-lg p-4">
			<div className="flex justify-between items-center mb-3">
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={handleDateChange}
                        className="border rounded-md p-1 text-sm"
                    />
                    <select
                        value={statusFilter}
                        onChange={handleStatusFilterChange}
                        className="border rounded-md p-1 text-sm"
                    >
                        <option value="all">All Slots</option>
                        <option value="confirmed">Not Completed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
                <div className="h-[400px] overflow-y-auto pr-3">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-full">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : currentSlots.length > 0 ? (
                        currentSlots.map((slot) => (
                            <div
                                key={slot._id}
                                className={`bg-white shadow-md rounded-lg p-3 mb-3 ${
                                    slot.status === "completed"
                                        ? "border-l-4 border-green-500"
                                        : slot.status === "cancelled"
                                        ? "border-l-4 border-red-500"
                                        : "border-l-4 border-blue-500"
                                }`}
                            >
                                <div className="flex items-start">
                                    <img
                                        src={slot.mentorData.image}
                                        alt={`${slot.mentorData.name}'s image`}
                                        className="w-16 h-16 object-cover rounded-md mr-3"
                                    />
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center mb-1">
                                            <h2 className="text-lg font-bold text-gray-800">
                                                {slot.mentorData.name}
                                            </h2>
                                            <span className="text-xs text-gray-600">
                                                {new Date(slot.date).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-xs text-gray-700">
                                                    Start: {convertTo12HourFormat(slot.startTime)}
                                                </p>
                                                <p className="text-xs text-gray-700">
                                                    End: {convertTo12HourFormat(slot.endTime)}
                                                </p>
                                            </div>
                                            <div className="space-x-1">
                                                {slot.status === "completed" ? (
                                                    <>
                                                        <button
                                                            onClick={() => handleRating(slot)}
                                                            className="px-2 py-1 bg-slate-400 text-white text-xs rounded-md font-medium hover:bg-slate-700 transition duration-200"
                                                        >
                                                            Rate
                                                        </button>
                                                        <span className="text-green-500 font-medium text-xs">
                                                            Completed
                                                        </span>
                                                    </>
                                                ) : slot.status === "cancelled" ? (
                                                    <span className="text-red-500 font-medium text-xs">
                                                        Cancelled
                                                    </span>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => handleReschedule(slot)}
                                                            className="px-2 py-1 bg-green-500 text-white text-xs rounded-md font-medium hover:bg-green-600 transition duration-200"
                                                        >
                                                            Reschedule
                                                        </button>
                                                        <button
                                                            onClick={() => handleCancelClick(slot)}
                                                            className="px-2 py-1 bg-red-500 text-white text-xs rounded-md font-medium hover:bg-red-600 transition duration-200"
                                                        >
                                                            Cancel
                                                        </button>
                                                        {slot.isAllowed ? (
                                                            <>
                                                                <button
                                                                    onClick={() => handleChat(slot)}
                                                                    className="px-2 py-1 bg-gradient-to-r from-[#1D2B6B] to-[#142057] text-white text-xs rounded-md font-medium hover:from-[#2A3F7E] hover:to-[#0A102E] transition duration-200"
                                                                >
                                                                    Chat
                                                                </button>
                                                                <button
                                                                    onClick={() => handleVedioCall(slot)}
                                                                    className="px-2 py-1 bg-purple-500 text-white text-xs rounded-md font-medium hover:bg-red-600 transition duration-200"
                                                                >
                                                                    Video
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <button
                                                                    className="px-2 py-1 bg-gray-300 text-white text-xs rounded-md font-medium cursor-not-allowed"
                                                                    onClick={() =>
                                                                        toast.error(
                                                                            "You can chat when mentor allows you."
                                                                        )
                                                                    }
                                                                >
                                                                    Chat
                                                                </button>
                                                                <button
                                                                    className="px-2 py-1 bg-gray-300 text-white text-xs rounded-md font-medium cursor-not-allowed"
                                                                    onClick={() =>
                                                                        toast.error(
                                                                            "You can join when mentor allows you."
                                                                        )
                                                                    }
                                                                >
                                                                    Video
                                                                </button>
                                                            </>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm bg-gradient-to-r mt-36 from-[#1D2B6B] to-[#142057] bg-clip-text text-transparent font-semibold bg-red-100 border border-red-400 rounded-md p-2 text-center">
                        No slots available.
                      </p>                      
                    )}
                </div>
                <div className="mt-3 flex justify-center">
                    {Array.from({ length: Math.ceil(filteredSlots.length / ITEMS_PER_PAGE) }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => paginate(index + 1)}
                            className={`mx-1 px-2 py-1 rounded text-xs ${
                                currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'
                            }`}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-8 rounded-lg w-96 shadow-xl">
                        <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">Rate Your Mentor</h3>
                        <form onSubmit={formik.handleSubmit}>
                            <div className="flex justify-center mb-6">
                                {[...Array(5)].map((_, index) => (
                                    <span
                                        key={index}
                                        className={`cursor-pointer text-4xl ${
                                            formik.values.rating > index ? "text-yellow-400" : "text-gray-300"
                                        } transition-colors duration-200 hover:text-yellow-400`}
                                        onClick={() => formik.setFieldValue("rating", index + 1)}
                                    >
                                        ★
                                    </span>
                                ))}
                            </div>
                            {formik.touched.rating && formik.errors.rating && (
                                <p className="text-red-500 text-sm text-center mb-4">{formik.errors.rating}</p>
                            )}
                            <textarea
                                name="comment"
                                placeholder="Share your experience (50-150 characters)"
                                value={formik.values.comment}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows={4}
                            />
                            {formik.touched.comment && formik.errors.comment && (
                                <p className="text-red-500 text-sm mb-4">{formik.errors.comment}</p>
                            )}
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        formik.resetForm();
                                    }}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

{isRescheduleModalOpen && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-4">Reschedule Options</h2>
            {isLoading ? (
                <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : rescheduleOptions.length > 0 ? (
                <>
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
                            {currentOptions.map((option) => (
                                <tr key={option._id}>
                                    <td>{new Date(option.date).toLocaleDateString()}</td>
                                    <td>{convertTo12HourFormat(option.startTime)}</td>
                                    <td>{convertTo12HourFormat(option.endTime)}</td>
                                    <td>${option.price}</td>
                                    <td>{option.isBooked ? "Booked" : "Available"}</td>
                                    <td>
                                        {!option.isBooked && (
                                            <button
                                                onClick={() => handleConfirmReschedule(option._id)}
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

                    <div className="flex justify-between items-center mt-4">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            className="px-2 py-1 bg-blue-500 text-white rounded-md"
                            disabled={currentModalPage === 1}
                        >
                            &#x25C0; 
                        </button>
                        <span>
                            Page {currentModalPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentModalPage((prev) => Math.min(prev + 1, totalPages))}
                            className="px-2 py-1 bg-blue-500 text-white rounded-md"
                            disabled={currentModalPage === totalPages}
                        >
                            &#x25B6; 
                        </button>
                    </div>
                </>
            ) : (
                <p className="text-center text-gray-600">
                    No available schedules for this mentor. You may want to cancel
                    this slot.
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


            {showCancelConfirmation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4">Confirm Cancellation</h2>
                        <p className="mb-6">Are you sure you want to cancel this slot?</p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setShowCancelConfirmation(false)}
                                className="px-4 py-2 bg-gray-500 text-white rounded-md font-medium hover:bg-gray-600 transition duration-200"
                            >
                                No, Keep it
                            </button>
                            <button
                                onClick={handleConfirmCancel}
                                className="px-4 py-2 bg-red-500 text-white rounded-md font-medium hover:bg-red-600 transition duration-200"
                            >
                                Yes, Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

			{showSuccessMessage && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
					<div className="bg-white p-8 rounded-lg max-w-md w-full shadow-2xl">
						<h2 className="text-3xl font-bold mb-4 text-center text-green-600">
							🎉 Success! 🎉
						</h2>
						<p className="text-lg text-center mb-6">{successMessage}</p>
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
