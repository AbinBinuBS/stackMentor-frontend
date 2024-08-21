import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { LOCALHOST_URL } from '../../../constants/constants';

const MentorForgotPasswordBody: React.FC = () => {
    const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
    const [loading, setLoading] = useState<boolean>(false);
    const [timer, setTimer] = useState<number>(60);
    const [isTimerActive, setIsTimerActive] = useState<boolean>(true);
    const [isButtonEnabled, setIsButtonEnabled] = useState<boolean>(false);
    const navigate = useNavigate();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const email = query.get('email') || '';

    useEffect(() => {
        const storedTimer = localStorage.getItem('otpTimer');
        const storedIsTimerActive = localStorage.getItem('isTimerActive');
        if (storedTimer && storedIsTimerActive) {
            setTimer(parseInt(storedTimer));
            setIsTimerActive(storedIsTimerActive === 'true');
        } else {
            setTimer(60);
            setIsTimerActive(true);
            localStorage.setItem('otpTimer', '60');
            localStorage.setItem('isTimerActive', 'true');
        }

        let interval: NodeJS.Timeout | null = null;

        if (isTimerActive) {
            interval = setInterval(() => {
                setTimer((prevTimer) => {
                    const newTimer = prevTimer - 1;
                    localStorage.setItem('otpTimer', newTimer.toString());
                    if (newTimer <= 0) {
                        setIsTimerActive(false);
                        localStorage.setItem('isTimerActive', 'false');
                        clearInterval(interval!);
                    }
                    return newTimer;
                });
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isTimerActive]);

    useEffect(() => {
        const isFilled = otp.every(digit => digit !== '');
        setIsButtonEnabled(isFilled && isTimerActive);
    }, [otp, isTimerActive]);

    const handleOtpChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
        const { value } = e.target;
        if (/^\d*$/.test(value) && value.length <= 1) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            if (value && index < 5) {
                const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement;
                if (nextInput) nextInput.focus();
            }
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`) as HTMLInputElement;
            if (prevInput) {
                prevInput.focus();
                const newOtp = [...otp];
                newOtp[index - 1] = '';
                setOtp(newOtp);
            }
        }
    };

    const handleResendOtp = async () => {
        try {
            setTimer(60);
            setIsTimerActive(true);
            localStorage.setItem('otpTimer', '60');
            localStorage.setItem('isTimerActive', 'true');
            setOtp(['', '', '', '', '', '']);
            const response = await axios.post(`${LOCALHOST_URL}/api/mentor/resend-otp`, { email });
            if (response.data.message === "Resend otp is Successfull") {
                toast.success(response.data.message);
            }
        } catch (error) {
            setTimer(0);
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message;
                toast.error(message || 'An unexpected error occurred. Please try again.');
            } else {
                toast.error('Failed to resend OTP. Please try again.');
            }
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const otpString = otp.join('');
            const response = await axios.post(`${LOCALHOST_URL}/api/mentor/reset-password-verify-otp`, {
                email,
                otp: otpString,
            });
            if (response.data.message === 'OTP verified successfully') {
                toast.success(response.data.message);
                navigate(`/mentor/forgot-password-reset?email=${encodeURIComponent(response.data.email)}`); 
            } else {
                toast.error(response.data.message || 'Please enter a valid OTP');
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
    };

    return (
        <div className="flex items-center justify-start w-full lg:w-3/5 h-screen bg-gray-100">
            <div className="relative flex flex-col items-center justify-center w-4/5 h-4/5 shadow-2xl rounded-r-lg p-6 bg-white">
                <div className="flex flex-col items-center justify-center w-full max-w-sm">
                    <h2 className="text-2xl font-bold mb-4">Verify OTP</h2>
                    <form onSubmit={handleSubmit} className="space-y-4 w-full">
                        <div className="flex justify-between space-x-2">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    id={`otp-${index}`}
                                    type="text"
                                    value={digit}
                                    onChange={(e) => handleOtpChange(e, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    className="w-10 h-10 text-center text-lg border border-gray-300 rounded-md shadow-sm bg-transparent focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                                    maxLength={1}
                                />
                            ))}
                        </div>
                        <button
                            type="submit"
                            className={`w-full py-2 px-4 ${!isButtonEnabled || loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-purple-400 hover:bg-purple-600'} text-white rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                            disabled={!isButtonEnabled || loading}
                        >
                            {loading ? 'Verifying...' : 'Verify OTP'}
                        </button>
                    </form>
                    <div className="mt-6 text-center text-sm text-gray-700">
                        {isTimerActive ? (
                            <p>Resend OTP in {timer} seconds</p>
                        ) : (
                            <button
                                type="button"
                                onClick={handleResendOtp}
                                className="text-blue-400 hover:underline"
                            >
                                Resend OTP
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MentorForgotPasswordBody;