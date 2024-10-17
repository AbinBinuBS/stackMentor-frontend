import AdminLoginBody from "../../components/adminComponents/Login/adminLoginBody";
import AdminSidebar from "../../components/commonComponents/AdminSidebar";

const MentorLogin = () => {
	return (
		<div className="flex w-full h-screen">
			<AdminSidebar />
			<AdminLoginBody />
		</div>
	);
};

export default MentorLogin;
