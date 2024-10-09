import React from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import apiClientMentee from "../../../services/apiClientMentee";
import { LOCALHOST_URL } from "../../../constants/constants";
import toast from "react-hot-toast";
import { FormValues } from "../../../interfaces/ImenteeInferfaces";
import { validationSchema } from "../../../validations/commonValidation";

const AskQuestionBody: React.FC = () => {
	const initialValues: FormValues = {
		title: "",
		body: "",
	};

	const handleSubmit = async (
		values: FormValues,
		{ setSubmitting, resetForm }: FormikHelpers<FormValues>
	) => {
		try {
			const response = await apiClientMentee.post(
				`${LOCALHOST_URL}/api/mentees/qaQuestion`,
				values
			);
			if (response.data.message === "Success") {
				toast.success("Posted Successfully");
				resetForm();
			} else {
				toast.error("Something went wrong. Please try again later.");
			}
		} catch (error) {
			toast.error("An error occurred. Please try again later.");
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<Formik
			initialValues={initialValues}
			validationSchema={validationSchema}
			onSubmit={handleSubmit}
		>
			{({ isSubmitting }) => (
				<Form className="bg-gradient-to-br from-purple-100 to-indigo-100 shadow-lg rounded-xl max-w-2xl mx-auto p-6 space-y-4">
					<h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">
						Ask Your Question
					</h1>

					<div className="bg-white bg-opacity-70 p-2 rounded-lg shadow-inner">
						<p className="text-indigo-700 text-xs font-medium">
							Please review your question carefully before posting.
						</p>
					</div>

					<div className="space-y-3">
						<div>
							<label
								htmlFor="title"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Title
							</label>
							<Field
								type="text"
								id="title"
								name="title"
								className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
								placeholder="e.g. Which stack would be better for me"
							/>
							<ErrorMessage
								name="title"
								component="p"
								className="mt-1 text-xs text-red-600"
							/>
							<p className="text-xs text-gray-500 mt-1">
								Title must be at least 15 characters.
							</p>
						</div>

						<div>
							<label
								htmlFor="body"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Body
							</label>
							<Field
								as="textarea"
								id="body"
								name="body"
								rows={4}
								className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
								placeholder="Describe your question in detail... (min 220 characters)"
							/>
							<ErrorMessage
								name="body"
								component="p"
								className="mt-1 text-xs text-red-600"
							/>
						</div>
					</div>

					<button
						type="submit"
						disabled={isSubmitting}
						className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-2 px-4 rounded-md hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out text-sm"
					>
						{isSubmitting ? "Posting..." : "Post Your Question"}
					</button>
				</Form>
			)}
		</Formik>
	);
};

export default AskQuestionBody;
