import { useState } from "react";
import MenteeHeader from "../../components/commonComponents/MenteeHeader";
import QASidebar from "../../components/menteeComponents/Q&A/qaSidebar";
import CommunityMeetBody from "../../components/menteeComponents/Community-Meet/communirtMeetBody";

const CommunityMeetPage = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
	return (
		<div className="flex flex-col min-h-screen bg-gray-100">
			<MenteeHeader />
			<div className="flex flex-col lg:flex-row mt-36">
				<div className="lg:sticky lg:top-36 lg:self-start">
					<QASidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
				</div>
				<div className="flex-grow">
					<CommunityMeetBody />
				</div>
			</div>
		</div>
	);
};

export default CommunityMeetPage;
