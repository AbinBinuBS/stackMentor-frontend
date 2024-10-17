import React, { useState } from "react";
import axios from "axios";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import {
	ISlot,
	MenteeSingleMentorBodyProps,
} from "../../../interfaces/ImenteeInferfaces";
import { LOCALHOST_URL } from "../../../constants/constants";
import toast from "react-hot-toast";
import apiClientMentee from "../../../services/apiClientMentee";
import { ArrowLeft } from "lucide-react";
import Swal from "sweetalert2";

const MenteeSingleMentorBody: React.FC<MenteeSingleMentorBodyProps> = ({
	slots,
	onSlotUpdate,
	onBackClick,
}) => {
	const stripe = useStripe();
	const elements = useElements();
	const [currentPage, setCurrentPage] = useState<number>(1);
	const sessionsPerPage: number = 5;
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedSession, setSelectedSession] = useState<ISlot | null>(null);
	const [showSuccessMessage, setShowSuccessMessage] = useState(false);
	const [isPaymentMethodModalOpen, setIsPaymentMethodModalOpen] =
		useState(false);
		const [loading, setLoading] = useState(false)

	const filteredSlots = slots || [];
	const indexOfLastSession: number = currentPage * sessionsPerPage;
	const indexOfFirstSession: number = indexOfLastSession - sessionsPerPage;
	const currentSessions: ISlot[] = filteredSlots.slice(
		indexOfFirstSession,
		indexOfLastSession
	);

	const paginate = (pageNumber: number): void => setCurrentPage(pageNumber);

	const convertTo12HourFormat = (time: string): string => {
		const [hours, minutes] = time.split(":").map(Number);
		const period = hours >= 12 ? "PM" : "AM";
		const adjustedHours = hours % 12 || 12;
		return `${adjustedHours.toString().padStart(2, "0")}:${minutes
			.toString()
			.padStart(2, "0")} ${period}`;
	};

	const handleBookSession = (session: ISlot) => {
		setSelectedSession(session);
		setIsPaymentMethodModalOpen(true);
	};

	const handleSuccess = () =>{
		setShowSuccessMessage(false)
		if(!selectedSession)return 
		onSlotUpdate(selectedSession._id);
	}

	const handlePaymentMethodSelection = async (method: "stripe" | "wallet") => {
		setIsPaymentMethodModalOpen(false);

		if (method === "stripe") {
			setIsModalOpen(true);
		} else if (method === "wallet") {
			const result = await Swal.fire({
				title: "Are you sure?",
				text: "You are about to pay using your wallet balance.",
				icon: "warning",
				showCancelButton: true,
				confirmButtonColor: "#3085d6",
				cancelButtonColor: "#d33",
				confirmButtonText: "Yes, proceed!",
				cancelButtonText: "No, cancel!",
			});

			if (result.isConfirmed) {
				try {
					if (!selectedSession) return;

					const { data } = await apiClientMentee.post(
						`${LOCALHOST_URL}/api/mentees/payUsingWallet`,
						{ sessionId: selectedSession._id }
					);

					if (data.message === "Success") {
						setShowSuccessMessage(true);
					}
				} catch (error) {
					if (error instanceof Error) {
						if (error.message === "Request failed with status code 409") {
							toast.error("This slot is already booked.");
						} else if (
							error.message === "Request failed with status code 403"
						) {
							toast.error("Insufficient balance in Wallet");
						} else {
							toast.error(
								"Something unexpected happened. Please try again later."
							);
						}
					} else {
						toast.error("Something unexpected happened.");
					}
				}
			}
		}
	};

	const processPayment = async () => {
		if (!stripe || !elements || !selectedSession) return;

		try {
			const response = await axios.post(
				`${LOCALHOST_URL}/api/mentees/checkAvailable`,
				{ sessionId: selectedSession._id }
			);
			if (response.data.message === "Success") {
				const { data } = await apiClientMentee.post(
					`${LOCALHOST_URL}/api/mentees/menteePayment`,
					{
						amount: selectedSession.price,
					}
				);
				const { clientSecret } = data;
				const result = await stripe.confirmCardPayment(clientSecret, {
					payment_method: {
						card: elements.getElement(CardElement)!,
						billing_details: {
							name: "Customer Name",
						},
					},
				});

				if (result.error) {
					if (result.error.message === "Your card number is incomplete.") {
						toast.error(result.error.message);
					}
				} else if (result.paymentIntent?.status === "succeeded") {
					setLoading(true)
					const { data } = await apiClientMentee.post(`${LOCALHOST_URL}/api/mentees/proceedPayment`,{sessionId: selectedSession._id})
					if(data.message == "Success"){
						setIsModalOpen(false);
						setShowSuccessMessage(true);
						setLoading(false)
					}else{
						setLoading(false)
						toast.error("something happened please try again later")
					}
				}
			}
		} catch (error) {
			if (error instanceof Error) {
				if (error.message === "Request failed with status code 409") {
					toast.error("This slot is already booked.");
				} else {
					toast.error("something unexpected happened.please try again later.");
				}
			} else {
				toast.error("something unexpected happened.please try again later.");
			}
		}
	};

	const PaymentModal = () => {
		if (!isModalOpen || !selectedSession) return null;

		return (
			<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
				<div className="bg-white p-8 rounded-lg max-w-md w-full shadow-2xl">
					<h2 className="text-2xl font-bold mb-6 text-center text-[#1D2B6B]">
						Book Mentor
					</h2>
					<div className="space-y-4 mb-6">
						<p className="text-lg">
							<span className="font-semibold">Date:</span>{" "}
							{new Date(selectedSession.date).toDateString()}
						</p>
						<p className="text-lg">
							<span className="font-semibold">Time:</span>{" "}
							{convertTo12HourFormat(selectedSession.startTime)} -{" "}
							{convertTo12HourFormat(selectedSession.endTime)}
						</p>
						<p className="text-lg">
							<span className="font-semibold">Price:</span> ₹
							{selectedSession.price}
						</p>
					</div>
					<div className="mb-6">
						<CardElement
							options={{
								style: {
									base: {
										fontSize: "16px",
										"::placeholder": {
											color: "#aab7c4",
										},
									},
								},
							}}
						/>
					</div>
					<div className="flex justify-end space-x-4">
						<button
							onClick={() => setIsModalOpen(false)}
							className="px-6 py-3 bg-gray-200 rounded-md text-gray-800 font-medium hover:bg-gray-300 transition duration-200"
						>
							Cancel
						</button>
						<button
							onClick={processPayment}
							className={`px-6 py-3 bg-gradient-to-r from-[#1D2B6B] to-[#142057] text-white rounded-md font-medium hover:from-[#2A3F7E] hover:to-[#0A102E] transition duration-200 ${
								loading ? 'opacity-50 cursor-not-allowed' : ''
							}`}
							disabled={loading} 
						>
							{loading ? 'Processing...' : 'Pay'}
						</button>
					</div>
				</div>
			</div>
		);
	};

	const SuccessMessage = () => {
		if (!showSuccessMessage) return null;

		return (
			<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
				<div className="bg-white p-8 rounded-lg max-w-md w-full shadow-2xl">
					<h2 className="text-3xl font-bold mb-4 text-center text-green-600">
						🎉 Booking Successful! 🎉
					</h2>
					<p className="text-lg text-center mb-6">
						Your session has been booked successfully. We look forward to seeing
						you!
					</p>
					<div className="flex justify-center">
						<button
							onClick={handleSuccess}
							className="px-6 py-3 bg-gradient-to-r from-[#1D2B6B] to-[#142057] text-white rounded-md font-medium hover:from-[#2A3F7E] hover:to-[#0A102E] transition duration-200"
						>
							OK
						</button>
					</div>
				</div>
			</div>
		);
	};

	const PaymentMethodModal = () => {
		if (!isPaymentMethodModalOpen || !selectedSession) return null;

		return (
			<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
				<div className="bg-white p-8 rounded-lg max-w-md w-full shadow-2xl">
					<h2 className="text-2xl font-bold mb-6 text-center text-[#1D2B6B]">
						Choose Payment Method
					</h2>
					<div className="space-y-4 mb-6">
						<button
							onClick={() => handlePaymentMethodSelection("stripe")}
							className="w-full px-6 py-3 bg-gradient-to-r from-[#1D2B6B] to-[#142057] text-white rounded-md font-medium hover:from-[#2A3F7E] hover:to-[#0A102E] transition duration-200"
						>
							Pay with Stripe
						</button>
						<button
							onClick={() => handlePaymentMethodSelection("wallet")}
							className="w-full px-6 py-3 bg-gradient-to-r from-[#4CAF50] to-[#45A049] text-white rounded-md font-medium hover:from-[#45A049] hover:to-[#3D8B3D] transition duration-200"
						>
							Pay with Wallet
						</button>
					</div>
					<div className="flex justify-end">
						<button
							onClick={() => setIsPaymentMethodModalOpen(false)}
							className="px-6 py-3 bg-gray-200 rounded-md text-gray-800 font-medium hover:bg-gray-300 transition duration-200"
						>
							Cancel
						</button>
					</div>
				</div>
			</div>
		);
	};

	const handleBackClick = () => {
		if (onBackClick) {
			onBackClick();
		} else {
			window.history.back();
		}
	};

	return (
		<div className="bg-white rounded-lg shadow-lg p-6">
			<div className="flex items-center mb-4">
				<button
					onClick={handleBackClick}
					className="flex items-center text-[#1D2B6B] hover:text-[#2A3F7E] transition-colors duration-200"
				>
					<ArrowLeft size={24} />
					<span className="ml-2">Back</span>
				</button>
			</div>
			<div className="overflow-x-auto">
				<table className="w-full border-collapse min-w-[640px]">
					<thead>
						<tr className="bg-gray-100">
							<th className="border p-2">Date</th>
							<th className="border p-2">Time</th>
							<th className="border p-2">Price</th>
							<th className="border p-2">Status</th>
							<th className="border p-2">Action</th>
						</tr>
					</thead>
					<tbody>
						{currentSessions.map((session, index) => (
							<tr key={index} className="border-b">
								<td className="border p-2 text-center">
									{new Date(session.date).toDateString()}
								</td>
								<td className="border p-2 text-center">
									{convertTo12HourFormat(session.startTime)} -{" "}
									{convertTo12HourFormat(session.endTime)}
								</td>
								<td className="border p-2 text-center">₹{session.price}</td>
								<td className="border p-2 text-center">
									<span
										className={`px-2 py-1 rounded ${
											session.isBooked
												? "bg-red-200 text-red-800"
												: "bg-green-200 text-green-800"
										}`}
									>
										{session.isBooked ? "Booked" : "Available"}
									</span>
								</td>
								<td className="border p-2 text-center">
									<button
										className={`px-4 py-2 rounded ${
											!session.isBooked
												? "bg-gradient-to-r from-[#1D2B6B] to-[#142057] hover:from-[#2A3F7E] hover:to-[#0A102E] text-white"
												: "bg-gray-300 text-gray-600 cursor-not-allowed"
										}`}
										onClick={() =>
											!session.isBooked && handleBookSession(session)
										}
										disabled={session.isBooked}
									>
										{session.isBooked ? "Booked" : "Book"}
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<div className="mt-4">
				<button
					className="px-4 py-2 bg-[#1D2B6B] text-white rounded-md"
					onClick={() => paginate(currentPage - 1)}
					disabled={currentPage === 1}
				>
					Previous
				</button>
				<button
					className="px-4 py-2 bg-[#1D2B6B] text-white rounded-md ml-2"
					onClick={() => paginate(currentPage + 1)}
					disabled={currentPage * sessionsPerPage >= filteredSlots.length}
				>
					Next
				</button>
			</div>
			<PaymentMethodModal />
			<PaymentModal />
			<SuccessMessage />
		</div>
	);
};

export default MenteeSingleMentorBody;
