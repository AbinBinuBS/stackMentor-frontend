import React, { useEffect, useState } from 'react';
import MenteeHeader from "../../components/commonComponents/menteeHeader";
import MenteeSingleMentorBody from "../../components/menteeComponents/mentorSinglepage/menteeSingleMentorBody";
import MenteeSingleMentorSidebar from "../../components/menteeComponents/mentorSinglepage/menteeSingleMentorSidebar";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { LOCALHOST_URL } from '../../constants/constants';
import { IMentorVerification, ISlot } from '../../interfaces/ImenteeInferfaces';

const MenteeSignleMentorPage: React.FC = () => {
    const [mentor, setMentorData] = useState<IMentorVerification | null>(null);
    const [slots, setSlotsData] = useState<ISlot[] | null>(null);
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        const getMentorData = async () => {
            try {
                const response = await axios.get(`${LOCALHOST_URL}/api/mentees/getMentorData/${id}`);
                if (response.data.message === "Success") {
                    const { mentorData, slotsData } = response.data;
                    setMentorData(mentorData);
                    setSlotsData(slotsData);
                }
            } catch (error) {
                console.log(error);
            }
        };

        getMentorData();
    }, [id]);

    return (
        <div className="flex flex-col bg-slate-100 min-h-screen">
            <MenteeHeader />
            <div className="flex flex-grow mt-32 justify-center">
                <div className="flex w-full max-w-6xl">
                    <main className="w-3/4 p-6">
                        <MenteeSingleMentorBody  slots={slots} />
                    </main>
                    <aside className="w-1/4 p-6 pt-16">
                        <MenteeSingleMentorSidebar mentor={mentor} />
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default MenteeSignleMentorPage;
