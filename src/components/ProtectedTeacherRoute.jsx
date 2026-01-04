import React from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../AuthContext';

const ProtectedTeacherRoute = ({ children }) => {
  const { token, userInfo } = useAuth() || {};
  const location = useLocation();

  if (!token || !userInfo.is_teacher) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedTeacherRoute;
