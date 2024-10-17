import MenteeHeader from "../../components/commonComponents/menteeHeader";
import MentorDisplayBody from "../../components/menteeComponents/MentorDisplay/mentorDisplayBody";

const MenteeDisplayMentorPage = () => {
	return (
		<div className="flex flex-col bg-slate-100 min-h-screen">
			<MenteeHeader />
			<div className="flex flex-grow mt-32 justify-center">
				<main className="w-full max-w-4xl p-6 overflow-hidden">
					<MentorDisplayBody />
				</main>
			</div>
		</div>
	);
};

export default MenteeDisplayMentorPage;
