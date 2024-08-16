import React, { useState } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { LOCALHOST_URL } from '../../../constants/constants';
import { forgotPasswordValidation } from '../../../validations/commonValidation'; // Assuming you have a validation schema for forgot password

const MentorForgotPasswordEmailBody: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema: forgotPasswordValidation,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                const response = await axios.post(`${LOCALHOST_URL}/api/mentor/forgot-password`, values);
                if (response.data.message === 'Email sent successfully') {
                    toast.success('Password reset link sent to your email.');
                    navigate('/mentor/login');
                } else {
                    toast.error(response.data.message || 'Failed to send password reset link.');
                }
            } catch (error: any) {
                if (axios.isAxiosError(error)) {
                    const message = error.response?.data?.message;
                    toast.error(message || 'An unexpected error occurred. Please try again.');
                } else {
                    toast.error('An unexpected error occurred. Please try again.');
                }
                console.error(error);
            } finally {
                setLoading(false);
            }
        },
    });

    return (
        <div className="flex items-center justify-start w-full lg:w-3/5 h-screen bg-gray-100">
            <div className="relative flex flex-col items-center justify-center w-4/5 h-4/5 shadow-2xl rounded-r-lg p-6 bg-white">
                <div className="flex flex-col items-center justify-center w-full max-w-sm">
                    <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>
                    <form onSubmit={formik.handleSubmit} className="space-y-4 w-full">
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-700">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="w-full p-2 border border-gray-300 rounded"
                                placeholder="Enter your email"
                            />
                            {formik.touched.email && formik.errors.email && (
                                <div className="text-red-500 text-sm">{formik.errors.email}</div>
                            )}
                        </div>
                        <button
                            type="submit"
                            className={`w-full py-2 rounded-md text-white font-bold transition-colors ${
                                loading ? 'bg-gray-400' : 'bg-purple-400 hover:bg-purple-600'
                            }`}
                            disabled={loading}
                        >
                            {loading ? 'Sending...' : 'Send Password Reset Link'}
                        </button>
                    </form>
                    <div className="flex flex-col items-center mt-4 space-y-2">
                        <a href="/mentor" className="text-sm text-blue-500 hover:underline">
                            Back to Login
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MentorForgotPasswordEmailBody;