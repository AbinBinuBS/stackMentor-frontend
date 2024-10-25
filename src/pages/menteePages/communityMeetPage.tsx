import { useState } from "react";
import MenteeHeader from "../../components/commonComponents/menteeHeader";
import CommunityMeetBody from "../../components/menteeComponents/Community-Meet/communirtMeetBody";
import Sidebar from "../../components/menteeComponents/Account/accountSidebar";

const CommunityMeetPage = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
	const qaMenuItems = [
		{
		  path: '/questionsAsked',
		  label: 'Questions Asked'
		},
		{
		  path: '/askQuestion',
		  label: 'Ask Questions'
		},
		{
		  path: '/communityMeet',
		  label: 'Community Meet'
		}
	  ];
	return (
		<div className="flex flex-col min-h-screen bg-gray-100">
			<MenteeHeader />
			<div className="flex flex-col lg:flex-row mt-36">
				<div className="lg:sticky lg:top-36 lg:self-start">
				<Sidebar
					isOpen={isSidebarOpen}
					setIsOpen={setIsSidebarOpen}
					menuItems={qaMenuItems}
					activeColors={{
						bg: "bg-pink-200",
						text: "text-pink-700"
					}}
				/>	
				</div>
				<div className="flex-grow">
					<CommunityMeetBody />
				</div>
			</div>
		</div>
	);
};

export default CommunityMeetPage;
