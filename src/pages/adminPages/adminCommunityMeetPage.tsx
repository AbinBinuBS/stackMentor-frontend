import AdminCommunityMeetBody from "../../components/adminComponents/Community-Meet/adminCommunityMeetBody";
import AdminDashboardSidebar from "../../components/adminComponents/Dashboard/adminDashboardSidebar";
import AdminHeader from "../../components/commonComponents/adminHeader";

const AdminCommunityMeetPage = () => {
	return (
		<div className="flex flex-col min-h-screen">
			<AdminHeader />
			<div className="flex flex-1">
				<AdminDashboardSidebar />
				<main className="flex-1 ml-64 mt-36 p-6 overflow-y-auto">
					<AdminCommunityMeetBody />
				</main>
			</div>
		</div>
	);
};

export default AdminCommunityMeetPage;
