import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store'; 

interface MenteeLoginProtectiveCheckProps {
  element: React.ReactNode;
}

const MenteeLoginProtectiveCheck: React.FC<MenteeLoginProtectiveCheckProps> = ({ element }) => {
  const accessToken = useSelector((state: RootState) => state.mentee.accessToken);
  const location = useLocation();

  return !accessToken ? (
    <>{element}</>
  ) : (
    <Navigate to="/" state={{ from: location }} />
  );
};

export default MenteeLoginProtectiveCheck;
