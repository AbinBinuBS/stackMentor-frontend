import React from "react";
import { useNavigate } from "react-router-dom";

const MentorVerifySuccessBody: React.FC<{ mentorData: string }> = ({
	mentorData,
}) => {
	const navigate = useNavigate();

	const handleOkClick = () => {
		navigate("/mentor/home");
	};

	let message;
	let title;
	switch (mentorData) {
		case "applied":
			title = "Verification Request Sent";
			message =
				"Your verification request has been sent to the admin. Please wait for some time for your details to be verified.";
			break;
		case "verified":
			title = "Account Verified";
			message =
				"Congratulations! Your account has been verified. Welcome to our community.";
			break;
		case "rejected":
			title = "Verification Rejected";
			message =
				"Sorry to inform you that your verification request has been rejected. Please contact support for further details.";
			break;
		default:
			title = "Unknown Status";
			message = "Something went wrong. Please try again later.";
			break;
	}

	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-100">
			<div className="bg-white p-6 mt-24 rounded-2xl shadow-lg max-w-xl w-full text-center">
				<h2 className="text-2xl font-bold text-purple-600 mb-2">{title}</h2>
				<p className="text-gray-700 mb-6">{message}</p>
				<button
					onClick={handleOkClick}
					className="px-6 py-2 text-white bg-purple-600 rounded-full hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
				>
					OK
				</button>
			</div>
		</div>
	);
};

export default MentorVerifySuccessBody;
