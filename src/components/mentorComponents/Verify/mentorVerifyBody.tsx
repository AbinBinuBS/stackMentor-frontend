import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios, { AxiosRequestConfig } from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { LOCALHOST_URL } from "../../../constants/constants";
import { mentorVerifyValidation } from "../../../validations/mentorValidation";
import { MentorVerifyFormValues } from "../../../interfaces/mentorInterfaces";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import MentorVerifySuccessBody from "./mentorVerifySuccessBody";
import apiClient from "../../../services/apiClient";

const MentorVerifyBody: React.FC = () => {
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const { accessToken } = useSelector((state: RootState) => state.mentor);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);

    const initialValues: MentorVerifyFormValues = {
        name: "",
        dateOfBirth: "",
        image: null,
        about: "",
        degree: "",
        college: "",
        yearOfGraduation: "",
        jobTitle: "",
        lastWorkedCompany: "",
        yearsOfExperience: "",
        stack: "",
        resume: null,
        degreeCertificate: null,
        experienceCertificate: null,
    };

    const handleSubmit = async (
        values: MentorVerifyFormValues,
        { setSubmitting }: any
    ) => {
        if (currentStep < 4) {
            setCurrentStep((prevStep) => prevStep + 1);
            setSubmitting(false);
        } else {
            setLoading(true);
            const formData = new FormData();
            Object.entries(values).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    formData.append(key, value as Blob | string);
                }
            });

            try {
                const config: AxiosRequestConfig = {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${accessToken}`,
                    },
                };

                const response = await apiClient.post(
                    `${LOCALHOST_URL}/api/mentor/verify-mentor`,
                    formData,
                    config
                );
                if (response.data.message === "Verification complete") {
                    toast.success(
                        response.data.message || "Verification submitted successfully."
                    );
                    setIsSuccess(true);
                } else {
                    toast.error(
                        response.data.message || "An error occurred. Please try again."
                    );
                }
            } catch (error: any) {
                if (error instanceof Error) {
                    if (error.message == "Request failed with status code 403") {
                        toast.error("Mentor should be verified");
                    } else {
                        toast.error(error.message);
                    }
                }
            } finally {
                setLoading(false);
                setSubmitting(false);
            }
        }
    };

    if (isSuccess) {
        return <MentorVerifySuccessBody mentorData={"applied"} />;
    }

    const renderInputField = (
        name: string,
        label: string,
        type: string = "text"
    ) => (
        <div className="mb-2">
            <label
                htmlFor={name}
                className="block text-xs font-medium text-gray-700 mb-1"
            >
                {label}
            </label>
            <Field
                type={type}
                id={name}
                name={name}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
            <ErrorMessage
                name={name}
                component="div"
                className="text-red-500 text-xs mt-1"
            />
        </div>
    );

    const renderFileInput = (name: string, label: string) => (
        <div className="mb-2">
            <label
                htmlFor={name}
                className="block text-xs font-medium text-gray-700 mb-1"
            >
                {label}
            </label>
            <Field name={name}>
                {({ form }: any) => (
                    <input
                        type="file"
                        id={name}
                        onChange={(event) => {
                            const file = event.currentTarget.files
                                ? event.currentTarget.files[0]
                                : null;
                            form.setFieldValue(name, file);
                        }}
                        className="w-full text-xs text-gray-500 file:mr-4 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                    />
                )}
            </Field>
            <ErrorMessage
                name={name}
                component="div"
                className="text-red-500 text-xs mt-1"
            />
        </div>
    );

    const renderTextareaField = (name: string, label: string) => (
        <div className="mb-2">
            <label
                htmlFor={name}
                className="block text-xs font-medium text-gray-700 mb-1"
            >
                {label}
            </label>
            <Field
                as="textarea"
                id={name}
                name={name}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                rows={4}
            />
            <ErrorMessage
                name={name}
                component="div"
                className="text-red-500 text-xs mt-1"
            />
        </div>
    );

    const formSections = [
        {
            title: "Personal Info",
            fields: [
                renderInputField("name", "Name"),
                renderInputField("dateOfBirth", "Date of Birth", "date"),
                renderFileInput("image", "Profile Image"),
                renderTextareaField("about", "About"),
            ],
        },
        {
            title: "Education",
            fields: ["degree", "college", "yearOfGraduation"].map((field) =>
                renderInputField(
                    field,
                    field.charAt(0).toUpperCase() +
                        field.slice(1).replace(/([A-Z])/g, " $1"),
                    field === "yearOfGraduation" ? "number" : "text"
                )
            ),
        },
        {
            title: "Experience",
            fields: [
                "jobTitle",
                "lastWorkedCompany",
                "yearsOfExperience",
                "stack",
            ].map((field) =>
                renderInputField(
                    field,
                    field.charAt(0).toUpperCase() +
                        field.slice(1).replace(/([A-Z])/g, " $1"),
                    field === "yearsOfExperience" ? "number" : "text"
                )
            ),
        },
        {
            title: "Documents",
            fields: ["resume", "degreeCertificate", "experienceCertificate"].map(
                (field) =>
                    renderFileInput(
                        field,
                        field.charAt(0).toUpperCase() +
                            field.slice(1).replace(/([A-Z])/g, " $1")
                    )
            ),
        },
    ];

    return (
        <div className="max-w-3xl mx-auto p-6 mt-24 bg-white rounded-2xl shadow-lg">
            <h1 className="text-2xl font-bold text-center text-purple-600 mb-6">
                Mentor Verification
            </h1>
            <div className="flex justify-center mb-8 relative">
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -z-10"></div>
                {[1, 2, 3, 4].map((step) => (
                    <div key={step} className="relative px-4">
                        <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                currentStep >= step
                                    ? "bg-purple-600 text-white"
                                    : "bg-gray-200 text-gray-600"
                            }`}
                        >
                            {step}
                        </div>
                        <div
                            className={`mt-2 text-xs ${
                                currentStep === step ? "font-bold" : "text-gray-500"
                            }`}
                        >
                            {formSections[step - 1].title}
                        </div>
                        {step < 4 && (
                            <div
                                className={`absolute top-1/2 left-[calc(50%+20px)] right-0 h-0.5 -z-10 ${
                                    currentStep > step ? "bg-purple-600" : "bg-gray-200"
                                }`}
                            ></div>
                        )}
                    </div>
                ))}
            </div>
            <Formik
                initialValues={initialValues}
                validationSchema={mentorVerifyValidation[currentStep - 1]}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-xl">
                            <h2 className="text-lg font-semibold text-gray-800 mb-3">
                                {formSections[currentStep - 1].title}
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                {formSections[currentStep - 1].fields}
                            </div>
                        </div>
                        <div className="flex justify-between mt-4">
                            {currentStep > 1 && (
                                <button
                                    type="button"
                                    onClick={() => setCurrentStep((prevStep) => prevStep - 1)}
                                    className="w-12 h-12 flex items-center justify-center bg-gray-500 text-white rounded-full hover:bg-gray-600 transition duration-200"
                                >
                                    &lt;
                                </button>
                            )}
                            <button
                                type="submit"
                                disabled={isSubmitting || loading}
                                className="w-12 h-12 flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white rounded-full transition duration-200"
                            >
                                {loading ? (
                                    <svg
                                        className="w-6 h-6 text-white animate-spin"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    >
                                        <path
                                            d="M12 22a10 10 0 1 0-10-10 10.011 10.011 0 0 0 10 10z"
                                            fill="none"
                                        />
                                        <path
                                            d="M12 2a10 10 0 0 0-9.4 5.1 2 2 0 0 0 0 1.8A10.013 10.013 0 0 0 12 22a9.95 9.95 0 0 0 4.9-1.3 2 2 0 0 0 0-1.8A10.009 10.009 0 0 0 12 2z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                ) : (
                                    ">"
                                )}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default MentorVerifyBody;
