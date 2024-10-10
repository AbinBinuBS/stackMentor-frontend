import { useFormik } from "formik";
import { timeSheduleValidation } from "../../../validations/mentorValidation";
import toast from "react-hot-toast";
import { LOCALHOST_URL } from "../../../constants/constants";
import moment from "moment";
import apiClient from "../../../services/apiClient";

const MentorSheduleTimeBody = () => {
	const formik = useFormik({
		initialValues: {
			date: "",
			startTime: "",
			endTime: "",
			price: "",
		},
		validationSchema: timeSheduleValidation,
		onSubmit: async (values, { resetForm }) => {
			try {
				const formData = new FormData();
				formData.append("date", values.date);

				const formattedStartTime = moment(values.startTime, "HH:mm").format(
					"HH:mm"
				);
				const formattedEndTime = moment(values.endTime, "HH:mm").format(
					"HH:mm"
				);

				formData.append("startTime", formattedStartTime);
				formData.append("endTime", formattedEndTime);
				formData.append("price", values.price);

				const response = await apiClient.post(
					`${LOCALHOST_URL}/api/mentor/scheduleTime`,
					formData
				);
				if (response.data.message === "Time scheduled successfully.") {
					toast.success(
						response.data.message || "Time scheduled successfully."
					);
					resetForm();
				} else {
					toast.error(
						response.data.message ||
							"An unexpected error has occurred. Please try again."
					);
				}
			} catch (error) {
				if (error instanceof Error) {
					if (error.message == "Request failed with status code 409") {
						toast.error(
							"The time slot can't be booked because you already booked time on the provided time."
						);
					} else if (
						error.message ===
						"Mentor is not verified. Please complete the verification process."
					) {
						toast.error(
							"Mentor is not verified. Please complete the verification process."
						);
					} else {
						toast.error("An unexpected error has occurred. Please try again.");
					}
				} else {
					toast.error("An unexpected error has occurred. Please try again.");
				}
			}
		},
	});

	return (
		<div className="container mx-auto my-auto px-4 py-8">
			<div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
				<h2 className="text-xl font-semibold text-center mb-4">
					Schedule Date and Time
				</h2>
				<form onSubmit={formik.handleSubmit} className="space-y-3">
					<div>
						<label
							htmlFor="date"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Date
						</label>
						<input
							type="date"
							id="date"
							{...formik.getFieldProps("date")}
							className={`w-full px-3 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-purple-500 ${
								formik.touched.date && formik.errors.date
									? "border-red-500"
									: ""
							}`}
						/>
						{formik.touched.date && formik.errors.date && (
							<div className="text-red-500 text-xs mt-1">
								{formik.errors.date}
							</div>
						)}
					</div>

					<div className="flex space-x-2">
						<div className="flex-1">
							<label
								htmlFor="startTime"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Start Time
							</label>
							<input
								type="time"
								id="startTime"
								{...formik.getFieldProps("startTime")}
								className={`w-full px-3 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-purple-500 ${
									formik.touched.startTime && formik.errors.startTime
										? "border-red-500"
										: ""
								}`}
							/>
							{formik.touched.startTime && formik.errors.startTime && (
								<div className="text-red-500 text-xs mt-1">
									{formik.errors.startTime}
								</div>
							)}
						</div>
						<div className="flex-1">
							<label
								htmlFor="endTime"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								End Time
							</label>
							<input
								type="time"
								id="endTime"
								{...formik.getFieldProps("endTime")}
								className={`w-full px-3 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-purple-500 ${
									formik.touched.endTime && formik.errors.endTime
										? "border-red-500"
										: ""
								}`}
							/>
							{formik.touched.endTime && formik.errors.endTime && (
								<div className="text-red-500 text-xs mt-1">
									{formik.errors.endTime}
								</div>
							)}
						</div>
					</div>

					<div>
						<label
							htmlFor="price"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Price (USD)
						</label>
						<input
							type="number"
							id="price"
							{...formik.getFieldProps("price")}
							className={`w-full px-3 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-purple-500 ${
								formik.touched.price && formik.errors.price
									? "border-red-500"
									: ""
							}`}
							placeholder="Enter price"
						/>
						{formik.touched.price && formik.errors.price && (
							<div className="text-red-500 text-xs mt-1">
								{formik.errors.price}
							</div>
						)}
					</div>

					<div className="flex justify-center mt-4">
						<button
							type="submit"
							className="px-4 py-2 text-sm text-white bg-purple-600 rounded-full hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
						>
							Save Schedule
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default MentorSheduleTimeBody;
