

import React, { useState } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { mentorLogin } from '../../../redux/mentorSlice';
import { useNavigate } from 'react-router-dom';
import { LOCALHOST_URL } from '../../../constants/constants';
import { signInValidation } from '../../../validations/commonValidation';

const MentorLoginBody: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: signInValidation,
        onSubmit: async (values) => {
            try {
                setLoading(true);
                const response = await axios.post(`${LOCALHOST_URL}/api/mentor/login`, values,{
                });
                console.log(response)
                if (response.data.message === 'Success') {
                    const accessToken = response.data.accessToken;
                    const refreshToken = response.data.refreshToken;
                    dispatch(mentorLogin({ accessToken, refreshToken }));
                    toast.success("Login successfully.");
                    navigate('/mentor/home');
                } else {
                    toast.error(response.data.message || 'An error occurred during login. Please try again.');
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
                    <h2 className="text-2xl font-bold mb-4">Mentor Login</h2>
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
                        <div className="mb-6">
                            <label htmlFor="password" className="block text-gray-700">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="w-full p-2 border border-gray-300 rounded"
                                placeholder="Enter your password"
                            />
                            {formik.touched.password && formik.errors.password && (
                                <div className="text-red-500 text-sm">{formik.errors.password}</div>
                            )}
                        </div>
                        <button
                            type="submit"
                            className={`w-full py-2 rounded-md text-white font-bold transition-colors ${
                                loading ? 'bg-gray-400' : 'bg-purple-400 hover:bg-purple-600'
                            }`}
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                    <div className="flex flex-col items-center mt-4 space-y-2">
                        <a href="/mentor/forgot-password" className="text-sm text-blue-500 hover:underline">
                            Forgot Password?
                        </a>
                        <a href="/mentor/register" className="text-sm text-blue-500 hover:underline">
                            Register
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MentorLoginBody;
