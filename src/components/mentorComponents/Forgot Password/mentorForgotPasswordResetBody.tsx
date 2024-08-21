import React, { useState } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LOCALHOST_URL } from '../../../constants/constants';
import { resetPasswordValidation } from '../../../validations/commonValidation';

const MentorForgotPasswordResetBody: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email');
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            newPassword: '',
            confirmPassword: '',
        },
        validationSchema: resetPasswordValidation,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                const response = await axios.post(`${LOCALHOST_URL}/api/mentor/reset-password-reset`, {
                    email,
                    newPassword: values.newPassword,
                });
                if (response.data.message === "Success") {
                    toast.success("Password changed successfully.");
                    navigate('/mentor');
                } else {
                    toast.error(response.data.message || 'Failed to reset password');
                }
            } catch (error: any) {
                if (axios.isAxiosError(error)) {
                    const status = error.response?.status;
                    const message = error.response?.data?.message;
                    if (status === 400) {
                        toast.error(message || 'Bad request. Please check your input.');
                    } else if (status === 409) {
                        toast.error(message || 'Conflict. Please check your input.');
                    } else {
                        toast.error(message || 'An unexpected error occurred. Please try again.');
                    }
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
                    <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
                    <form onSubmit={formik.handleSubmit} className="space-y-4 w-full">
                        <div className="mb-4">
                            <label htmlFor="newPassword" className="block text-gray-700">New Password</label>
                            <input
                                id="newPassword"
                                name="newPassword"
                                type="password"
                                value={formik.values.newPassword}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="w-full p-2 border border-gray-300 rounded"
                                placeholder="Enter new password"
                            />
                            {formik.touched.newPassword && formik.errors.newPassword && (
                                <div className="text-red-500 text-sm">{formik.errors.newPassword}</div>
                            )}
                        </div>
                        <div className="mb-6">
                            <label htmlFor="confirmPassword" className="block text-gray-700">Confirm Password</label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                value={formik.values.confirmPassword}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="w-full p-2 border border-gray-300 rounded"
                                placeholder="Confirm new password"
                            />
                            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                                <div className="text-red-500 text-sm">{formik.errors.confirmPassword}</div>
                            )}
                        </div>
                        <button
                            type="submit"
                            className={`w-full py-2 rounded-md text-white font-bold transition-colors ${
                                loading ? 'bg-gray-400' : 'bg-purple-400 hover:bg-purple-600'
                            }`}
                            disabled={loading}
                        >
                            {loading ? 'Resetting Password...' : 'Reset Password'}
                        </button>
                    </form>
                    <div className="flex flex-col items-center mt-4 space-y-2">
                        <a href="/login" className="text-sm text-blue-500 hover:underline">
                            Back to Login
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MentorForgotPasswordResetBody;