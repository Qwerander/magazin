import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { selectCurrentToken, selectIsAdmin } from '../store/slices/authSlice';

const PrivateRoute = ({ adminOnly = false }) => {
  const token = useSelector(selectCurrentToken);
  const isAdmin = useSelector(selectIsAdmin);

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default PrivateRoute;