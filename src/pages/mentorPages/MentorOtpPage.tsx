import MentorSidebar from "../../components/commonComponents/MentorSidebar";
import MentorOtpBody from "../../components/mentorComponents/Register/mentorOtpBody";

const MentorOtpPage = () => {
	return (
		<div className="flex flex-col lg:flex-row w-full h-screen">
			<MentorSidebar />
			<MentorOtpBody />
		</div>
	);
};

export default MentorOtpPage;
