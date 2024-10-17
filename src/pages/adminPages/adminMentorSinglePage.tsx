import AdminMentorDetailsBody from "../../components/adminComponents/MentorDetails/adminMentorDetailsBody";
import AdminHeader from "../../components/commonComponents/AdminHeader";

const AdminMentorSinglePage = () => {
	return (
		<div className="flex flex-col min-h-screen bg-gray-100">
			<AdminHeader />
			<div className="flex flex-1 mt-36 justify-center">
				<AdminMentorDetailsBody />
			</div>
		</div>
	);
};

export default AdminMentorSinglePage;
