import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { ProtectiveCheckProps } from "../interfaces/ImenteeInferfaces";


const MenteeLogoutProtectiveCheck: React.FC<ProtectiveCheckProps> = ({
	element,
}) => {
	const accessToken = useSelector(
		(state: RootState) => state.mentee.accessToken
	);
	const location = useLocation();

	return accessToken ? <Navigate to="/" state={{ from: location }} /> : element;
};

export default MenteeLogoutProtectiveCheck;
