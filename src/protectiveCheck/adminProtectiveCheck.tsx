import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

interface AdminProtectiveCheckProps {
	element: React.ReactNode;
}

const AdminProtectiveCheck: React.FC<AdminProtectiveCheckProps> = ({
	element,
}) => {
	const accessToken = useSelector(
		(state: RootState) => state.admin.accessToken
	);
	const location = useLocation();

	return accessToken ? (
		<>{element}</>
	) : (
		<Navigate to="/admin" state={{ from: location }} />
	);
};

export default AdminProtectiveCheck;
