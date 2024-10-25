import React, { useEffect, useState } from "react";
import { Search, X, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import apiClientMentee from "../../../services/apiClientMentee";
import { LOCALHOST_URL } from "../../../constants/constants";
import { IQaData } from "../../../interfaces/ImenteeInferfaces";

interface PaginationResponse {
  questions: IQaData[];
  totalPages: number;
  currentPage: number;
}

const QABody: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<IQaData | null>(null);
  const [expandedQuestions, setExpandedQuestions] = useState<number[]>([]);
  const [questions, setQuestions] = useState<IQaData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, [currentPage, searchQuery]);

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const { data } = await apiClientMentee.get<PaginationResponse>(
        `${LOCALHOST_URL}/api/mentees/getAllQuestions`,
        {
          params: {
            page:currentPage,
            search: searchQuery,
          },
        }
      );
      if (data.questions) {
        setQuestions(data.questions);
        setTotalPages(Math.ceil(data.totalPages / 5));
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Something unexpected happened";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowAnswer = (question: IQaData) => {
    setSelectedQuestion(question);
    setIsModalOpen(true);
  };

  const toggleExpand = (index: number) => {
    setExpandedQuestions((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="h-full flex flex-col p-4 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search questions..."
          className="w-full py-2 px-4 bg-white rounded-full pr-10 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 shadow-sm text-sm"
          value={searchQuery}
          onChange={handleSearch}
        />
        <Search className="absolute right-3 top-2 text-blue-400 w-4 h-4" />
      </div>

      <h2 className="text-xl font-bold mb-4 text-gray-800">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          Frequently Asked Questions
        </span>
      </h2>

      <div className="overflow-y-auto flex-grow pr-2">
        {isLoading ? (
          <div className="flex justify-center items-center h-24">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <AnimatePresence>
            {questions.map((question, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="mb-3"
              >
                <div className="border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 bg-white backdrop-blur-sm bg-opacity-90">
                  <div
                    className="p-3 cursor-pointer flex justify-between items-center"
                    onClick={() => toggleExpand(index)}
                  >
                    <h3 className="text-sm font-semibold text-blue-600">
                      {question.title}
                    </h3>
                    {expandedQuestions.includes(index) ? (
                      <ChevronUp className="text-blue-400 w-4 h-4" />
                    ) : (
                      <ChevronDown className="text-blue-400 w-4 h-4" />
                    )}
                  </div>
                  {expandedQuestions.includes(index) && (
                    <div className="px-3 pb-3">
                      <p className="text-gray-600 text-sm mb-2">{question.body}</p>
                      <p className="text-xs text-gray-500 mb-3">
                        Asked by: {question.menteeId?.name}
                      </p>
                      {question.isAnswered ? (
                        <>
                          <button
                            onClick={() => handleShowAnswer(question)}
                            className="px-3 py-1.5 text-xs bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50 shadow-sm"
                          >
                            Show Answer
                          </button>
                          <p className="text-xs text-gray-500 mt-2">
                            Answered by: {question.mentorId?.name}
                          </p>
                        </>
                      ) : (
                        <p className="text-xs text-red-500">Not answered yet</p>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`px-3 py-1 text-xs ${currentPage === 1 ? "bg-gray-300" : "bg-gray-300 hover:bg-gray-400"} rounded-md`}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 text-xs ${currentPage === totalPages ? "bg-gray-300" : "bg-gray-300 hover:bg-gray-400"} rounded-md`}
        >
          Next
        </button>
      </div>

      <AnimatePresence>
        {isModalOpen && selectedQuestion && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg p-4 max-w-xl w-full max-h-[80vh] overflow-y-auto shadow-xl"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 15 }}
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                  {selectedQuestion.title}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="mb-3">
                <h4 className="font-semibold mb-2 text-sm text-gray-700">Question:</h4>
                <p className="text-sm text-gray-600 mb-2">{selectedQuestion.body}</p>
                <p className="text-xs text-gray-500 mb-3">
                  Asked by: {selectedQuestion.menteeId?.name}
                </p>
                <h4 className="font-semibold mb-2 text-sm text-gray-700">Answer:</h4>
                {selectedQuestion.isAnswered ? (
                  <>
                    <p className="text-sm text-gray-600 mb-2">{selectedQuestion.reply}</p>
                    <p className="text-xs text-gray-500">
                      Answered by: {selectedQuestion.mentorId?.name}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-red-500">
                    This question has not been answered yet.
                  </p>
                )}
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 text-xs bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50"
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
    <div className="min-h-screen bg-gradient-to-br  flex items-center justify-center p-4 mt-16">
      <div 
        className="bg-white bg-opacity-90 rounded-xl shadow-lg w-full max-w-3xl overflow-hidden backdrop-blur-sm"
        style={{
          backgroundImage: `
            radial-gradient(circle at 100% 100%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 0% 0%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)
          `
        }}
      >
        <QABody />
      </div>
    </div>
  );
};

export default QABodyContainer;