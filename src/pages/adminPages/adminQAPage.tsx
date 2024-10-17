import AdminDashboardSidebar from "../../components/adminComponents/Dashboard/adminDashboardSidebar";
import AdminQABody from "../../components/adminComponents/QA/adminQABody";
import AdminHeader from "../../components/commonComponents/adminHeader";

const AdminQAPage = () => {
	return (
		<div className="flex flex-col min-h-screen">
			<AdminHeader />
			<div className="flex flex-1">
				<AdminDashboardSidebar />
				<main className="flex-1 ml-64 mt-36 p-6 overflow-y-auto">
					<AdminQABody />
				</main>
			</div>
		</div>
	);
};
export default AdminQAPage;
