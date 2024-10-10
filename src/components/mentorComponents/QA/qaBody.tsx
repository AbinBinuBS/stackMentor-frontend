import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import apiClient from '../../../services/apiClient';
import { LOCALHOST_URL } from '../../../constants/constants';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

interface IQuestion {
  _id: string;
  title: string;
  body: string;
  isAnswered: boolean;
  reply?: string;
}

const QABody: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); 
  const [selectedQuestion, setSelectedQuestion] = useState<IQuestion | null>(null);
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [activeTab, setActiveTab] = useState<'unanswered' | 'myAnswers'>('unanswered');
  const [editAnswerText, setEditAnswerText] = useState(''); 
  const [ismentorAllowed,setIsMentorAllowed] = useState<boolean>()
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()
  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const { data } = await apiClient.get(`${LOCALHOST_URL}/api/mentor/getAllQuestions`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLoading(false)
      setIsMentorAllowed(true)
      setQuestions(data.questions);
    } catch (error) {
      if (error instanceof Error) {
        if(error.message === "Mentor is not verified. Please complete the verification process."){
          setIsMentorAllowed(false)
          setLoading(false)
        }else{
          toast.error(error.message)
        }
      } else {
        toast.error('Something unexpected happened, please try again later.');
      }
    }
  };

  const handleAnswerClick = (question: IQuestion) => {
    setSelectedQuestion(question);
    setIsModalOpen(true);
  };

  const handleEditClick = (question: IQuestion) => {
    setSelectedQuestion(question);
    setEditAnswerText(question.reply || ''); 
    setIsEditModalOpen(true);
  };

  const handleAnswerSubmit = async (values: { answerText: string }) => {
    console.log('Answer submitted:', values.answerText);
    try {
      await apiClient.post(`${LOCALHOST_URL}/api/mentor/submitAnswer`, {
        questionId: selectedQuestion?._id,
        answer: values.answerText,
      });
      toast.success('Answer submitted successfully!');
      setIsModalOpen(false);
      fetchQuestions();
    } catch (error) {
      toast.error('Failed to submit the answer. Please try again.');
    }
  };

  const handleEditSubmit = async (values: { answerText: string }) => {
    console.log('Editing answer:', values.answerText);
    try {
      await apiClient.put(`${LOCALHOST_URL}/api/mentor/editAnswer`, {
        questionId: selectedQuestion?._id,
        answer: values.answerText,
      });
      toast.success('Answer updated successfully!');
      setIsEditModalOpen(false);
      fetchQuestions();
    } catch (error) {
      toast.error('Failed to update the answer. Please try again.');
    }
  };

  const validationSchema = Yup.object({
    answerText: Yup.string()
      .min(150, 'Answer must be at least 150 characters long')
      .required('Answer is required'),
  });

  const filteredQuestions =
    activeTab === 'unanswered'
      ? questions.filter((q) => !q.isAnswered)
      : questions.filter((q) => q.isAnswered);

      if (loading) {
        return (
          <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-lg font-semibold text-gray-700">Loading...</p>
          </div>
        );
      }


      if (!ismentorAllowed) {
        return (
          <div className="flex flex-col justify-center items-center ">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-center mt-36 mr-4 ml-4">
              <h2 className="text-xl font-semibold text-red-600 mb-4">You are not verified</h2>
              <p className="text-gray-700 mb-4">Please complete the verification process to access your booked slots.</p>
              <button
                onClick={() => {navigate('/mentor/home')}}
                className="px-4 py-2 text-sm text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none"
              >
                Go Back to Home
              </button>
            </div>
          </div>
        );
      }
  return (
    <div className="bg-white rounded-lg shadow-md p-4 max-w-2xl mx-auto h-[500px] flex flex-col">
      <h2 className="text-lg font-semibold mb-3">Q&A Section</h2>

      <div className="mb-4">
        <button
          className={`px-4 py-2 mr-2 ${
            activeTab === 'unanswered' ? 'bg-purple-600 text-white' : 'bg-gray-200'
          } rounded-md focus:outline-none`}
          onClick={() => setActiveTab('unanswered')}
        >
          Unanswered
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === 'myAnswers' ? 'bg-purple-600 text-white' : 'bg-gray-200'
          } rounded-md focus:outline-none`}
          onClick={() => setActiveTab('myAnswers')}
        >
          My Answers
        </button>
      </div>

      <div className="overflow-y-auto flex-grow">
        <div className="space-y-3">
          {filteredQuestions.map((question, index) => (
            <div key={index} className="border border-gray-200 rounded-md p-3">
              <h3 className="text-md font-medium mb-1">{question.title}</h3>
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{question.body}</p>

              {question.isAnswered && activeTab === 'myAnswers' && (
                <div>
                  <p className="text-sm text-green-600 mb-2">Answer: {question.reply}</p>
                  <button
                    onClick={() => handleEditClick(question)}
                    className="px-3 py-1 text-xs bg-yellow-600 text-white rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                  >
                    Edit
                  </button>
                </div>
              )}

              {activeTab === 'unanswered' && (
                <button
                  onClick={() => handleAnswerClick(question)}
                  className="px-3 py-1 text-xs bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                  Answer
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && selectedQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-4 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-2">{selectedQuestion?.title}</h2>
            <p className="text-sm text-gray-600 mb-3">{selectedQuestion?.body}</p>

            <Formik
              initialValues={{ answerText: '' }}
              validationSchema={validationSchema}
              onSubmit={handleAnswerSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div>
                    <Field
                      name="answerText"
                      as="textarea"
                      placeholder="Type your answer here..."
                      className="w-full h-24 p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 mb-3"
                    />
                    <ErrorMessage
                      name="answerText"
                      component="div"
                      className="text-red-500 text-xs"
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-3 py-1 text-xs border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 text-xs bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                      disabled={isSubmitting}
                    >
                      Submit Answer
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}

      {isEditModalOpen && selectedQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-4 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-2">{selectedQuestion?.title}</h2>
            <p className="text-sm text-gray-600 mb-3">{selectedQuestion?.body}</p>

            <Formik
              initialValues={{ answerText: editAnswerText }} 
              validationSchema={validationSchema}
              onSubmit={handleEditSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div>
                    <Field
                      name="answerText"
                      as="textarea"
                      placeholder="Edit your answer here..."
                      className="w-full h-24 p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 mb-3"
                    />
                    <ErrorMessage
                      name="answerText"
                      component="div"
                      className="text-red-500 text-xs"
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setIsEditModalOpen(false)}
                      className="px-3 py-1 text-xs border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 text-xs bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                      disabled={isSubmitting}
                    >
                      Update Answer
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

export default QABody;
