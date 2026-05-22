import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import AdminLogin from "../pages/auth/AdminLogin";
import Register from "../pages/auth/Register";
import SalespersonJobs from "../pages/salesperson/SalespersonJobs";
import SalespersonLogin from "../pages/salesperson/SalespersonLogin";
import AdminDashboard from "../pages/admin/AdminDashboard";
import MapView from "../pages/MapView";
import CustomerForm from "../pages/customer/CustomerForm";
// import JobCard from "../components/salesperson/JobCard";

export default function AppRoutes() {
  return (
    <Routes>

      {/* Public Routes */}
      <Route path="/" element={<AdminLogin />} />
      <Route path="/salesperson-login" element={<SalespersonLogin />} />
      <Route path="/register" element={<Register />} />
      <Route path="/customer-request" element={<CustomerForm />} />
      {/* <Route path="/job-card" element={<JobCard/>}/> */}
      {/* Admin Protected */}
      <Route
        path="/admin-dashboard"
        element={
          <PrivateRoute role="ADMIN">
            <AdminDashboard />
          </PrivateRoute>
        }
      />

      {/* Salesperson Protected */}
      <Route
        path="/salesperson-jobs"
        element={
         
            <SalespersonJobs />
        
        }
      />

      <Route
        path="/map"
        element={
      
            <MapView />
         
        }
      />

    </Routes>
  );
}
