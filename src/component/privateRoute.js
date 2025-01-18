import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('auth_token');

  // If the user is not authenticated, redirect to login
  if (!token) {
    return <Navigate to="/" />;
  }

  // If authenticated, render the children (protected route)
  return children;
};

export default PrivateRoute;
