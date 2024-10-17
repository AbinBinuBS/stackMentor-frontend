import MentorAccountSidebar from "../../components/commonComponents/MentorAccountSidebar";
import MentorHeader from "../../components/commonComponents/mentorHeader";
import MentorRatingBody from "../../components/mentorComponents/Ratings/mentorRatingsBody";

const MentorMyRatingsPage = () => {
	return (
		<div className="flex flex-col min-h-screen">
			<MentorHeader />
			<div className="flex flex-1 bg-slate-50 overflow-y-auto">
				<MentorAccountSidebar />
				<main className="flex-1 mt-16 p-6 md:p-8 lg:p-10 overflow-y-auto">
					<MentorRatingBody/>
				</main>
			</div>
		</div>
	);
};

export default MentorMyRatingsPage;
