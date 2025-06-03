import React from "react";
import { Navigate } from "react-router-dom";

const getUserFromStorage = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

const HomeRedirect = () => {
  const user = getUserFromStorage();

  if (!user || !user.token) {
    // No user logged in — show login page
    return <Navigate to="/login" replace />;
  }

  // Logged in user
  if (user.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  // Only user or company roles go to index
  if (user.role === "user" || user.role === "company") {
    return <Navigate to="/index" replace />;
  }

  // fallback: if role unknown, send to login
  return <Navigate to="/login" replace />;
};

export default HomeRedirect;
