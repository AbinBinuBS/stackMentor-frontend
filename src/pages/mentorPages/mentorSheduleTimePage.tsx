import MentorAccountSidebar from "../../components/commonComponents/MentorAccountSidebar";
import MentorHeader from "../../components/commonComponents/MentorHeader";
import MentorSheduleTimeBody from "../../components/mentorComponents/Shedule Time/mentorSheduletimeBody";

const MentorSheduleTimePage = () => {
	return (
		<div className="flex flex-col min-h-screen bg-gray-100">
			<MentorHeader />
			<div className="flex flex-1">
				<MentorAccountSidebar />
				<main className="flex-1 ml-64 mt-36 p-6 overflow-y-auto">
					<MentorSheduleTimeBody />
				</main>
			</div>
		</div>
	);
};

export default MentorSheduleTimePage;
