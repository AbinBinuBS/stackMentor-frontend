import MentorSidebar from "../../components/commonComponents/mentorSidebar";
import MentorForgotPasswordResetBody from "../../components/mentorComponents/Forgot Password/mentorForgotPasswordResetBody";

const MentorForgotPasswordResetPage = () => {
	return (
		<div className="flex flex-col lg:flex-row w-full h-screen">
			<MentorSidebar />
			<MentorForgotPasswordResetBody />
		</div>
	);
};

export default MentorForgotPasswordResetPage;
