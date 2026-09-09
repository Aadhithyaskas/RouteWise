import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'

export default function ProtectedRoute({ allowedRoles, children }) {
  const { isAuthenticated, role, getDefaultRoute } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={getDefaultRoute()} replace />
  }

  return children
}
