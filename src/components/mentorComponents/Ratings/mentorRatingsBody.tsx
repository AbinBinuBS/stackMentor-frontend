import React, { useEffect, useState } from 'react';
import { LOCALHOST_URL } from '../../../constants/constants';
import apiClient from '../../../services/apiClient';
import { toast } from 'react-hot-toast';
import { CalendarIcon, Star, Users } from 'lucide-react';

type RatingValue = 1 | 2 | 3 | 4 | 5;
type RatingCounts = Record<RatingValue, number>;

const NoDataMessage: React.FC = () => (
  <div className="bg-white p-6 rounded-lg mt-36 shadow-md text-center max-w-sm mx-auto">
    <CalendarIcon className="mx-auto h-12 w-12 text-violet-500 mb-4" />
    <h3 className="text-xl font-semibold text-gray-800 mb-2">No Ratings Available</h3>
    <p className="text-gray-600 mb-4">Start Mentoring to Receive Ratings!</p>
  </div>
);

const MentorRatingBody: React.FC = () => {
  const [ratings, setRatings] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [ratingsPerPage] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getRatings = async () => {
      try {
        const response = await apiClient.get(`${LOCALHOST_URL}/api/mentor/getRatings`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setRatings(response.data.ratings);
      } catch (error) {
        toast.error("Unable to fetch ratings.");
      } finally {
        setLoading(false);
      }
    };

    getRatings();
  }, []);

  const indexOfLastRating = currentPage * ratingsPerPage;
  const indexOfFirstRating = indexOfLastRating - ratingsPerPage;
  const currentRatings = ratings.slice(indexOfFirstRating, indexOfLastRating);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const getRatingCounts = (): RatingCounts => {
    const counts: RatingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    ratings.forEach(rating => {
      const ratingValue = rating.ratingValue as RatingValue;
      counts[ratingValue]++;
    });
    return counts;
  };

  const ratingCounts = getRatingCounts();

  const calculateOverallRating = (): number => {
    if (ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, rating) => acc + rating.ratingValue, 0);
    return Number((sum / ratings.length).toFixed(1));
  };

  const overallRating = calculateOverallRating();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!ratings.length) {
    return <NoDataMessage />;
  }

  const totalPages = Math.ceil(ratings.length / ratingsPerPage);

  return (
    <div className="w-full max-w-4xl ml-auto mr-36 bg-white shadow-lg rounded-lg p-6 mt-12">
      <h1 className="text-2xl font-bold mb-4 text-purple-700">My Ratings</h1>
      
      <div className="mb-4 bg-purple-50 p-3 rounded-lg shadow-sm">
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex flex-col items-center m-1 bg-white p-2 rounded-lg shadow-sm">
            <div className="text-lg font-bold text-purple-700">Overall Rating</div>
            <div className="flex items-center">
              <span className="text-2xl font-bold text-yellow-500 mr-2">{overallRating}</span>
              <Star className="text-yellow-400" size={24} fill="currentColor" />
            </div>
          </div>
          {([5, 4, 3, 2, 1] as const).map(star => (
            <div key={star} className="flex flex-col items-center m-1">
              <div className="flex items-center">
                <Star className="text-yellow-400" size={18} />
                <span className="text-sm font-semibold ml-1">{star}</span>
              </div>
              <div className="text-lg font-bold text-purple-700">{ratingCounts[star]}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-purple-100">
            <tr>
              <th className="py-2 px-3 text-sm font-semibold text-purple-700">Mentee</th>
              <th className="py-2 px-3 text-sm font-semibold text-purple-700">Rating</th>
              <th className="py-2 px-3 text-sm font-semibold text-purple-700">Comment</th>
              <th className="py-2 px-3 text-sm font-semibold text-purple-700">Date</th>
            </tr>
          </thead>
          <tbody>
            {currentRatings.map((rating) => (
              <tr key={rating._id.toString()} className="hover:bg-purple-50 transition-colors duration-200">
                <td className="py-2 px-3 text-sm border-b">{rating.mentee.name}</td>
                <td className="py-2 px-3 text-sm border-b">
                  <div className="flex items-center">
                    {Array.from({ length: rating.ratingValue }).map((_, index) => (
                      <Star key={index} className="text-yellow-400" size={14} />
                    ))}
                  </div>
                </td>
                <td className="py-2 px-3 text-sm border-b">{rating.comment}</td>
                <td className="py-2 px-3 text-sm border-b">
                  {new Date(rating.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mt-4">
        <div className="text-sm text-gray-600 mb-2 sm:mb-0">
          <Users className="inline mr-1" size={16} />
          Total Reviews: {ratings.length}
        </div>
        <div className="flex flex-wrap justify-center">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={`py-1 px-2 m-1 rounded text-xs font-medium transition-colors duration-200 ${
                index + 1 === currentPage 
                  ? 'bg-purple-700 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-purple-200'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MentorRatingBody;