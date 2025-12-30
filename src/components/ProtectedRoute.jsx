import React from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../AuthContext';

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth() || {};
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
