import MentorSidebar from "../../components/commonComponents/mentorSidebar";
import MentorForgotPasswordEmailBody from "../../components/mentorComponents/Forgot Password/mentorForgotPasswordBody";

const MentorForgotPasswordEmailPage = () => {
	return (
		<div className="flex flex-col lg:flex-row w-full h-screen">
			<MentorSidebar />
			<MentorForgotPasswordEmailBody />
		</div>
	);
};
export default MentorForgotPasswordEmailPage;
