import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Calendar, ArrowLeft, Home } from 'lucide-react';
import MenteeHeader from "../../components/commonComponents/menteeHeader";
import MenteeSingleMentorBody from "../../components/menteeComponents/mentorSinglepage/menteeSingleMentorBody";
import MenteeSingleMentorSidebar from "../../components/menteeComponents/mentorSinglepage/menteeSingleMentorSidebar";
import { LOCALHOST_URL } from '../../constants/constants';
import { IMentorVerification, ISlot } from '../../interfaces/ImenteeInferfaces';
import toast from 'react-hot-toast';

const MenteeSignleMentorPage: React.FC = () => {
    const [mentor, setMentorData] = useState<IMentorVerification | null>(null);
    const [slots, setSlotsData] = useState<ISlot[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    useEffect(() => {
        const getMentorData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await axios.get(`${LOCALHOST_URL}/api/mentees/getMentorData/${id}`);
                if (response.data.message === "Success") {
                    const { mentorData, slotsData } = response.data;
                    setMentorData(mentorData);
                    setSlotsData(slotsData);
                }
            } catch (error) {
                if (axios.isAxiosError(error) && error.response?.status === 500) {
                    setError("Internal Server Error");
                } else if (error instanceof Error) {
                    toast.error(error.message);
                    setError(error.message);
                } else {
                    setError("An unexpected error occurred");
                }
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        };

        getMentorData();
    }, [id]);

    const updateSlotStatus = async () => {
        try {
            const response = await axios.get(`${LOCALHOST_URL}/api/mentees/getMentorData/${id}`);
            if (response.data.message === "Success") {
                setSlotsData(response.data.slotsData);
            }
        } catch (error) {
            console.error("Failed to update slots:", error);
        }
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleGoHome = () => {
        navigate('/'); 
    };

    if (isLoading) {
        return (
            <div className="flex flex-col bg-slate-100 min-h-screen">
                <MenteeHeader />
                <div className="flex-grow flex items-center justify-center">
                    <div className="text-2xl text-gray-600">Loading...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col bg-slate-100 min-h-screen">
                <MenteeHeader />
                <div className="flex-grow flex items-center justify-center px-4 py-8">
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-md w-full">
                        <div className="p-8 text-center">
                            <Home className="mx-auto mb-4 text-red-500" size={48} />
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
                            <p className="text-lg text-gray-600 mb-4">
                                {error === "Internal Server Error" 
                                    ? "We're experiencing some technical difficulties." 
                                    : error}
                            </p>
                            <button
                                onClick={handleGoHome}
                                className="px-6 py-2 bg-[#1D2B6B] text-white rounded-md hover:bg-[#2A3F7E] transition duration-300"
                            >
                                Go to Home
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col bg-slate-100 min-h-screen">
            <MenteeHeader />
            <div className="flex-grow flex items-center justify-center px-4 py-8">
                <div className="w-full max-w-6xl">
                    {slots && slots.length > 0 ? (
                        <div className="flex mt-16">
                            <main className="w-3/4  p-6">
                                <MenteeSingleMentorBody slots={slots} onSlotUpdate={updateSlotStatus} />
                            </main>
                            <aside className="w-1/4 p-6 pt-16">
                                <MenteeSingleMentorSidebar mentor={mentor} />
                            </aside>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <div className="p-4 border-b border-gray-200">
                                <button 
                                    onClick={handleGoBack}
                                    className="text-[#1D2B6B] hover:text-[#2A3F7E] transition duration-300"
                                    aria-label="Go back"
                                >
                                    <ArrowLeft size={24} />
                                </button>
                            </div>
                            <div className="p-8 text-center">
                                <Calendar className="mx-auto mb-4 text-[#1D2B6B]" size={48} />
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">No Slots Available</h2>
                                <p className="text-lg text-gray-600 mb-4">
                                    We're sorry, but this mentor currently has no available time slots.
                                </p>
                                <p className="text-md text-gray-500">
                                    Please check back later or explore other mentors who might be available.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MenteeSignleMentorPage;