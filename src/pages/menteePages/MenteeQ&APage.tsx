import React, { useState } from "react";
import MenteeHeader from "../../components/commonComponents/menteeHeader";
import QABody from "../../components/menteeComponents/Q&A/qaBody";
import QASidebar from "../../components/menteeComponents/Q&A/qaSidebar";

const QAPage: React.FC = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

	return (
		<div className="flex flex-col min-h-screen bg-gray-100">
			<MenteeHeader />
			<div className="flex flex-col lg:flex-row mt-32">
				<div className="lg:sticky lg:top-36 lg:self-start">
					<QASidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
				</div>
				<div className="flex-grow">
					<QABody />
				</div>
			</div>
		</div>
	);
};

export default QAPage;
