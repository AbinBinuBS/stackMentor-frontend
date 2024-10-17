import React, { useState, useEffect } from "react";
import { FaArrowRight, FaArrowLeft, FaSearch, FaChevronLeft, FaChevronRight, FaUserSlash } from "react-icons/fa";
import { LOCALHOST_URL } from "../../../constants/constants";
import { useNavigate } from "react-router-dom";
import apiClientMentee from "../../../services/apiClientMentee";
import { Level, Mentor, Stack } from "../../../interfaces/ImenteeInferfaces";

const MentorDisplayBody: React.FC = () => {
    const navigate = useNavigate();
    const [level, setLevel] = useState<Level | null>(() => {
        const savedLevel = localStorage.getItem("selectedLevel");
        return (savedLevel as Level | null) || null;
    });
    const [stack, setStack] = useState<Stack | null>(() => {
        const savedStack = localStorage.getItem("selectedStack");
        return (savedStack as Stack | null) || null;
    });
    const [searchTerm, setSearchTerm] = useState("");
    const [mentors, setMentors] = useState<Mentor[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [mentorsPerPage] = useState(4);

    const stacks: Stack[] = [
        "Python", "MERN", "Data Science",
        "Java", "DevOps", "Cloud Computing",
        "Mobile Development", "Machine Learning", "Blockchain",
        "UI/UX Design", "Cybersecurity", "Game Development",
        "AR/VR", "IoT", "Embedded Systems"
    ];

    const fetchMentors = async (selectedLevel: Level, selectedStack: Stack) => {
        setIsLoading(true);
        try {
            const response = await apiClientMentee.get(
                `${LOCALHOST_URL}/api/mentees/getMentors?level=${selectedLevel}&stack=${selectedStack}`
            );
            if (Array.isArray(response.data.mentorData)) {
                setMentors(response.data.mentorData);
            } else {
                setMentors([]);
            }
        } catch (error) {
            setMentors([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const hash = window.location.hash;
        if (hash === "#" || hash === "") {
            setLevel(null);
            setStack(null);
            localStorage.removeItem("selectedLevel");
            localStorage.removeItem("selectedStack");
        } else {
            const savedLevel = localStorage.getItem("selectedLevel");
            const savedStack = localStorage.getItem("selectedStack");
            if (savedLevel && savedStack) {
                setLevel(savedLevel as Level);
                setStack(savedStack as Stack);
                fetchMentors(savedLevel as Level, savedStack as Stack);
            }
        }
    }, []);

    const handleLevelSelect = (selectedLevel: Level) => {
        setLevel(selectedLevel);
        localStorage.setItem("selectedLevel", selectedLevel);
        window.location.hash = selectedLevel;
    };

    const handleStackSelect = async (selectedStack: Stack) => {
        setStack(selectedStack);
        localStorage.setItem("selectedStack", selectedStack);
        window.location.hash = `${level}-${selectedStack}`;
        if (level) {
            await fetchMentors(level, selectedStack);
        }
    };

    const handleBack = () => {
        if (stack) {
            setStack(null);
            localStorage.removeItem("selectedStack");
        } else if (level) {
            setLevel(null);
            localStorage.removeItem("selectedLevel");
        }
        setSearchTerm("");
        setMentors([]);
        setCurrentPage(1);
        window.location.hash = level ? level : "";
    };

    const handleMentorDetails = (mentorId: string) => {
        navigate(`/mentorDetails/${mentorId}`);
    };

    const filteredMentors = mentors.filter(
        (mentor) =>
            mentor.about?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            mentor.mentorId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastMentor = currentPage * mentorsPerPage;
    const indexOfFirstMentor = indexOfLastMentor - mentorsPerPage;
    const currentMentors = filteredMentors.slice(indexOfFirstMentor, indexOfLastMentor);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const renderLevelSelection = () => (
        <>
            <h2 className="text-xl font-bold mb-4 text-center">
                Select Your Level
            </h2>
            <div className="flex justify-center items-center space-x-3 flex-grow">
                {(["beginner", "intermediate", "expert"] as Level[]).map((lvl) => (
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
    );

    const renderStackSelection = () => (
        <>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-center flex-grow">
                    Select Your Stack
                </h2>
                <button
                    onClick={handleBack}
                    className="text-[#1D2B6B] hover:text-[#2A3F7E] transition duration-300"
                >
                    <FaArrowLeft size={20} />
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {stacks.map((stk, index) => (
                    <button
                        key={index}
                        onClick={() => handleStackSelect(stk)}
                        className="bg-gradient-to-r from-[#1D2B6B] to-[#142057] hover:from-[#2A3F7E] hover:to-[#0A102E] text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1D2B6B] text-sm"
                    >
                        {stk}
                    </button>
                ))}
            </div>
        </>
    );

    const renderMentorList = () => (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-center flex-grow">
                    Available Mentors for {level!.charAt(0).toUpperCase() + level!.slice(1)} Level - {stack}
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
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full py-2 pl-8 pr-4 text-sm text-gray-700 bg-white border border-gray-300 rounded-full focus:outline-none focus:border-[#1D2B6B] focus:ring-1 focus:ring-[#1D2B6B]"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <FaSearch className="text-gray-400 text-sm" />
                </div>
            </div>
            <div className="overflow-y-auto flex-grow" style={{ maxHeight: "calc(100% - 120px)" }}>
                {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <p>Loading mentors...</p>
                    </div>
                ) : currentMentors.length > 0 ? (
                    currentMentors.map((mentor) => (
                        <div key={mentor._id} className="mb-3 last:mb-0">
                            <div className="bg-white rounded-lg shadow-md p-3 hover:shadow-lg transition duration-300">
                                <div className="flex items-start">
                                    <div className="w-20 h-20 mr-4 flex-shrink-0">
                                        {mentor.image ? (
                                            <img
                                                src={mentor.image}
                                                alt={mentor.mentorId}
                                                className="rounded-lg w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                                                <p className="text-gray-500 text-xs">
                                                    No Image
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <h3 className="text-lg font-bold mb-1 truncate">
                                            {mentor.name}
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-1 line-clamp-2 break-all">
                                            {mentor.about}
                                        </p>
                                        <p className="text-gray-600 text-sm">
                                            Experience: {mentor.yearsOfExperience} years
                                        </p>
                                    </div>
                                    <div className="text-[#1D2B6B] hover:text-[#2A3F7E] transition duration-300 ml-3 flex-shrink-0">
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
                    <div className="flex flex-col justify-center items-center h-full text-center">
                        <FaUserSlash className="text-gray-400 text-6xl mb-4" />
                        <h3 className="text-xl font-bold text-gray-700 mb-2">No Mentors Found</h3>
                        <p className="text-gray-600 mb-4">We couldn't find any mentors matching your criteria.</p>
                        <p className="text-gray-600">Try adjusting your search or explore different categories.</p>
                        <button 
                            onClick={handleBack} 
                            className="mt-6 bg-gradient-to-r from-[#1D2B6B] to-[#142057] hover:from-[#2A3F7E] hover:to-[#0A102E] text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1D2B6B]"
                        >
                            Go Back
                        </button>
                    </div>
                )}
            </div>
            {filteredMentors.length > mentorsPerPage && (
                <div className="flex justify-center mt-4">
                    <nav className="flex items-center">
                        <button
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1 rounded-md mr-2 bg-gray-200 text-gray-700 disabled:opacity-50"
                        >
                            <FaChevronLeft />
                        </button>
                        {Array.from({ length: Math.ceil(filteredMentors.length / mentorsPerPage) }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => paginate(i + 1)}
                                className={`px-3 py-1 rounded-md mr-2 ${
                                    currentPage === i + 1
                                        ? "bg-[#1D2B6B] text-white"
                                        : "bg-gray-200 text-gray-700"
                                }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === Math.ceil(filteredMentors.length / mentorsPerPage)}
                            className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 disabled:opacity-50"
                        >
                            <FaChevronRight />
                        </button>
                    </nav>
                </div>
            )}
        </div>
    );

    return (
        <div
            className={`bg-white rounded-lg shadow-md p-6 w-full mx-auto flex flex-col md:max-w-[90%] lg:max-w-[85%] xl:max-w-[80%] ${
                !level ? "mt-16" : ""
            }`}
            style={{ height: level && stack ? "calc(100vh - 200px)" : "auto" }}
        >
            {!level ? renderLevelSelection() :
             !stack ? renderStackSelection() :
             renderMentorList()}
        </div>
    );
};

export default MentorDisplayBody;