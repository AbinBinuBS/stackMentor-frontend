import { useFormik } from "formik";
import { useState } from "react";
import axios from "axios";
import { LOCALHOST_URL } from "../../../constants/constants";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { forgotPasswordValidation } from "../../../validations/commonValidation";

const initialValues = {
	email: "",
};

const MenteeForgotPasswordBody = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState<boolean>(false);
	const { values, handleBlur, handleChange, handleSubmit, errors, touched } =
		useFormik({
			initialValues,
			validationSchema: forgotPasswordValidation,
			onSubmit: async (value) => {
				setLoading(true);
				try {
					const response = await axios.post(
						`${LOCALHOST_URL}/api/mentees/forgot-password`,
						value
					);
					if (
						response.data.message == "Password reset link sent to your email."
					) {
						toast.success("Otp send successfully.");
						navigate(
							`/forgot-password-otp?email=${encodeURIComponent(value.email)}`
						);
					}
				} catch (error) {
					toast.error("There is no account with this email.");
				} finally {
					setLoading(false);
				}
			},
		});

	return (
		<div className="flex justify-center items-center w-full h-screen bg-gray-100">
			<div className="flex bg-white rounded-lg shadow-lg w-[700px] h-auto max-h-[800px] overflow-hidden">
				<div className="flex-shrink-0 w-1/2 bg-blue-200 flex items-center justify-center">
					<img
						src="/images/loginimg.jpg"
						alt="Forgot Password"
						className="object-cover w-full h-full"
					/>
				</div>
				<div className="flex-1 p-6 flex flex-col justify-center">
					<div>
						<h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
							Forgot Password
						</h2>
						<form
							className="space-y-4 flex flex-col items-center"
							onSubmit={handleSubmit}
						>
							<div className="w-full sm:w-[250px]">
								<label
									htmlFor="email"
									className="block text-sm font-semibold text-gray-800 mb-2"
								>
									Email
								</label>
								<input
									id="email"
									value={values.email}
									onBlur={handleBlur}
									onChange={handleChange}
									type="email"
									placeholder="Enter your email"
									className="block w-full p-1 text-sm border border-gray-300 rounded-md shadow-sm bg-transparent placeholder-gray-500 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
								/>
								{touched.email && errors.email && (
									<small className="text-red-500">{errors.email}</small>
								)}
							</div>
							<button
								type="submit"
								className={`w-full sm:w-[250px] py-2 px-4 ${
									loading ? "bg-gray-400" : "bg-custom-cyan hover:bg-cyan-200"
								} text-white rounded-md shadow-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
								disabled={loading}
							>
								{loading ? "Processing..." : "Reset Password"}
							</button>
						</form>
					</div>
					<div className="mt-6 text-center text-sm text-gray-700">
						<p>
							Remembered your password??{" "}
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

export default MenteeForgotPasswordBody;
