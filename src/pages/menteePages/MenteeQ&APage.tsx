import React, { useState } from "react";
import MenteeHeader from "../../components/commonComponents/menteeHeader";
import QABody from "../../components/menteeComponents/Q&A/qaBody";
import Sidebar from "../../components/menteeComponents/Account/accountSidebar";

const QAPage: React.FC = () => {
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
			<div className="flex flex-col lg:flex-row mt-32">
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
					<QABody />
				</div>
			</div>
		</div>
	);
};

export default QAPage;
