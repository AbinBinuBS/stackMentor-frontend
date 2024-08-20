import React, { useState } from 'react';
import { useFormik } from 'formik';
import { timeSheduleValidation } from '../../../validations/mentorValidation';
import toast from 'react-hot-toast';
import { LOCALHOST_URL } from '../../../constants/constants';
import apiClient from '../../../services/apiClient';

const MentorSheduleTimeBody = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const formik = useFormik({
    initialValues: {
      date: '',
      startTime: '',
      endTime: '',
      price: '',
      category: '',
      about: '',
      image: null,
    },
    validationSchema: timeSheduleValidation,
    onSubmit: async (values, { resetForm }) => {
      try {
        const formData = new FormData();
        formData.append('date', values.date);
        formData.append('startTime', values.startTime);
        formData.append('endTime', values.endTime);
        formData.append('price', values.price);
        formData.append('category', values.category);
        formData.append('about', values.about);
        if (values.image) {
          formData.append('image', values.image); 
        }
        
        const response = await apiClient.post(`${LOCALHOST_URL}/api/mentor/scheduleTime`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.data.message === "Time scheduled successfully.") {
          toast.success(response.data.message || "Time scheduled successfully.");
          resetForm();
          setSelectedImage(null); 
        } else {
          toast.error(response.data.message || "An unexpected error has occurred. Please try again.");
        }
      } catch (error) {
        if (error instanceof Error) {
          if(error.message == "The time slot can't  be booked because you already booked time on the provided time."){
            toast.error("The time slot can't  be booked because you already booked time on the provided time.");
          }
          toast.error("An unexpected error has occurred. Please try again.");
        } else {
          toast.error("An unexpected error has occurred. Please try again.");
        }
      }
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
      formik.setFieldValue('image', event.target.files[0]);
    }
  };

  return (
    <div className="container mx-auto my-auto px-4 py-8">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
        <h2 className="text-xl font-semibold text-center mb-4">Schedule Date and Time</h2>
        <form onSubmit={formik.handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              id="date"
              {...formik.getFieldProps('date')}
              className={`w-full px-3 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-purple-500 ${
                formik.touched.date && formik.errors.date ? 'border-red-500' : ''
              }`}
            />
            {formik.touched.date && formik.errors.date && (
              <div className="text-red-500 text-xs mt-1">{formik.errors.date}</div>
            )}
          </div>

          <div className="flex space-x-2">
            <div className="flex-1">
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                Start Time
              </label>
              <input
                type="time"
                id="startTime"
                {...formik.getFieldProps('startTime')}
                className={`w-full px-3 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-purple-500 ${
                  formik.touched.startTime && formik.errors.startTime ? 'border-red-500' : ''
                }`}
              />
              {formik.touched.startTime && formik.errors.startTime && (
                <div className="text-red-500 text-xs mt-1">{formik.errors.startTime}</div>
              )}
            </div>
            <div className="flex-1">
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                End Time
              </label>
              <input
                type="time"
                id="endTime"
                {...formik.getFieldProps('endTime')}
                className={`w-full px-3 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-purple-500 ${
                  formik.touched.endTime && formik.errors.endTime ? 'border-red-500' : ''
                }`}
              />
              {formik.touched.endTime && formik.errors.endTime && (
                <div className="text-red-500 text-xs mt-1">{formik.errors.endTime}</div>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Price (USD)
            </label>
            <input
              type="number"
              id="price"
              {...formik.getFieldProps('price')}
              className={`w-full px-3 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-purple-500 ${
                formik.touched.price && formik.errors.price ? 'border-red-500' : ''
              }`}
              placeholder="Enter price"
            />
            {formik.touched.price && formik.errors.price && (
              <div className="text-red-500 text-xs mt-1">{formik.errors.price}</div>
            )}
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              {...formik.getFieldProps('category')}
              className={`w-full px-3 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-purple-500 ${
                formik.touched.category && formik.errors.category ? 'border-red-500' : ''
              }`}
            >
              <option value="">Select a category</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="expert">Expert</option>
              <option value="any">Any</option>
            </select>
            {formik.touched.category && formik.errors.category && (
              <div className="text-red-500 text-xs mt-1">{formik.errors.category}</div>
            )}
          </div>

          <div>
            <label htmlFor="about" className="block text-sm font-medium text-gray-700 mb-1">
              About
            </label>
            <textarea
              id="about"
              {...formik.getFieldProps('about')}
              rows={3}
              className={`w-full px-3 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-purple-500 ${
                formik.touched.about && formik.errors.about ? 'border-red-500' : ''
              }`}
              placeholder="Describe the session..."
            />
            {formik.touched.about && formik.errors.about && (
              <div className="text-red-500 text-xs mt-1">{formik.errors.about}</div>
            )}
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
              Upload Image
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className={`w-full px-3 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-purple-500 ${
                formik.touched.image && formik.errors.image ? 'border-red-500' : ''
              }`}
            />
            {formik.touched.image && formik.errors.image && (
              <div className="text-red-500 text-xs mt-1">{formik.errors.image}</div>
            )}
            {selectedImage && (
              <div className="mt-2">
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="Selected"
                  className="w-full h-32 object-cover rounded"
                />
              </div>
            )}
          </div>

          <div className="flex justify-center mt-4">
            <button
              type="submit"
              className="px-4 py-2 text-sm text-white bg-purple-600 rounded-full hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              Save Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MentorSheduleTimeBody;