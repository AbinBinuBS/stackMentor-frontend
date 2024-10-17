import MentorAccountSidebar from "../../components/commonComponents/MentorAccountSidebar";
import MentorHeader from "../../components/commonComponents/mentorHeader";
import MentorMySlotBody from "../../components/mentorComponents/MySlot/mentorMyslotBody";

const MentorMySlotPage = () => {
	return (
		<div className="flex flex-col min-h-screen bg-gray-100">
			<MentorHeader />
			<div className="flex flex-1">
				<MentorAccountSidebar />
				<main className="flex-1 mt-16 ml-64 p-4 overflow-y-auto">
					<MentorMySlotBody />
				</main>
			</div>
		</div>
	);
};

export default MentorMySlotPage;
