import React from "react";
import MentorHeader from "../../components/commonComponents/MentorHeader";
import MentorHomeBody from "../../components/mentorComponents/Home/mentorHomeBody";

const MentorHomePage: React.FC = () => {
	return (
		<>
			<MentorHeader />
			<MentorHomeBody />
		</>
	);
};

export default MentorHomePage;
