import React, { useState, useMemo } from "react";
import { MenteeSingleMentorSidebarProps } from "../../../interfaces/ImenteeInferfaces";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

const TruncatedComment: React.FC<{ comment: string }> = ({ comment }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 300;
  const maxLineLength = 300; 
  const maxWordLength = 300; 

  const splitLongWord = (word: string): string[] => {
    const result = [];
    for (let i = 0; i < word.length; i += maxWordLength) {
      result.push(word.slice(i, i + maxWordLength));
    }
    return result;
  };

  const formatComment = (text: string) => {
    const words = text.split(' ');
    let lines = [];
    let currentLine = '';

    words.forEach(word => {
      if (word.length > maxWordLength) {
        const splitWords = splitLongWord(word);
        splitWords.forEach((part, index) => {
          if ((currentLine + part).length > maxLineLength) {
            lines.push(currentLine.trim());
            currentLine = part + (index < splitWords.length - 1 ? '-' : '') + ' ';
          } else {
            currentLine += part + (index < splitWords.length - 1 ? '-' : '') + ' ';
          }
        });
      } else if ((currentLine + word).length > maxLineLength) {
        lines.push(currentLine.trim());
        currentLine = word + ' ';
      } else {
        currentLine += word + ' ';
      }
    });
    if (currentLine) lines.push(currentLine.trim());

    return lines.join('\n');
  };

  const displayedComment = isExpanded ? formatComment(comment) : formatComment(comment.slice(0, maxLength) + '...');

  return (
    <div className="max-w-full overflow-hidden">
      <p className="text-gray-600 whitespace-pre-wrap break-words">{displayedComment}</p>
      {comment.length > maxLength && (
        <button
          className="text-blue-600 hover:text-blue-800 text-sm mt-1"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "Read less" : "Read more"}
        </button>
      )}
    </div>
  );
};

const MenteeSingleMentorSidebar: React.FC<MenteeSingleMentorSidebarProps> = ({
  mentor,
  ratings
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;

  const ratingValues = ratings?.map(rating => rating.ratingValue) || [];
  const totalRatings = ratingValues.length;
  const sumOfRatings = ratingValues.reduce((total, rating) => total + rating, 0);
  const averageRating = totalRatings ? +(sumOfRatings / totalRatings).toFixed(1) : 0;

  const ratingDistribution = useMemo(() => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    ratingValues.forEach(rating => {
      distribution[rating as keyof typeof distribution]++;
    });
    return distribution;
  }, [ratingValues]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = ratings?.slice(indexOfFirstReview, indexOfLastReview) || [];

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="w-72 ml-6">
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <div className="flex flex-col items-center">
          <img
            src={mentor?.image}
            alt={mentor?.name}
            className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-blue-100"
          />
          <h2 className="text-2xl font-bold mb-2 text-gray-800">{mentor?.name}</h2>
          <p className="text-sm text-gray-600 mb-4 text-center">
            {mentor?.yearsOfExperience} years of experience
          </p>

          {totalRatings > 0 ? (
            <div className="mb-4 text-center">
              <p className="text-lg font-semibold text-gray-800 mb-2">
                {averageRating}
                <span className="text-sm text-gray-600"> / 5</span>
              </p>
              <div className="flex items-center justify-center mb-2">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    size={20}
                    className={index < Math.floor(averageRating) ? "text-yellow-400 fill-current" : "text-gray-300"}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600">Based on {totalRatings} reviews</p>
            </div>
          ) : (
            <p className="text-sm text-gray-600 mb-4">No Ratings Yet</p>
          )}

          <button
            onClick={openModal}
            className="mt-4 bg-gradient-to-r from-[#1D2B6B] to-[#142057] hover:from-[#2A3F7E] hover:to-[#0A102E] text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            View Ratings
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-11/12 max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">Reviews for {mentor?.name}</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={closeModal}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex-grow overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Rating Distribution</h3>
                  {[5, 4, 3, 2, 1].map(rating => (
                    <div key={rating} className="flex items-center mb-2">
                      <span className="w-8 text-sm font-medium">{rating} star</span>
                      <div className="flex-grow mx-2 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full"
                          style={{ width: `${(ratingDistribution[rating as keyof typeof ratingDistribution] / totalRatings) * 100}%` }}
                        ></div>
                      </div>
                      <span className="w-8 text-sm text-right">{ratingDistribution[rating as keyof typeof ratingDistribution]}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center justify-center">
                  <div className="text-5xl font-bold text-gray-800 mb-2">{averageRating.toFixed(1)}</div>
                  <div className="flex mb-2">
                    {[...Array(5)].map((_, index) => (
                      <Star
                        key={index}
                        size={24}
                        className={index < Math.floor(averageRating) ? "text-yellow-400 fill-current" : "text-gray-300"}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">Based on {totalRatings} reviews</p>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold mb-4">Recent Reviews</h3>
              <div className="space-y-4">
                {currentReviews.map((rating, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg shadow">
                    <div className="flex items-center mb-2">
                      <p className="text-lg font-semibold text-gray-800 mr-2">{rating.mentee.name}</p>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={i < rating.ratingValue ? "text-yellow-400 fill-current" : "text-gray-300"}
                          />
                        ))}
                      </div>
                    </div>
                    <TruncatedComment comment={rating.comment} />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="border-t p-4 flex justify-between items-center">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center text-blue-600 disabled:text-gray-400"
              >
                <ChevronLeft size={20} />
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {Math.ceil((ratings?.length || 0) / reviewsPerPage)}
              </span>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={indexOfLastReview >= (ratings?.length || 0)}
                className="flex items-center text-blue-600 disabled:text-gray-400"
              >
                Next
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenteeSingleMentorSidebar;