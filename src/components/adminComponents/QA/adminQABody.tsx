import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { LOCALHOST_URL } from "../../../constants/constants";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import apiClientAdmin from "../../../services/apiClientAdmin";
import { IQuestion } from "../../../interfaces/IAdminInterface";

const AdminQABody: React.FC = () => {
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [selectedQuestion, setSelectedQuestion] = useState<IQuestion | null>(
		null
	);
	const [questions, setQuestions] = useState<IQuestion[]>([]);
	const [activeTab, setActiveTab] = useState<"unanswered" | "answered">(
		"unanswered"
	);
	const [editAnswerText, setEditAnswerText] = useState("");
	const [showAnswerIds, setShowAnswerIds] = useState<string[]>([]);

	useEffect(() => {
		fetchQuestions();
	}, []);

	const fetchQuestions = async () => {
		try {
			const { data } = await apiClientAdmin.get(
				`${LOCALHOST_URL}/api/admin/getAllQuestions`
			);
			setQuestions(data.questions);
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message);
			} else {
				toast.error("Something unexpected happened, please try again later.");
			}
		}
	};

	const handleEditClick = (question: IQuestion) => {
		setSelectedQuestion(question);
		setEditAnswerText(question.reply || "");
		setIsEditModalOpen(true);
	};

	const handleEditSubmit = async (values: { answerText: string }) => {
		try {
			await apiClientAdmin.put(`${LOCALHOST_URL}/api/admin/editAnswer`, {
				questionId: selectedQuestion?._id,
				answer: values.answerText,
			});
			toast.success("Answer updated successfully!");
			setIsEditModalOpen(false);
			fetchQuestions();
		} catch (error) {
			toast.error("Failed to update the answer. Please try again.");
		}
	};

	const handleRemoveQuestion = async (questionId: string) => {
		const result = await Swal.fire({
			title: "Are you sure?",
			text: "You won't be able to revert this!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Yes, delete it!",
		});

		if (result.isConfirmed) {
			try {
				await apiClientAdmin.delete(
					`${LOCALHOST_URL}/api/admin/removeQuestion/${questionId}`
				);
				Swal.fire("Deleted!", "The question has been removed.", "success");
				fetchQuestions();
			} catch (error) {
				Swal.fire(
					"Error!",
					"Failed to remove the question. Please try again.",
					"error"
				);
			}
		}
	};

	const toggleShowAnswer = (questionId: string) => {
		setShowAnswerIds((prev) =>
			prev.includes(questionId)
				? prev.filter((id) => id !== questionId)
				: [...prev, questionId]
		);
	};

	const validationSchema = Yup.object({
		answerText: Yup.string()
			.min(150, "Answer must be at least 150 characters long")
			.required("Answer is required"),
	});

	const filteredQuestions =
		activeTab === "unanswered"
			? questions.filter((q) => !q.isAnswered)
			: questions.filter((q) => q.isAnswered);

	return (
		<div className="bg-white rounded-lg shadow-md p-4 max-w-2xl mx-auto h-[500px] flex flex-col">
			<h2 className="text-lg font-semibold mb-3">Admin Q&A Section</h2>

			<div className="mb-4">
				<button
					className={`px-4 py-2 mr-2 ${
						activeTab === "unanswered"
							? "bg-purple-600 text-white"
							: "bg-gray-200"
					} rounded-md focus:outline-none`}
					onClick={() => setActiveTab("unanswered")}
				>
					Unanswered
				</button>
				<button
					className={`px-4 py-2 ${
						activeTab === "answered"
							? "bg-purple-600 text-white"
							: "bg-gray-200"
					} rounded-md focus:outline-none`}
					onClick={() => setActiveTab("answered")}
				>
					Answered
				</button>
			</div>

			<div className="overflow-y-auto flex-grow">
				<div className="space-y-3">
					{filteredQuestions.map((question) => (
						<div
							key={question._id}
							className="border border-gray-200 rounded-md p-3"
						>
							<h3 className="text-md font-medium mb-1">{question.title}</h3>
							<p className="text-sm text-gray-600 mb-2 line-clamp-2">
								{question.body}
							</p>

							{question.isAnswered && activeTab === "answered" && (
								<div>
									<button
										onClick={() => toggleShowAnswer(question._id)}
										className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mr-2"
									>
										{showAnswerIds.includes(question._id)
											? "Hide Answer"
											: "Show Answer"}
									</button>
									{showAnswerIds.includes(question._id) && (
										<p className="text-sm text-green-600 my-2">
											Answer: {question.reply}
										</p>
									)}
									<button
										onClick={() => handleEditClick(question)}
										className="px-3 py-1 text-xs bg-yellow-600 text-white rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 mr-2"
									>
										Edit
									</button>
									<button
										onClick={() => handleRemoveQuestion(question._id)}
										className="px-3 py-1 text-xs bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
									>
										Remove
									</button>
								</div>
							)}

							{activeTab === "unanswered" && (
								<button
									onClick={() => handleRemoveQuestion(question._id)}
									className="px-3 py-1 text-xs bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
								>
									Remove
								</button>
							)}
						</div>
					))}
				</div>
			</div>

			{isEditModalOpen && selectedQuestion && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
					<div className="bg-white rounded-lg p-4 w-full max-w-md">
						<h2 className="text-lg font-semibold mb-2">
							{selectedQuestion?.title}
						</h2>
						<p className="text-sm text-gray-600 mb-3">
							{selectedQuestion?.body}
						</p>

						<Formik
							initialValues={{ answerText: editAnswerText }}
							validationSchema={validationSchema}
							onSubmit={handleEditSubmit}
						>
							{({ isSubmitting }) => (
								<Form>
									<div>
										<Field
											name="answerText"
											as="textarea"
											placeholder="Edit your answer here..."
											className="w-full h-24 p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 mb-3"
										/>
										<ErrorMessage
											name="answerText"
											component="div"
											className="text-red-500 text-xs"
										/>
									</div>

									<div className="flex justify-end space-x-2">
										<button
											type="button"
											onClick={() => setIsEditModalOpen(false)}
											className="px-3 py-1 text-xs border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-500"
										>
											Cancel
										</button>
										<button
											type="submit"
											className="px-3 py-1 text-xs bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
											disabled={isSubmitting}
										>
											Update Answer
										</button>
									</div>
								</Form>
							)}
						</Formik>
					</div>
				</div>
			)}
		</div>
	);
};

export default AdminQABody;
