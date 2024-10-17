import MentorAccountSidebar from "../../components/commonComponents/mentorAccountSidebar";
import MentorHeader from "../../components/commonComponents/mentorHeader";
import MyCommunityBody from "../../components/mentorComponents/My-Community-Meet/myCommunityBody";

const MyCommunityPage = () => {
	return (
		<div className="flex flex-col min-h-screen bg-gray-100">
			<MentorHeader />
			<div className="flex flex-1">
				<MentorAccountSidebar />
				<main className="flex-1 ml-64 mt-36 p-6 overflow-y-auto">
					<MyCommunityBody />
				</main>
			</div>
		</div>
	);
};

export default MyCommunityPage;
