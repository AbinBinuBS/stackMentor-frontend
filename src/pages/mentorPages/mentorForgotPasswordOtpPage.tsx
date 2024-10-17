import MentorSidebar from "../../components/commonComponents/mentorSidebar";
import MentorForgotPasswordBody from "../../components/mentorComponents/Forgot Password/mentorForgotPasswordOtpBody";

const MentorForgotPasswordOtpPage = () => {
	return (
		<div className="flex flex-col lg:flex-row w-full h-screen">
			<MentorSidebar />
			<MentorForgotPasswordBody />
		</div>
	);
};
export default MentorForgotPasswordOtpPage;
