// routes/PrivateRoute.js
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function PrivateRoute({ children, role }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null; // or spinner

  // Not logged in
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Role mismatch
  if (role && user.role !== role) {
    return <Navigate to={`/${user.role.toLowerCase()}/dashboard`} replace />;
  }

  return children;
}
