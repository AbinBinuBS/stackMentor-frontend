import { useState } from "react";
import MenteeHeader from "../../components/commonComponents/menteeHeader";
import QASidebar from "../../components/menteeComponents/Q&A/qaSidebar";
import AskQuestionBody from "../../components/menteeComponents/askQuestion/askQuestionBody";

const AskQuestionPage = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

	return (
		<div className="flex flex-col min-h-screen bg-gray-100">
			<MenteeHeader />
			<div className="flex flex-col lg:flex-row mt-36">
				<div className="lg:sticky lg:top-36 lg:self-start">
					<QASidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
				</div>
				<div className="flex-grow">
					<AskQuestionBody />
				</div>
			</div>
		</div>
	);
};

export default AskQuestionPage;
