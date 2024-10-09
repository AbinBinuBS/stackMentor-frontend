import { useFormik } from "formik";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { signupValidation } from "../../../validations/commonValidation";

const initialValues = {
	name: "",
	email: "",
	phone: "",
	password: "",
	confirmPassword: "",
};

const MenteeRegisterBody = () => {
	const navigate = useNavigate();
	const { values, handleBlur, handleChange, handleSubmit, errors } = useFormik({
		initialValues: initialValues,
		validationSchema: signupValidation,
		onSubmit: async (value) => {
			try {
				const response = await axios.post(
					"http://localhost:3001/api/mentees/register",
					value
				);
				if (response.data.message == "OTP Send Successfully") {
					toast.success("Otp has been send to your mail.");
					navigate(`/otp?email=${encodeURIComponent(value.email)}`);
				}
			} catch (error: any) {
				if (axios.isAxiosError(error)) {
					if (error.response?.status === 409) {
						toast.error("User already exists.");
					} else {
						toast.error(
							"An error occurred during registration. Please try again."
						);
					}
				} else {
					toast.error("An unexpected error occurred. Please try again.");
				}
				console.error(error);
			}
		},
	});

	return (
		<div className="flex justify-center items-center w-full h-screen bg-gray-100">
			<div className="flex bg-white rounded-lg shadow-lg w-[700px] h-auto max-h-[800px] overflow-hidden">
				<div className="flex-shrink-0 w-1/2 bg-blue-200 flex items-center justify-center">
					<img
						src="/images/loginimg.jpg"
						alt="Register"
						className="object-cover w-full h-full"
					/>
				</div>
				<div className="flex-1 p-6 flex flex-col justify-between">
					<div>
						<h2 className="text-3xl font-bold mb-6">Register</h2>
						<form className="space-y-4" onSubmit={handleSubmit}>
							<div>
								<label
									htmlFor="name"
									className="block text-sm font-semibold text-gray-800 mb-2"
								>
									Name
								</label>
								<input
									id="name"
									value={values.name}
									onChange={handleChange}
									onBlur={handleBlur}
									type="text"
									className="block w-full sm:w-[250px] p-1 text-sm border border-gray-300 rounded-md shadow-sm bg-transparent placeholder-gray-500 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
									placeholder="Enter your name"
								/>
								{errors.name && (
									<small className="text-red-500">{errors.name}</small>
								)}
							</div>
							<div>
								<label
									htmlFor="email"
									className="block text-sm font-semibold text-gray-800 mb-2"
								>
									Email
								</label>
								<input
									id="email"
									value={values.email}
									onChange={handleChange}
									onBlur={handleBlur}
									type="email"
									className="block w-full sm:w-[250px] p-1 text-sm border border-gray-300 rounded-md shadow-sm bg-transparent placeholder-gray-500 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
									placeholder="Enter your email"
								/>
								{errors.email && (
									<small className="text-red-500">{errors.email}</small>
								)}
							</div>
							<div>
								<label
									htmlFor="phone"
									className="block text-sm font-semibold text-gray-800 mb-2"
								>
									Phone Number
								</label>
								<input
									id="phone"
									value={values.phone}
									onChange={handleChange}
									onBlur={handleBlur}
									type="tel"
									className="block w-full sm:w-[250px] p-1 text-sm border border-gray-300 rounded-md shadow-sm bg-transparent placeholder-gray-500 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
									placeholder="Enter your phone number"
								/>
								{errors.phone && (
									<small className="text-red-500">{errors.phone}</small>
								)}
							</div>
							<div>
								<label
									htmlFor="password"
									className="block text-sm font-semibold text-gray-800 mb-2"
								>
									Password
								</label>
								<input
									id="password"
									value={values.password}
									onChange={handleChange}
									onBlur={handleBlur}
									type="password"
									className="block w-full sm:w-[250px] p-1 text-sm border border-gray-300 rounded-md shadow-sm bg-transparent placeholder-gray-500 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
									placeholder="Enter your password"
								/>
								{errors.password && (
									<small className="text-red-500">{errors.password}</small>
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
									value={values.confirmPassword}
									onChange={handleChange}
									onBlur={handleBlur}
									type="password"
									className="block w-full sm:w-[250px] p-1 text-sm border border-gray-300 rounded-md shadow-sm bg-transparent placeholder-gray-500 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
									placeholder="Confirm your password"
								/>
								{errors.confirmPassword && (
									<small className="text-red-500">
										{errors.confirmPassword}
									</small>
								)}
							</div>
							<button
								type="submit"
								className="w-full py-2 px-4 bg-custom-cyan text-white rounded-md shadow-md hover:bg-cyan-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
							>
								Register
							</button>
						</form>
					</div>
					<div className="mt-6 text-center text-sm text-gray-700">
						<p>
							Already have an account?{" "}
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

export default MenteeRegisterBody;
