import React from "react";
import { useFormik } from "formik";
import axios from "axios";
import { LOCALHOST_URL } from "../../../constants/constants";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { resetPasswordValidation } from "../../../validations/commonValidation";

const MenteeForgotPasswordResetBody: React.FC = () => {
	const [searchParams] = useSearchParams();
	const email = searchParams.get("email");
	const navigate = useNavigate();

	const formik = useFormik({
		initialValues: {
			newPassword: "",
			confirmPassword: "",
		},
		validationSchema: resetPasswordValidation,
		onSubmit: async (values, { setSubmitting }) => {
			try {
				const response = await axios.post(
					`${LOCALHOST_URL}/api/mentees/reset-password-reset`,
					{
						email,
						values,
					}
				);
				if (response.data.message == "Success") {
					toast.success("Password changed successfully.");
					navigate("/login");
				}
			} catch (error) {
				toast.error("An error occurred. Please try again.");
			} finally {
				setSubmitting(false);
			}
		},
	});

	return (
		<div className="flex justify-center items-center w-full h-screen bg-gray-100">
			<div className="flex bg-white rounded-lg shadow-lg w-[700px] h-auto max-h-[800px] overflow-hidden">
				<div className="flex-shrink-0 w-1/2 bg-blue-200 flex items-center justify-center">
					<img
						src="/images/loginimg.jpg"
						alt="Reset Password"
						className="object-cover w-full h-full"
					/>
				</div>
				<div className="flex-1 p-6 flex flex-col justify-between">
					<div>
						<h2 className="text-3xl font-bold mb-6 text-gray-800">
							Reset Password
						</h2>
						<form className="space-y-4" onSubmit={formik.handleSubmit}>
							<div>
								<label
									htmlFor="newPassword"
									className="block text-sm font-semibold text-gray-800 mb-2"
								>
									New Password
								</label>
								<input
									id="newPassword"
									name="newPassword"
									type="password"
									value={formik.values.newPassword}
									onBlur={formik.handleBlur}
									onChange={formik.handleChange}
									className="block w-full sm:w-[250px] p-1 text-sm border border-gray-300 rounded-md shadow-sm bg-transparent placeholder-gray-500 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
									placeholder="Enter new password"
								/>
								{formik.touched.newPassword && formik.errors.newPassword && (
									<small className="text-red-500">
										{formik.errors.newPassword}
									</small>
								)}
							</div>
							<div>
								<label
									htmlFor="confirmPassword"
									className="block text-sm font-semibold text-gray-800 mb-2"
								>
									Confirm Password
								</label>
								<input
									id="confirmPassword"
									name="confirmPassword"
									type="password"
									value={formik.values.confirmPassword}
									onBlur={formik.handleBlur}
									onChange={formik.handleChange}
									className="block w-full sm:w-[250px] p-1 text-sm border border-gray-300 rounded-md shadow-sm bg-transparent placeholder-gray-500 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
									placeholder="Confirm new password"
								/>
								{formik.touched.confirmPassword &&
									formik.errors.confirmPassword && (
										<small className="text-red-500">
											{formik.errors.confirmPassword}
										</small>
									)}
							</div>
							<button
								type="submit"
								className={`w-full py-2 px-4 ${
									formik.isSubmitting
										? "bg-gray-400"
										: "bg-custom-cyan hover:bg-cyan-200"
								} text-white rounded-md shadow-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
								disabled={formik.isSubmitting}
							>
								{formik.isSubmitting
									? "Resetting Password..."
									: "Reset Password"}
							</button>
						</form>
					</div>
					<div className="mt-6 text-center text-sm text-gray-700">
						<p>
							Remembered your password?{" "}
							<a href="/login" className="text-blue-400 hover:underline ml-1">
								Login
							</a>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MenteeForgotPasswordResetBody;
