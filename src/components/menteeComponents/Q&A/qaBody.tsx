import React, { useEffect, useState } from 'react';
import { Search, X, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import apiClientMentee from '../../../services/apiClientMentee';
import { LOCALHOST_URL } from '../../../constants/constants';
import { IQaData } from '../../../interfaces/ImenteeInferfaces';

const QABody: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState<IQaData | null>(null);
    const [expandedQuestions, setExpandedQuestions] = useState<number[]>([]);
    const [questions, setQuestions] = useState<IQaData[]>([]);

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            const { data } = await apiClientMentee.get(`${LOCALHOST_URL}/api/mentees/getAllQuestions`);
            if (data.message === "Success") {
                setQuestions(data.questions); // Ensure data.questions is of type IQaData[]
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Something unexpected happened";
            toast.error(errorMessage); // Display actual error message
        }
    };

    const handleShowAnswer = (question: IQaData) => { // Use IQaData type
        setSelectedQuestion(question);
        setIsModalOpen(true);
    };

    const toggleExpand = (index: number) => {
        setExpandedQuestions(prev =>
            prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
        );
    };

    const filteredQuestions = questions.filter(question =>
        question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        question.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
        question.menteeId?.name.toLowerCase().includes(searchQuery.toLowerCase()) || // Search by mentee name
        (question.mentorId?.name && question.isAnswered && question.mentorId.name.toLowerCase().includes(searchQuery.toLowerCase())) // Search by mentor name if answered
    );

    return (
        <div className="h-full flex flex-col p-6">
            <div className="relative mb-6">
                <input
                    type="text"
                    placeholder="Search questions..."
                    className="w-full py-3 px-4 bg-white rounded-full pr-10 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute right-3 top-3 text-blue-400" />
            </div>

            <h2 className="text-2xl font-bold mb-6 text-gray-800">Frequently Asked Questions</h2>

            <div className="overflow-y-auto flex-grow pr-2">
                <AnimatePresence>
                    {filteredQuestions.map((question, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="mb-4"
                        >
                            <div className="border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 bg-white">
                                <div 
                                    className="p-4 cursor-pointer flex justify-between items-center"
                                    onClick={() => toggleExpand(index)}
                                >
                                    <h3 className="text-lg font-semibold text-blue-600">{question.title}</h3>
                                    {expandedQuestions.includes(index) ? <ChevronUp /> : <ChevronDown />}
                                </div>
                                {expandedQuestions.includes(index) && (
                                    <div className="px-4 pb-4">
                                        <p className="text-gray-600 mb-2">{question.body}</p>
                                        <p className="text-sm text-gray-500 mb-4">Asked by: {question.menteeId?.name}</p>
                                        {question.isAnswered ? (
                                            <>
                                                <button 
                                                    onClick={() => handleShowAnswer(question)}
                                                    className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50"
                                                >
                                                    Show Answer
                                                </button>
                                                <p className="text-sm text-gray-500">Answered by: {question.mentorId?.name}</p>
                                            </>
                                        ) : (
                                            <p className="text-sm text-red-500">Not answered yet</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {isModalOpen && selectedQuestion && (
                    <motion.div 
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div 
                            className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            transition={{ type: "spring", damping: 15 }}
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold text-blue-600">{selectedQuestion.title}</h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700 focus:outline-none">
                                    <X size={24} />
                                </button>
                            </div>
                            <div className="mb-4">
                                <h4 className="font-semibold mb-2 text-gray-700">Question:</h4>
                                <p className="text-gray-600 mb-2">{selectedQuestion.body}</p>
                                <p className="text-sm text-gray-500 mb-4">Asked by: {selectedQuestion.menteeId?.name}</p>
                                <h4 className="font-semibold mb-2 text-gray-700">Answer:</h4>
                                {selectedQuestion.isAnswered ? (
                                    <>
                                        <p className="text-gray-600 mb-2">{selectedQuestion.reply}</p>
                                        <p className="text-sm text-gray-500">Answered by: {selectedQuestion.mentorId?.name}</p>
                                    </>
                                ) : (
                                    <p className="text-red-500">This question has not been answered yet.</p>
                                )}
                            </div>
                            <div className="flex justify-end">
                                <button 
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const QABodyContainer: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 mt-32">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl overflow-hidden">
                <QABody />
            </div>
        </div>
    );
};

export default QABodyContainer;
