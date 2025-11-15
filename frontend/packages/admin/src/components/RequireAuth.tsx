import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@quiz-platform/ui";

const RequireAuth: React.FC = () => {
  const { isAuthenticated, initializing } = useAuth() as any;

  // While initializing (silent refresh), don't redirect yet
  if (initializing) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default RequireAuth;
