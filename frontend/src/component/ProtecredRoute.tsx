import React from "react";
import { Navigate, useLocation } from "react-router-dom";

// Example authentication checker — replace with your real auth logic
const isAuthenticated = (): boolean => {
  return localStorage.getItem("token") !== null;
};

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
