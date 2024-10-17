import AdminDashboardSidebar from "../../components/adminComponents/Dashboard/adminDashboardSidebar";
import AdminUserListBody from "../../components/adminComponents/UserList/adminUserListBody";
import AdminHeader from "../../components/commonComponents/AdminHeader";

const AdminUserListPage = () => {
	return (
		<div className="flex flex-col bg-gray-100 min-h-screen">
			<AdminHeader />
			<div className="flex mt-16 flex-1 ">
				<AdminDashboardSidebar />
				<main className="flex-1 ml-64 mt-16 overflow-y-auto lg:ml-80 xl:ml-96">
					<AdminUserListBody />
				</main>
			</div>
		</div>
	);
};

export default AdminUserListPage;
