import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const getHomeRouteForRole = (role) => {
  switch (role) {
    case 'ROLE_ADMIN':
    case 'ROLE_EMPLOYEE':
      return '/admin/dashboard';
    case 'ROLE_CARGO_PARTNER':
      return '/partner/dashboard';
    case 'ROLE_DRIVER':
      return '/driver/dashboard';
    case 'ROLE_SHIPPER':
    case 'ROLE_CUSTOMER':
    case 'ROLE_USER':
    default:
      return '/shipper/dashboard';
  }
};

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (user.emailVerified === false) {
    return <Navigate to={`/verify-email?email=${encodeURIComponent(user.email || '')}`} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const isAllowed =
      allowedRoles.includes(user.role) ||
      (allowedRoles.includes('ROLE_SHIPPER') && (user.role === 'ROLE_CUSTOMER' || user.role === 'ROLE_USER')) ||
      (allowedRoles.includes('ROLE_CUSTOMER') && (user.role === 'ROLE_SHIPPER' || user.role === 'ROLE_USER')) ||
      (allowedRoles.includes('ROLE_ADMIN') && user.role === 'ROLE_EMPLOYEE');

    if (!isAllowed) {
      const home = getHomeRouteForRole(user.role);
      if (location.pathname === home) {
        return children;
      }
      return <Navigate to={home} replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
