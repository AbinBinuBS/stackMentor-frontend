import React, { useState } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import { LOCALHOST_URL } from '../../../constants/constants';
import { useDispatch } from 'react-redux';
import { adminLogin } from '../../../redux/adminSlice';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { signInValidation } from '../../../validations/commonValidation';

const AdminLoginBody: React.FC = () => {
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
            setLoading(true);
            try {
                const response = await axios.post(`${LOCALHOST_URL}/api/admin/login`, values);
                if (response.data.message === 'Success') {
                    const accessToken = response.data.accessToken;
                    const refreshToken = response.data.refreshToken;
                    dispatch(adminLogin({ accessToken, refreshToken }));
                    toast.success("Login successfully.");
                    navigate('/admin/dashboard');
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
        <div className="flex items-center justify-start w-3/5 h-screen bg-gray-100">
            <div className="relative flex flex-col items-center justify-center w-4/5 h-4/5 shadow-2xl rounded-r-lg p-6 bg-white">
                <div className="flex flex-col items-center justify-center w-full max-w-sm">
                    <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Admin Portal</h2>
                    <form onSubmit={formik.handleSubmit} className="space-y-4 w-full">
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-700">Email</label>
                            <input
                                type="text"
                                name="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Enter your email"
                                className="w-full p-2 border border-gray-300 rounded bg-gray-100 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            {formik.touched.email && formik.errors.email && (
                                <div className="text-red-500 text-sm">{formik.errors.email}</div>
                            )}
                        </div>
                        <div className="mb-6">
                            <label htmlFor="password" className="block text-gray-700">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Enter your password"
                                className="w-full p-2 border border-gray-300 rounded bg-gray-100 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            {formik.touched.password && formik.errors.password && (
                                <div className="text-red-500 text-sm">{formik.errors.password}</div>
                            )}
                        </div>
                        <button
                            type="submit"
                            className={`w-full py-2 rounded-md text-black font-bold transition-colors ${
                                loading ? 'bg-gray-400' : 'bg-blue-100 hover:bg-blue-300'
                            }`}
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminLoginBody;
