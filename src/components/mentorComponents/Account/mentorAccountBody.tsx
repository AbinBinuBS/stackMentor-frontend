import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import apiClient from "../../../services/apiClient";
import { LOCALHOST_URL } from "../../../constants/constants";
import { MentorVerification } from "../../../interfaces/mentorInterfaces";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import {
	editProfileValidation,
	passwordValidationSchema,
} from "../../../validations/mentorValidation";
import { useNavigate } from "react-router-dom";

const MentorAccountBody: React.FC = () => {
	const [mentorData, setMentorData] = useState<MentorVerification | null>(null);
	const [showPasswordFields, setShowPasswordFields] = useState(false);
	const [showOldPassword, setShowOldPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
	const [ismentorAllowed, setIsMentorAllowed] = useState<boolean>();
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();
	const fetchData = async () => {
		try {
			const response = await apiClient.get(
				`${LOCALHOST_URL}/api/mentor/getmentorData`
			);
			await new Promise((resolve) => setTimeout(resolve, 1000));
			setLoading(false);
			setIsMentorAllowed(true);
			setMentorData(response.data);
		} catch (error) {
			if (error instanceof Error) {
				if (
					error.message ===
					"Mentor is not verified. Please complete the verification process."
				) {
					setIsMentorAllowed(false);
					setLoading(false);
				} else {
					toast.error(error.message);
				}
			} else {
				toast.error("unable to fetch data.");
			}
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const formik = useFormik({
		initialValues: {
			name: mentorData?.name || "",
			image: null as File | null,
		},
		validationSchema: editProfileValidation,
		enableReinitialize: true,
		onSubmit: async (values) => {
			try {
				const formData = new FormData();
				formData.append("name", values.name);
				if (values.image instanceof File) {
					formData.append("image", values.image);
				}

				const response = await apiClient.put(
					`${LOCALHOST_URL}/api/mentor/editProfile`,
					formData,
					{
						headers: {
							"Content-Type": "multipart/form-data",
						},
					}
				);
				if (response.data.message === "Success") {
					toast.success("Profile updated successfully");
					fetchData();
				} else {
					toast.error("Something unexpected happened. Please try again later.");
				}
			} catch (error) {
				toast.error("An error occurred while updating the profile.");
			}
		},
	});

	const passwordFormik = useFormik({
		initialValues: {
			oldPassword: "",
			newPassword: "",
			confirmNewPassword: "",
		},
		validationSchema: passwordValidationSchema,
		onSubmit: async (values) => {
			try {
				const response = await apiClient.put(
					`${LOCALHOST_URL}/api/mentor/changePassword`,
					{
						oldPassword: values.oldPassword,
						newPassword: values.newPassword,
					}
				);

				if (response.data.message === "Success") {
					toast.success("Password changed successfully");
					setShowPasswordFields(false);
					passwordFormik.resetForm();
				} else {
					toast.error("Failed to change password. Please try again.");
				}
			} catch (error: unknown) {
				if (axios.isAxiosError(error) && error.response?.data?.message) {
					if (error.response.data.message === "old password don't match") {
						toast.error("Old password doesn't match");
					} else {
						toast.error("An error occurred while changing the password.");
					}
				} else {
					toast.error("An unexpected error occurred.");
				}
			}
		},
	});

	const togglePasswordFields = () => {
		setShowPasswordFields(!showPasswordFields);
		if (!showPasswordFields) {
			passwordFormik.resetForm();
		}
	};

	const togglePasswordVisibility = (field: string) => {
		switch (field) {
			case "oldPassword":
				setShowOldPassword(!showOldPassword);
				break;
			case "newPassword":
				setShowNewPassword(!showNewPassword);
				break;
			case "confirmNewPassword":
				setShowConfirmNewPassword(!showConfirmNewPassword);
				break;
		}
	};

	if (loading) {
		return (
			<div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
				<p className="mt-4 text-lg font-semibold text-gray-700">Loading...</p>
			</div>
		);
	}

	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
			{ismentorAllowed ? (
				<div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
					<h2 className="text-xl font-semibold text-center mb-4">
						Account Settings
					</h2>

					<div className="mb-6">
						<div className="text-center mb-4">
							<div className="relative w-24 h-24 mx-auto mb-2">
								<img
									src={
										formik.values.image instanceof File
											? URL.createObjectURL(formik.values.image)
											: mentorData?.image
									}
									alt="Profile"
									className="w-full h-full rounded-full object-cover shadow-sm"
								/>
								<input
									type="file"
									id="image"
									accept="image/*"
									onChange={(event) => {
										const file = event.currentTarget.files?.[0] || null;
										formik.setFieldValue("image", file);
									}}
									className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
								/>
							</div>
							<label htmlFor="image" className="text-sm text-gray-600">
								Profile Picture
							</label>
							{formik.errors.image && formik.touched.image && (
								<div className="text-red-500 text-xs mt-1">
									{formik.errors.image as string}
								</div>
							)}
						</div>

						<form onSubmit={formik.handleSubmit} className="space-y-4">
							<div>
								<label
									htmlFor="name"
									className="block text-sm font-medium text-gray-700 mb-1"
								>
									Name
								</label>
								<input
									type="text"
									id="name"
									{...formik.getFieldProps("name")}
									className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
								/>
								{formik.errors.name && formik.touched.name && (
									<div className="text-red-500 text-xs mt-1">
										{formik.errors.name}
									</div>
								)}
							</div>

							<div>
								<label
									htmlFor="email"
									className="block text-sm font-medium text-gray-700 mb-1"
								>
									Email
								</label>
								<input
									type="email"
									id="email"
									value={mentorData?.mentorId.email || ""}
									readOnly
									className="w-full px-3 py-2 border rounded-md text-sm bg-gray-100 cursor-not-allowed"
								/>
							</div>

							<div>
								<button
									type="submit"
									className="w-full px-4 py-2 text-sm text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none"
								>
									Save Profile Changes
								</button>
							</div>
						</form>
					</div>

					<div className="border-t pt-4">
						<button
							onClick={togglePasswordFields}
							className="w-full px-4 py-2 text-sm text-purple-600 border border-purple-600 rounded-md hover:bg-purple-50 focus:outline-none mb-4"
						>
							{showPasswordFields
								? "Cancel Password Change"
								: "Change Password"}
						</button>

						{showPasswordFields && (
							<form
								onSubmit={passwordFormik.handleSubmit}
								className="space-y-4"
							>
								<div className="relative">
									<label
										htmlFor="oldPassword"
										className="block text-sm font-medium text-gray-700 mb-1"
									>
										Old Password
									</label>
									<input
										type={showOldPassword ? "text" : "password"}
										id="oldPassword"
										{...passwordFormik.getFieldProps("oldPassword")}
										className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10"
										placeholder="Enter old password"
									/>
									<button
										type="button"
										onClick={() => togglePasswordVisibility("oldPassword")}
										className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 mt-6"
									>
										{showOldPassword ? (
											<EyeOff className="h-5 w-5 text-gray-400" />
										) : (
											<Eye className="h-5 w-5 text-gray-400" />
										)}
									</button>
									{passwordFormik.touched.oldPassword &&
										passwordFormik.errors.oldPassword && (
											<div className="text-red-500 text-xs mt-1">
												{passwordFormik.errors.oldPassword}
											</div>
										)}
								</div>
								<div className="relative">
									<label
										htmlFor="newPassword"
										className="block text-sm font-medium text-gray-700 mb-1"
									>
										New Password
									</label>
									<input
										type={showNewPassword ? "text" : "password"}
										id="newPassword"
										{...passwordFormik.getFieldProps("newPassword")}
										className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10"
										placeholder="Enter new password"
									/>
									<button
										type="button"
										onClick={() => togglePasswordVisibility("newPassword")}
										className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 mt-6"
									>
										{showNewPassword ? (
											<EyeOff className="h-5 w-5 text-gray-400" />
										) : (
											<Eye className="h-5 w-5 text-gray-400" />
										)}
									</button>
									{passwordFormik.touched.newPassword &&
										passwordFormik.errors.newPassword && (
											<div className="text-red-500 text-xs mt-1">
												{passwordFormik.errors.newPassword}
											</div>
										)}
								</div>
								<div className="relative">
									<label
										htmlFor="confirmNewPassword"
										className="block text-sm font-medium text-gray-700 mb-1"
									>
										Confirm New Password
									</label>
									<input
										type={showConfirmNewPassword ? "text" : "password"}
										id="confirmNewPassword"
										{...passwordFormik.getFieldProps("confirmNewPassword")}
										className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10"
										placeholder="Confirm new password"
									/>
									<button
										type="button"
										onClick={() =>
											togglePasswordVisibility("confirmNewPassword")
										}
										className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 mt-6"
									>
										{showConfirmNewPassword ? (
											<EyeOff className="h-5 w-5 text-gray-400" />
										) : (
											<Eye className="h-5 w-5 text-gray-400" />
										)}
									</button>
									{passwordFormik.touched.confirmNewPassword &&
										passwordFormik.errors.confirmNewPassword && (
											<div className="text-red-500 text-xs mt-1">
												{passwordFormik.errors.confirmNewPassword}
											</div>
										)}
								</div>
								<div>
									<button
										type="submit"
										className="w-full px-4 py-2 text-sm text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none"
									>
										Save Password Changes
									</button>
								</div>
							</form>
						)}
					</div>
				</div>
			) : (
				<div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-center">
					<h2 className="text-xl font-semibold text-red-600 mb-4">
						You are not verified
					</h2>
					<p className="text-gray-700 mb-4">Please verify yourself.</p>
					<button
						onClick={() => {
							navigate("/mentor/home");
						}}
						className="px-4 py-2 text-sm text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none"
					>
						Go Back to Home
					</button>
				</div>
			)}
		</div>
	);
};

export default MentorAccountBody;
