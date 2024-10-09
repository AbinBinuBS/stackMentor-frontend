import React, { useState, useEffect } from 'react';
import { FaArrowRight, FaArrowLeft, FaSearch } from 'react-icons/fa';
import { LOCALHOST_URL } from '../../../constants/constants';
import { useNavigate } from 'react-router-dom';
import apiClientMentee from '../../../services/apiClientMentee';
import { Level, Mentor } from '../../../interfaces/ImenteeInferfaces';




const MentorDisplayBody: React.FC = () => {
  const navigate = useNavigate();
  const [level, setLevel] = useState<Level | null>(() => {
    const savedLevel = localStorage.getItem('selectedLevel');
    return (savedLevel as Level | null) || null;
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMentors = async (selectedLevel: Level) => {
    setIsLoading(true);
    try {
      const response = await apiClientMentee.get(`${LOCALHOST_URL}/api/mentees/getMentors?level=${selectedLevel}`);
      console.log('Response data:', response.data);

      if (Array.isArray(response.data.mentorData)) {
        setMentors(response.data.mentorData);
      } else {
        setMentors([]);
        console.error('Unexpected data format:', response.data);
      }
    } catch (error) {
      console.error('Error fetching mentors:', error);
      setMentors([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const hash = window.location.hash;
    if (hash === '#' || hash === '') {
      setLevel(null);
      localStorage.removeItem('selectedLevel');
    } else {
      const savedLevel = localStorage.getItem('selectedLevel');
      if (savedLevel) {
        setLevel(savedLevel as Level);
        fetchMentors(savedLevel as Level);
      }
    }
  }, []);

  const handleLevelSelect = async (selectedLevel: Level) => {
    setLevel(selectedLevel);
    localStorage.setItem('selectedLevel', selectedLevel);
    window.location.hash = selectedLevel;
    await fetchMentors(selectedLevel);
  };

  const handleBack = () => {
    setLevel(null);
    setSearchTerm('');
    setMentors([]);
    localStorage.removeItem('selectedLevel');
    window.location.hash = '';
  };

  const handleMentorDetails = (mentorId: string) => {
    navigate(`/mentorDetails/${mentorId}`);
  };

  const filteredMentors = Array.isArray(mentors)
    ? mentors.filter(
        mentor =>
          mentor.about?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mentor.mentorId.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div
      className={`bg-white rounded-lg shadow-md p-4 w-full mx-auto flex flex-col md:max-w-[90%] lg:max-w-[85%] xl:max-w-[80%] ${
        !level ? 'mt-16' : '' 
      }`}
    >
      {!level ? (
        <>
          <h2 className="text-xl font-bold mb-4 text-center">Select Your Level</h2>
          <div className="flex justify-center items-center space-x-3 flex-grow">
            {(['beginner', 'intermediate', 'expert'] as Level[]).map(lvl => (
              <button
                key={lvl}
                onClick={() => handleLevelSelect(lvl)}
                className="bg-gradient-to-r from-[#1D2B6B] to-[#142057] hover:from-[#2A3F7E] hover:to-[#0A102E] text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1D2B6B] text-sm"
              >
                {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-center flex-grow">
              Available Mentors for {level.charAt(0).toUpperCase() + level.slice(1)} Level
            </h2>
            <button
              onClick={handleBack}
              className="text-[#1D2B6B] hover:text-[#2A3F7E] transition duration-300"
            >
              <FaArrowLeft size={20} />
            </button>
          </div>
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search mentors..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full py-2 pl-8 pr-4 text-sm text-gray-700 bg-white border border-gray-300 rounded-full focus:outline-none focus:border-[#1D2B6B] focus:ring-1 focus:ring-[#1D2B6B]"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <FaSearch className="text-gray-400 text-sm" />
            </div>
          </div>
          <div className="overflow-y-auto flex-grow" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <div className="h-full" style={{ overflow: '-moz-scrollbars-none' }}>
              <div style={{ WebkitOverflowScrolling: 'touch' }}>
                {isLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <p>Loading mentors...</p>
                  </div>
                ) : filteredMentors.length > 0 ? (
                  filteredMentors.map(mentor => (
                    <div key={mentor._id} className="mb-3 last:mb-0">
                      <div className="bg-white rounded-lg shadow-md p-3 hover:shadow-lg transition duration-300">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center w-full">
                            <div className="w-20 h-20 mr-4 flex-shrink-0">
                              {mentor.image ? (
                                <img
                                  src={mentor.image}
                                  alt={mentor.mentorId}
                                  className="rounded-lg w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                                  <p className="text-gray-500 text-xs">No Image</p>
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col justify-center flex-grow">
                              <h3 className="text-lg font-bold mb-1">{mentor.name}</h3>
                              <p className="text-gray-600 text-sm h-10 overflow-hidden text-ellipsis">
                                {mentor.about}
                              </p>
                              <p className="text-gray-600 text-sm">Experience: {mentor.yearsOfExperience} years</p>
                            </div>
                          </div>
                          <div className="text-[#1D2B6B] hover:text-[#2A3F7E] transition duration-300 ml-3">
                            <button
                              onClick={() => handleMentorDetails(mentor.mentorId)}
                              className="text-[#1D2B6B] hover:text-[#2A3F7E] transition duration-300"
                            >
                              <FaArrowRight size={20} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex justify-center items-center h-full">
                    <p>No mentors found.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MentorDisplayBody;
