import MentorAccountSidebar from "../../components/commonComponents/MentorAccountSidebar";
import MentorHeader from "../../components/commonComponents/MentorHeader";
import MentorAccountBody from "../../components/mentorComponents/Account/mentorAccountBody";

const MentorAccountPage = () => {
	return (
		<div className="flex flex-col min-h-screen">
			<MentorHeader />
			<div className="flex flex-1 bg-slate-50 overflow-y-auto">
				<MentorAccountSidebar />
				<main className="flex-1 mt-16 overflow-y-auto  ">
					<MentorAccountBody />
				</main>
			</div>
		</div>
	);
};

export default MentorAccountPage;

