import React, { useState, ChangeEvent, useEffect, KeyboardEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { LOCALHOST_URL } from '../../../constants/constants';
import { useDispatch } from 'react-redux';
import { menteeLogin } from '../../../redux/menteeSlice';
import toast from 'react-hot-toast';

const MenteeForgotPasswordOtpBody: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [loading, setLoading] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(60);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(true);
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');

  useEffect(() => {
    const storedStartTime = localStorage.getItem('otpStartTime');
    const storedIsTimerActive = localStorage.getItem('isTimerActive');
    let timePassed = 0;
  
    if (storedStartTime) {
      const startTime = parseInt(storedStartTime, 10);
      const currentTime = Date.now();
      timePassed = Math.floor((currentTime - startTime) / 1000);
    }
  
    const newTimerValue = storedStartTime ? Math.max(60 - timePassed, 0) : 60;
    setTimer(newTimerValue);
    setIsTimerActive(newTimerValue > 0 && storedIsTimerActive === 'true');
  
    if (!storedStartTime) {
      const startTime = Date.now();
      localStorage.setItem('otpStartTime', startTime.toString());
      localStorage.setItem('isTimerActive', 'true');
    }
  
    let interval: NodeJS.Timeout | null = null;
  
    if (isTimerActive) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          const newTimer = prevTimer - 1;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
        const otpString = otp.join('');
        const response = await axios.post(`${LOCALHOST_URL}/api/mentees/reset-password-verify-otp`, {
            email,
            otp: otpString,
        });

        if (response.data.message === 'OTP verified successfully') {
            localStorage.removeItem('otpStartTime');
            localStorage.removeItem('isTimerActive');
            const accessToken = response.data.accessToken;
            const refreshToken = response.data.refreshToken;
            dispatch(menteeLogin({ accessToken, refreshToken }));
            toast.success("OTP verified successfully");
            navigate(`/reset-password?email=${encodeURIComponent(response.data.email)}`);
        } else {
            toast.error(response.data.message || 'Invalid OTP. Please try again.');
        }
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            const message = error.response?.data?.message;
            if (status === 400 || status === 409) {
                toast.error(message || 'Please enter a valid OTP.');
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
};


  const handleResendOtp = async () => {
    try {
      const startTime = Date.now();
      localStorage.setItem('otpStartTime', startTime.toString());
      setTimer(60);
      setIsTimerActive(true);
      localStorage.setItem('isTimerActive', 'true');
      setOtp(['', '', '', '', '', '']);
      const response = await axios.post(`${LOCALHOST_URL}/api/mentees/resend-otp`, {
        email,
      });
      if (response.data.message === 'Resend otp send Successfull') {
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

  const isOtpFilled = otp.every((digit) => digit !== '');
  const isButtonEnabled = isOtpFilled && isTimerActive;

  return (
    <div className="flex justify-center items-center w-full min-h-screen bg-gray-100 p-4">
      <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-lg w-full max-w-3xl overflow-hidden">
        <div className="md:w-1/2 bg-blue-200 flex items-center justify-center">
          <img src="/images/loginimg.jpg" alt="OTP Verification" className="object-cover w-full h-full" />
        </div>
        <div className="md:w-1/2 p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Enter OTP</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="otp-0" className="block text-sm font-semibold text-gray-800 mb-2">OTP</label>
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
              </div>
              <button
                type="submit"
                className={`w-full py-2 px-4 ${!isButtonEnabled || loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-custom-cyan hover:bg-cyan-200'} text-white rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                disabled={!isButtonEnabled || loading}
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </form>
          </div>
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

export default MenteeForgotPasswordOtpBody;
