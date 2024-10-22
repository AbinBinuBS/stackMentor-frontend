import MentorAccountSidebar from "../../components/commonComponents/mentorAccountSidebar";
import MentorHeader from "../../components/commonComponents/mentorHeader";
import MentorAccountBody from "../../components/mentorComponents/Account/mentorAccountBody";

const MentorAccountPage = () => {
	return (
		<div className="flex flex-col min-h-screen">
			<MentorHeader />
			<div className="flex flex-1 bg-slate-100 overflow-y-auto">
				<MentorAccountSidebar />
				<main className="flex-1 mt-16 mx-9 bg-gray-100 overflow-y-auto  ">
					<MentorAccountBody />
				</main>
			</div>
		</div>
	);
};

export default MentorAccountPage;

