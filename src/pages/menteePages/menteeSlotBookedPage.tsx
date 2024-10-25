import React, { useState } from "react";
import MenteeHeader from "../../components/commonComponents/menteeHeader";
import MySlotBody from "../../components/menteeComponents/mySlot/mySlotBody";
import { Calendar, User, Wallet } from "lucide-react";
import Sidebar from "../../components/menteeComponents/Account/accountSidebar";

const MenteeSlotBookedPage: React.FC = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

	const accountMenuItems = [
		{
		  path: '/account',
		  label: 'Account',
		  icon: <User size={18} />
		},
		{
		  path: '/MySlot',
		  label: 'My Slots',
		  icon: <Calendar size={18} />
		},
		{
		  path: '/wallet',
		  label: 'Wallet',
		  icon: <Wallet size={18} />
		}
	  ];

    return(
        <div className="flex flex-col min-h-screen bg-gray-100">
			<MenteeHeader />
			<div className="flex flex-col lg:flex-row mt-32">
				<div className="lg:sticky lg:top-36 lg:self-start">
				<Sidebar
					isOpen={isSidebarOpen}
					setIsOpen={setIsSidebarOpen}
					menuItems={accountMenuItems}
					activeColors={{
					bg: "bg-blue-200",
					text: "text-blue-700"
					}}
				/>
				</div>
				<div className="flex-grow">
                <MySlotBody />
				</div>
			</div>
		</div>
    )
};

export default MenteeSlotBookedPage;
