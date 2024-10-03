import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";
import apiClient from "../../../services/apiClient";
import { LOCALHOST_URL } from "../../../constants/constants";
import { format, parseISO, isSameDay } from "date-fns";
import Swal from "sweetalert2";

interface Slot {
	_id: string;
	date: string;
	startTime: string;
	endTime: string;
	bookedSlots: Array<{
		status?: string;
	}>;
}

const MentorMySlotBody: React.FC = () => {
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);
	const [slots, setSlots] = useState<Slot[]>([]);
	const slotsPerPage = 6;

	useEffect(() => {

		getSlots();
	}, []);
	const getSlots = async () => {
		try {
			const response = await apiClient.get(
				`${LOCALHOST_URL}/api/mentor/getSlots`
			);
			if (response.data.message === "Slots sent successfully") {
				setSlots(response.data.sloteData || []);
			} else {
				toast.error("Failed to fetch slots: " + response.data.message);
			}
		} catch (error) {
			if (error instanceof Error) {
				if (error.message === "Request failed with status code 403") {
					toast.error("Mentor should be verified.");
				} else {
					toast.error(error.message);
				}
			} else {
				toast.error("Something went wrong, Please try again.");
			}
		}
	};

	const formattedDate = (date: string) =>
		format(parseISO(date), "MMMM d, yyyy");
	const formattedStartTime = (time: string) =>
		format(new Date(`1970-01-01T${time}:00`), "h:mm a");
	const formattedEndTime = (time: string) =>
		format(new Date(`1970-01-01T${time}:00`), "h:mm a");

	const filteredSlots = selectedDate
		? slots.filter((slot) => {
				const slotDate = parseISO(slot.date);
				return isSameDay(slotDate, selectedDate);
		  })
		: slots;

	const indexOfLastSlot = currentPage * slotsPerPage;
	const indexOfFirstSlot = indexOfLastSlot - slotsPerPage;
	const currentSlots = filteredSlots.slice(indexOfFirstSlot, indexOfLastSlot);
	const totalPages = Math.ceil(filteredSlots.length / slotsPerPage);

	const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

	const handleDateChange = (date: Date | null) => {
		setSelectedDate(date);
		setCurrentPage(1);
	};

	const handleDelete = async (id: string) => {
		const result = await Swal.fire({
			title: "Are you sure?",
			text: "You want to delete this slot.",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Yes, delete it!",
			cancelButtonText: "Cancel",
		});

		if (result.isConfirmed) {
			try {
				const response = await apiClient.delete(
					`${LOCALHOST_URL}/api/mentor/deleteSlot/${id}`
				);
				if (response.data.message === "Slots deleted successfully") {
					toast.success("Slot removed successfully");
					setSlots((prevSlots) =>
						prevSlots.filter((slot) => slot._id !== id)
					);
				} else if (response.data.message === "This slots already booked.") {
					const cancelResult = await Swal.fire({
						title: "Slot already booked",
						text: "Are you sure you want to cancel this slot?",
						icon: "warning",
						showCancelButton: true,
						confirmButtonColor: "#3085d6",
						cancelButtonColor: "#d33",
						confirmButtonText: "Yes, cancel it!",
						cancelButtonText: "Cancel",
					});

					if (cancelResult.isConfirmed) {
						const cancelResponse = await apiClient.put(
							`${LOCALHOST_URL}/api/mentor/cancelSlot`,
							{ id }
						);
						if (cancelResponse.data.message === "Slot cancelled successfully") {
							toast.success("Slot cancelled successfully");
							getSlots()
						} else {
							toast.error(cancelResponse.data.message);
						}
					}
				} else {
					toast.error(response.data.message);
				}
			} catch (error) {
				if (error instanceof Error) {
					if (error.message === "Request failed with status code 403") {
						toast.error("Mentor should be verified.");
					} else {
						toast.error(error.message);
					}
				} else {
					toast.error("Something went wrong, please try again.");
				}
			}
		}
	};

	return (
		<div className="flex ml-16 flex-col justify-center items-center min-h-screen bg-gray-100 p-6">
			<div className="w-full max-w-5xl bg-white p-6 rounded-lg shadow-lg">
				<h2 className="text-2xl font-bold mb-4">Mentoring Slots</h2>
				<div className="mb-6">
					<DatePicker
						selected={selectedDate}
						onChange={handleDateChange}
						dateFormat="yyyy-MM-dd"
						className="p-2 border border-gray-300 rounded"
						placeholderText="Select a date"
					/>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{currentSlots.length > 0 ? (
						currentSlots.map((slot) => {
							const status = slot.bookedSlots[0]?.status; 
							return (
								<div
									key={slot._id}
									className="bg-purple-100 p-4 rounded-lg shadow-sm"
								>
									<h3 className="text-lg font-semibold mb-2">
										Date: {formattedDate(slot.date)}
									</h3>
									<p className="text-gray-600">
										Start: {formattedStartTime(slot.startTime)}
									</p>
									<p className="text-gray-600">
										End: {formattedEndTime(slot.endTime)}
									</p>
									<div className="mt-2 space-x-2">
										{status === "cancelled" ? (
											<p className="text-red-500 font-bold">Cancelled</p>
										) : status === "completed" ? (
											<p className="text-green-500 font-bold">Completed</p>
										) : (
											<button
												onClick={() => handleDelete(slot._id)}
												className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
											>
												Remove
											</button>
										)}
									</div>
								</div>
							);
						})
					) : (
						<p className="text-center text-gray-500">
							No slots available for the selected date.
						</p>
					)}
				</div>
				<div className="flex justify-center mt-6">
					<button
						onClick={() => paginate(currentPage - 1)}
						disabled={currentPage === 1}
						className="px-3 py-1 mx-1 rounded bg-gray-300 hover:bg-gray-400 text-gray-700"
					>
						Previous
					</button>
					{Array.from({ length: totalPages }, (_, i) => (
						<button
							key={i}
							onClick={() => paginate(i + 1)}
							className={`mx-1 px-3 py-1 rounded ${
								currentPage === i + 1
									? "bg-purple-500 text-white"
									: "bg-gray-200"
							}`}
						>
							{i + 1}
						</button>
					))}
					<button
						onClick={() => paginate(currentPage + 1)}
						disabled={currentPage === totalPages}
						className="px-3 py-1 mx-1 rounded bg-gray-300 hover:bg-gray-400 text-gray-700"
					>
						Next
					</button>
				</div>
			</div>
		</div>
	);
};

export default MentorMySlotBody;
