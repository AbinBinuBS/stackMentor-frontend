import MentorSidebar from "../../components/commonComponents/MentorSidebar";
import MentorForgotPasswordBody from "../../components/mentorComponents/forgot Password/mentorForgotPasswordOtpBody";

const MentorForgotPasswordOtpPage = () => {
	return (
		<div className="flex flex-col lg:flex-row w-full h-screen">
			<MentorSidebar />
			<MentorForgotPasswordBody />
		</div>
	);
};
export default MentorForgotPasswordOtpPage;
