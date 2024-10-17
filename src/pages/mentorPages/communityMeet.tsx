import MentorAccountSidebar from "../../components/commonComponents/MentorAccountSidebar";
import MentorHeader from "../../components/commonComponents/mentorHeader";
import CommunityMeetBody from "../../components/mentorComponents/Community meet/communityMeetBody";

const CommunityMeetPage = () => {
	return (
		<div className="flex flex-col min-h-screen bg-gray-100">
			<MentorHeader />
			<div className="flex flex-1">
				<MentorAccountSidebar />
				<main className="flex-1 ml-64 mt-36 p-6 overflow-y-auto">
					<CommunityMeetBody />
				</main>
			</div>
		</div>
	);
};

export default CommunityMeetPage;
