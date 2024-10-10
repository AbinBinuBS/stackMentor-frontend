import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

interface AdminProtectiveCheckLogoutProps {
	element: React.ReactNode;
}

const AdminProtectiveCheckLogout: React.FC<AdminProtectiveCheckLogoutProps> = ({
	element,
}) => {
	const accessToken = useSelector(
		(state: RootState) => state.admin.accessToken
	);
	const location = useLocation();

	return !accessToken ? (
		<>{element}</>
	) : (
		<Navigate to="/admin/dashboard" state={{ from: location }} />
	);
};

export default AdminProtectiveCheckLogout;
