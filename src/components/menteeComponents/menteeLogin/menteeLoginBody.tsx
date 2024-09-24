import { useState } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import { LOCALHOST_URL } from '../../../constants/constants';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { menteeLogin } from '../../../redux/menteeSlice';
import toast from 'react-hot-toast'
import { signInValidation } from '../../../validations/commonValidation';


const initialValues = {
  email: '',
  password: '',
};

const MenteeLoginBody = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);

  const { values, handleBlur, handleChange, handleSubmit, errors, touched } = useFormik({
    initialValues,
    validationSchema: signInValidation,
    onSubmit: async (value) => {
      setLoading(true);
      try {
        const response = await axios.post(`${LOCALHOST_URL}/api/mentees/login`, value);
        if (response.data.message === 'Success') {
          const accessToken = response.data.accessToken;
          const refreshToken = response.data.refreshToken;
          console.log(response.data)
          dispatch(menteeLogin({ accessToken, refreshToken }));
          toast.success('Login Successfully...')
          navigate('/');
        } else {
          toast.error(response.data.message);
        }
      } catch (error: any) {
        if (axios.isAxiosError(error)) {
          const status = error.response?.status;
          const message = error.response?.data?.message;
          if (status === 400) {
            toast.error(message);
          } else if (status === 409) {
            toast.error(message);

          } else {
            toast.error(message);
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


  const handleGoogleAuthentication = () =>{
    window.location.href = "http://localhost:3001/auth";
  }

  return (
    <div className="flex justify-center items-center w-full h-screen bg-gray-100">
      <div className="flex bg-white rounded-lg shadow-lg w-[700px] h-auto max-h-[800px] overflow-hidden">
        <div className="flex-shrink-0 w-1/2 bg-blue-200 flex items-center justify-center">
          <img src="/images/loginimg.jpg" alt="Login" className="object-cover w-full h-full" />
        </div>
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Login</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  value={values.email}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="email"
                  className="block w-full sm:w-[250px] p-1 text-sm border border-gray-300 rounded-md shadow-sm bg-transparent placeholder-gray-500 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  placeholder="Enter your email"
                />
                {touched.email && errors.email && (
                  <small className="text-red-500">{errors.email}</small>
                )}
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-800 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  value={values.password}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="password"
                  className="block w-full sm:w-[250px] p-1 text-sm border border-gray-300 rounded-md shadow-sm bg-transparent placeholder-gray-500 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  placeholder="Enter your password"
                />
                {touched.password && errors.password && (
                  <small className="text-red-500">{errors.password}</small>
                )}
              </div>
              <button
                type="submit"
                className={`w-full py-2 px-4 ${
                  loading ? 'bg-gray-400' : 'bg-custom-cyan hover:bg-cyan-200'
                } text-white rounded-md shadow-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                disabled={loading}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
          </div>
          <div className="mt-6 text-center text-sm text-gray-700">
            <a href="/forgotPassword" className="text-blue-400 hover:underline ml-1">
              Forgot Password?
            </a>
            <p className="mt-2">
              New to our website?{' '}
              <a href="/register" className="text-blue-400 hover:underline ml-1">
                Register
              </a>
            </p>
            <button onClick={handleGoogleAuthentication}>google authentication</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenteeLoginBody;