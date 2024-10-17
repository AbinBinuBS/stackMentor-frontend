import React, { useState } from "react";
import MenteeHeader from "../../components/commonComponents/menteeHeader";
import WalletBody from "../../components/menteeComponents/Wallet/walletBody";
import AccountSidebar from "../../components/menteeComponents/Account/accountSidebar";

const WalletPage: React.FC = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

	return (
		<div className="flex flex-col min-h-screen bg-gray-100">
		<MenteeHeader />
		<div className="flex flex-col lg:flex-row mt-32">
			<div className="lg:sticky lg:top-36 lg:self-start">
				<AccountSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
			</div>
			<div className="flex-grow">
			<WalletBody/>
			</div>
		</div>
	</div>
	);
};

export default WalletPage;
