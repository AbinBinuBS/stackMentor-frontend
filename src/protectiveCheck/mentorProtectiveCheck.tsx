import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store'; 

interface MentorProtectiveCheckProps {
  element: React.ReactNode;
}

const MentorProtectiveCheck: React.FC<MentorProtectiveCheckProps> = ({ element }) => {
  const accessToken = useSelector((state: RootState) => state.mentor.accessToken);
  const location = useLocation();

  return accessToken ? (
    <>{element}</>
  ) : (
    <Navigate to="/mentor" state={{ from: location }} />
  );
};

export default MentorProtectiveCheck;
