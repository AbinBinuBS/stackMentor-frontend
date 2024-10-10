import { useEffect, useState } from "react";
import MentorChatBody from "../../components/chatComponents/mentorChatBody";
import MentorAccountSidebar from "../../components/commonComponents/mentorAccountSidebar";
import MentorHeader from "../../components/commonComponents/mentorHeader";
import apiClient from "../../services/apiClient";
import { LOCALHOST_URL } from "../../constants/constants";
import { User } from "../../interfaces/IChatMentorInterface";

const MentorChatPage = () => {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchMentor = async () => {
			try {
				setLoading(true);
				const response = await apiClient.get(
					`${LOCALHOST_URL}/api/mentor/getMentorData`
				);
				setUser(response.data);
				setLoading(false);
			} catch (error) {
				setError("Failed to fetch mentor data.");
				setLoading(false);
			}
		};

		fetchMentor();
	}, []);

	if (loading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<div className="flex flex-col min-h-screen">
			<MentorHeader />
			<div className="flex flex-1 bg-slate-50 overflow-y-auto">
				<MentorAccountSidebar />
				<main className="flex-1 ml-96 mt-40 overflow-y-auto">
					{user ? <MentorChatBody user={user} /> : <div>Loading...</div>}
				</main>
			</div>
		</div>
	);
};

export default MentorChatPage;
