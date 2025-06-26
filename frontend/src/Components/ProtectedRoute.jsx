import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element }) => {
  const isConnected = sessionStorage.getItem('walletAddress');

  return isConnected ? element : <Navigate to="/connect-wallet" replace />;
};

export default ProtectedRoute;
