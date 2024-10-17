import React from "react";
import AdminDashboardSidebar from "../../components/adminComponents/Dashboard/adminDashboardSidebar";
import AdminMentorListBody from "../../components/adminComponents/MentorList/adminmentorListBody";
import AdminHeader from "../../components/commonComponents/AdminHeader";

const AdminMentorListPage: React.FC = () => {
	return (
		<div className="flex flex-col bg-gray-100 min-h-screen">
			<AdminHeader />
			<div className="flex mt-16 flex-1 ">
				<AdminDashboardSidebar />
				<main className="flex-1 ml-64 mt-16 overflow-y-auto lg:ml-80 xl:ml-96">
					<AdminMentorListBody />
				</main>
			</div>
		</div>
	);
};

export default AdminMentorListPage;
