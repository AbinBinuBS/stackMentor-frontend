import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { ChevronDown, ChevronUp, Plus, Calendar, Clock, Calendar as CalendarIcon } from "lucide-react";
import toast from "react-hot-toast";
import apiClient from "../../../services/apiClient";
import { LOCALHOST_URL } from "../../../constants/constants";

export interface ICommunityMeet {
  _id: string;
  date: Date;
  startTime: string;
  endTime: string;
  about: string;
  mentorInfo: {
    _id: string;
    name: string;
    image: string;
  };
  RoomId: string;
  image: string;
  stack: string;
}

const CommunityMeetBody = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [communityMeets, setCommunityMeets] = useState<ICommunityMeet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMeetData();
  }, []);

  const fetchMeetData = async () => {
    setIsLoading(true);
    try {
      const { data } = await apiClient.get(`${LOCALHOST_URL}/api/mentor/getAllCommunityMeet`);
      
      if (Array.isArray(data.meetData)) {
        setCommunityMeets(data.meetData);
        console.log(data);
      } else {
        console.error("Received data is not an array:", data.meetData);
        toast.error("Received invalid data format from the server.");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something unexpected happened.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const date = new Date(2000, 0, 1, parseInt(hours), parseInt(minutes));
    return date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  };

  type FileType = File & { type: string };

  const validationSchema = Yup.object({
    date: Yup.string()
      .required('Date is required')
      .test('is-future-date', "Booking must be made at least one day in advance", (value) => {
        if (!value) return false;
        const inputDate = new Date(value);
        const today = new Date();
        today.setDate(today.getDate());
        return inputDate >= today;
      }),
    startTime: Yup.string()
      .required('Start time is required')
      .test('is-valid-time', 'Start time must be earlier than end time', function (startTime) {
        const { endTime } = this.parent;
        if (!startTime || !endTime) return true;
        return startTime < endTime;
      }),
    endTime: Yup.string().required('End time is required'),
    about: Yup.string()
      .required("About is required")
      .min(150, "About must be at least 150 characters long"),
    stack: Yup.string().required("Stack is required"),
    image: Yup.mixed<FileType>()
      .required("An image is required")
      .test("fileSize", "File too large", (value) => 
        value && (value as FileType).size <= 5000000
      )
      .test("fileFormat", "Unsupported Format", (value) => 
        value ? ["image/jpeg", "image/png"].includes((value as FileType).type) : false
      ),
  });

  const handleSubmit = async (values: any, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    try {
      const formData = new FormData();
      formData.append('date', values.date);
      formData.append('startTime', values.startTime);
      formData.append('endTime', values.endTime);
      formData.append('about', values.about);
      formData.append('stack', values.stack);
      formData.append('image', values.image);

      const { data } = await apiClient.post(`${LOCALHOST_URL}/api/mentor/createComminityMeet`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log("Response data:", data);
      toast.success("Community meet created successfully!");
      setIsModalOpen(false);
      fetchMeetData(); 
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something unexpected happened. Please try again later.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const LoadingMessage = () => (
    <div className="flex justify-center items-center h-64">
      <p className="text-lg font-semibold text-gray-600">Loading community meets...</p>
    </div>
  );

  const NoDataMessage = () => (
    <div className="bg-white p-8 rounded-lg shadow-md text-center">
      <CalendarIcon className="mx-auto h-16 w-16 text-violet-500 mb-4" />
      <h3 className="text-2xl font-semibold text-gray-800 mb-2">No Community Meets Scheduled</h3>
      <p className="text-gray-600 mb-4">Be the first to organize an exciting community meet!</p>
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 bg-violet-500 text-white rounded-md hover:bg-violet-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-opacity-50"
      >
        Schedule a Meet
      </button>
    </div>
  );

  return (
    <div className="flex justify-center items-start">
      <div className="max-w-2xl w-full space-y-6">
        {isLoading ? (
          <LoadingMessage />
        ) : communityMeets.length === 0 ? (
          <NoDataMessage />
        ) : (
          communityMeets.map((meet, index) => (
            <div key={meet._id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <img src={meet.mentorInfo.image} alt={meet.mentorInfo.name} className="w-16 h-16 mr-4 rounded-full object-cover shadow-sm" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{meet.mentorInfo.name}</h3>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span className="mr-3">{new Date(meet.date).toLocaleDateString()}</span>
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{formatTime(meet.startTime)} - {formatTime(meet.endTime)}</span>
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-sm font-medium text-violet-600 mb-2">Tech Stack: {meet.stack}</p>
                <div className="text-gray-700 break-words">
                  {expandedIndex === index
                    ? meet.about
                    : `${meet.about.substring(0, 150)}...`}
                </div>
                <button
                  onClick={() => toggleExpand(index)}
                  className="text-violet-500 text-sm font-medium flex items-center hover:underline mt-2 focus:outline-none"
                >
                  {expandedIndex === index ? (
                    <>
                      Show less <ChevronUp className="w-4 h-4 ml-1" />
                    </>
                  ) : (
                    <>
                      Read more <ChevronDown className="w-4 h-4 ml-1" />
                    </>
                  )}
                </button>
              </div>
              <img src={meet.image} alt={`${meet.mentorInfo.name} banner`} className="w-full h-128 object-cover rounded-md shadow-sm" />
            </div>
          ))
        )}
      </div>

      {!isLoading && communityMeets.length > 0 && (
        <div className="ml-6 mt-6 fixed right-6 bottom-6">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center w-14 h-14 bg-violet-500 text-white rounded-full shadow-lg hover:bg-violet-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-opacity-50"
          >
            <Plus className="w-8 h-8" />
          </button>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Add New Community Meet</h2>
            <Formik
              initialValues={{ date: "", startTime: "", endTime: "", about: "", stack: "", image: null }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ setFieldValue, isSubmitting }) => (
                <Form className="space-y-4">
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <Field
                      name="date"
                      type="date"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                    <ErrorMessage name="date" component="div" className="text-red-500 text-xs mt-1" />
                  </div>

                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                        Start Time
                      </label>
                      <Field
                        name="startTime"
                        type="time"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                      />
                      <ErrorMessage name="startTime" component="div" className="text-red-500 text-xs mt-1" />
                    </div>

                    <div className="flex-1">
                      <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                        End Time
                      </label>
                      <Field
                        name="endTime"
                        type="time"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                      />
                      <ErrorMessage name="endTime" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="about" className="block text-sm font-medium text-gray-700 mb-1">
                      About
                    </label>
                    <Field
                      name="about"
                      as="textarea"
                      rows="4"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                    <ErrorMessage name="about" component="div" className="text-red-500 text-xs mt-1" />
                  </div>

                  <div>
                    <label htmlFor="stack" className="block text-sm font-medium text-gray-700 mb-1">
                      Stack
                    </label>
                    <Field
                      name="stack"
                      type="text"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                    <ErrorMessage name="stack" component="div" className="text-red-500 text-xs mt-1" />
                  </div>

                  <div>
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                      Image
                    </label>
                    <input
                      id="image"
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        const file = event.currentTarget.files && event.currentTarget.files[0];
                        if (file) {
                          setFieldValue("image", file);
                        }
                      }}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                    <ErrorMessage name="image" component="div" className="text-red-500 text-xs mt-1" />
                  </div>

                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-violet-500 text-white rounded-md hover:bg-violet-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-opacity-50 disabled:opacity-50"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit'}
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

export default CommunityMeetBody;