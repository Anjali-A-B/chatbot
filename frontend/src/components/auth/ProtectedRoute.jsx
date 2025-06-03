// ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const getUserFromStorage = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

const ProtectedRoute = ({ children }) => {
  const user = getUserFromStorage();
  if (!user || !user.token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
