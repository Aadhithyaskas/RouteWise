import { Home } from 'lucide-react'
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import AppShell from './components/AppShell.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import { useAuth } from './context/useAuth.js'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import AssignJobPage from './pages/admin/AssignJobPage.jsx'
import MapViewPage from './pages/admin/MapViewPage.jsx'
import SalespersonManagementPage from './pages/admin/SalespersonManagementPage.jsx'
import SalespersonThresholdSettingsPage from './pages/admin/SalespersonThresholdSettingsPage.jsx'
import BootstrapAdminPage from './pages/auth/BootstrapAdminPage.jsx'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage.jsx'
import LoginPage from './pages/auth/LoginPage.jsx'
import CustomerRequestPage from './pages/customer/CustomerRequestPage.jsx'
import CustomerSuccessPage from './pages/customer/CustomerSuccessPage.jsx'
import FinanceCustomerDetailPage from './pages/finance/FinanceCustomerDetailPage.jsx'
import FinanceDashboard from './pages/finance/FinanceDashboard.jsx'
import JobDetailPage from './pages/sales/JobDetailPage.jsx'
import NearbyCustomersPage from './pages/sales/NearbyCustomersPage.jsx'
import SalesDashboard from './pages/sales/SalesDashboard.jsx'
import SalesRouteMapPage from './pages/sales/SalesRouteMapPage.jsx'
import SalesThresholdSettingsPage from './pages/sales/SalesThresholdSettingsPage.jsx'
import UploadPhotoPage from './pages/sales/UploadPhotoPage.jsx'
import RegisterPage from './pages/auth/RegisterPage.jsx'
import LandingPage from './pages/LandingPage.jsx'

function RoleRedirect() {
  const { isAuthenticated, getDefaultRoute } = useAuth()
  return <Navigate to={isAuthenticated ? getDefaultRoute() : '/login'} replace />
}

function LandingShortcut() {
  const location = useLocation()

  if (location.pathname === '/' || location.pathname === '/register') return null

  return (
    <Link
      to="/"
      className="fixed bottom-5 left-5 z-50 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/95 px-3 py-2.5 text-sm font-semibold text-slate-800 shadow-lg shadow-slate-300/40 backdrop-blur transition hover:border-sky-200 hover:bg-sky-50 focus:outline-none focus:ring-4 focus:ring-sky-100"
      aria-label="Go to RouteWise landing page"
    >
      <Home size={16} />
      <span className="hidden sm:inline">Home</span>
    </Link>
  )
}

function App() {
  return (
    <>
      <LandingShortcut />
      <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/workspace" element={<RoleRedirect />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/setup/admin" element={<BootstrapAdminPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/request" element={<CustomerRequestPage />} />
      <Route path="/request/success" element={<CustomerSuccessPage />} />

      <Route
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'SALESPERSON', 'FINANCE']}>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/assign-job"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AssignJobPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/salespersons"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <SalespersonManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/salespersons/:salespersonId/thresholds"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <SalespersonThresholdSettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/map-view"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <MapViewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sales/dashboard"
          element={
            <ProtectedRoute allowedRoles={['SALESPERSON']}>
              <SalesDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sales/jobs/:jobId"
          element={
            <ProtectedRoute allowedRoles={['SALESPERSON']}>
              <JobDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sales/customers/:customerId/upload-photo"
          element={
            <ProtectedRoute allowedRoles={['SALESPERSON']}>
              <UploadPhotoPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sales/nearby-customers"
          element={
            <ProtectedRoute allowedRoles={['SALESPERSON']}>
              <NearbyCustomersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sales/route-map"
          element={
            <ProtectedRoute allowedRoles={['SALESPERSON']}>
              <SalesRouteMapPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sales/thresholds"
          element={
            <ProtectedRoute allowedRoles={['SALESPERSON']}>
              <SalesThresholdSettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/finance/dashboard"
          element={
            <ProtectedRoute allowedRoles={['FINANCE']}>
              <FinanceDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/finance/customers/:customerId"
          element={
            <ProtectedRoute allowedRoles={['FINANCE']}>
              <FinanceCustomerDetailPage />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App
