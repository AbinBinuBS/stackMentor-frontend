import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

interface MentorProtectiveCheckLogoutProps {
	element: React.ReactNode;
}

const MentorProtectiveCheckLogout: React.FC<
	MentorProtectiveCheckLogoutProps
> = ({ element }) => {
	const accessToken = useSelector(
		(state: RootState) => state.mentor.accessToken
	);
	const location = useLocation();

	return !accessToken ? (
		<>{element}</>
	) : (
		<Navigate to="/mentor/home" state={{ from: location }} />
	);
};

export default MentorProtectiveCheckLogout;
