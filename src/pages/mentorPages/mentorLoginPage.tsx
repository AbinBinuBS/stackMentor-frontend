import MentorSidebar from "../../components/commonComponents/mentorSidebar.tsx";
import MentorLoginBody from "../../components/mentorComponents/Login/mentorLoginBody.tsx";

const MentorLoginPage = () => {
	return (
		<div className="flex flex-col lg:flex-row w-full h-screen">
			<MentorSidebar />
			<MentorLoginBody />
		</div>
	);
};

export default MentorLoginPage;
