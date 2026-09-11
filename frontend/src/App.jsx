import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Public Auth & Informational Pages
import Login from './pages/Login';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import TermsAndConditions from './pages/TermsAndConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Contact from './pages/Contact';

// Operations / Admin Pages
import Dashboard from './pages/Dashboard';
import AdminDispatch from './pages/AdminDispatch';
import DocumentVerification from './pages/DocumentVerification';
import AuditLogs from './pages/AuditLogs';
import Customers from './pages/Customers';
import Vehicles from './pages/Vehicles';
import Drivers from './pages/Drivers';
import Shipments from './pages/Shipments';
import Payments from './pages/Payments';
import Invoices from './pages/Invoices';
import Complaints from './pages/Complaints';
import Simulator from './pages/Simulator';
import CallRequestsAdmin from './pages/CallRequestsAdmin';
import SupportSettings from './pages/SupportSettings';

// Shipper / Customer Pages
import ShipperDashboard from './pages/ShipperDashboard';
import CreateShipment from './pages/CreateShipment';

// Cargo Partner Pages
import PartnerDashboard from './pages/PartnerDashboard';
import PartnerFleet from './pages/PartnerFleet';
import PartnerDrivers from './pages/PartnerDrivers';

// Driver Pages
import DriverDashboard from './pages/DriverDashboard';
import DriverTrips from './pages/DriverTrips';
import DriverDocuments from './pages/DriverDocuments';

// Root Dispatcher based on active Role
const RootRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (user.emailVerified === false) {
    return <Navigate to={`/verify-email?email=${encodeURIComponent(user.email || '')}`} replace />;
  }
  if (user.role === 'ROLE_ADMIN' || user.role === 'ROLE_EMPLOYEE') {
    return <Navigate to="/admin/dashboard" replace />;
  }
  if (user.role === 'ROLE_CARGO_PARTNER') {
    return <Navigate to="/partner/dashboard" replace />;
  }
  if (user.role === 'ROLE_DRIVER') {
    return <Navigate to="/driver/dashboard" replace />;
  }
  return <Navigate to="/shipper/dashboard" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Authentication & Informational Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ForgotPassword />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/contact-us" element={<Contact />} />
          <Route path="/about" element={<Contact />} />

          {/* Root Redirect */}
          <Route path="/" element={<RootRedirect />} />

          {/* ================= ADMIN & EMPLOYEE PORTAL ================= */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_EMPLOYEE']}>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/dispatch" element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_EMPLOYEE']}>
              <AdminDispatch />
            </ProtectedRoute>
          } />
          <Route path="/admin/support" element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_EMPLOYEE']}>
              <SupportSettings />
            </ProtectedRoute>
          } />
          <Route path="/admin/call-requests" element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_EMPLOYEE']}>
              <CallRequestsAdmin />
            </ProtectedRoute>
          } />
          <Route path="/admin/documents" element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_EMPLOYEE']}>
              <DocumentVerification />
            </ProtectedRoute>
          } />
          <Route path="/admin/fleet" element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_EMPLOYEE']}>
              <Vehicles />
            </ProtectedRoute>
          } />
          <Route path="/admin/drivers" element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_EMPLOYEE']}>
              <Drivers />
            </ProtectedRoute>
          } />
          <Route path="/admin/customers" element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_EMPLOYEE']}>
              <Customers />
            </ProtectedRoute>
          } />
          <Route path="/admin/shipments" element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_EMPLOYEE']}>
              <Shipments />
            </ProtectedRoute>
          } />
          <Route path="/admin/complaints" element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_EMPLOYEE']}>
              <Complaints />
            </ProtectedRoute>
          } />
          <Route path="/admin/payments" element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_EMPLOYEE']}>
              <Payments />
            </ProtectedRoute>
          } />
          <Route path="/admin/audit-logs" element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_EMPLOYEE']}>
              <AuditLogs />
            </ProtectedRoute>
          } />
          <Route path="/admin/simulator" element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_EMPLOYEE']}>
              <Simulator />
            </ProtectedRoute>
          } />

          {/* ================= CARGO PARTNER PORTAL ================= */}
          <Route path="/partner/dashboard" element={
            <ProtectedRoute allowedRoles={['ROLE_CARGO_PARTNER', 'ROLE_ADMIN']}>
              <PartnerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/partner/fleet" element={
            <ProtectedRoute allowedRoles={['ROLE_CARGO_PARTNER', 'ROLE_ADMIN']}>
              <PartnerFleet />
            </ProtectedRoute>
          } />
          <Route path="/partner/drivers" element={
            <ProtectedRoute allowedRoles={['ROLE_CARGO_PARTNER', 'ROLE_ADMIN']}>
              <PartnerDrivers />
            </ProtectedRoute>
          } />

          {/* ================= SHIPPER / CUSTOMER PORTAL ================= */}
          <Route path="/shipper/dashboard" element={
            <ProtectedRoute allowedRoles={['ROLE_SHIPPER', 'ROLE_CUSTOMER']}>
              <ShipperDashboard />
            </ProtectedRoute>
          } />
          <Route path="/shipper/create-shipment" element={
            <ProtectedRoute allowedRoles={['ROLE_SHIPPER', 'ROLE_CUSTOMER', 'ROLE_ADMIN', 'ROLE_EMPLOYEE']}>
              <CreateShipment />
            </ProtectedRoute>
          } />
          <Route path="/shipper/shipments" element={
            <ProtectedRoute allowedRoles={['ROLE_SHIPPER', 'ROLE_CUSTOMER']}>
              <Shipments />
            </ProtectedRoute>
          } />
          <Route path="/shipper/invoices" element={
            <ProtectedRoute allowedRoles={['ROLE_SHIPPER', 'ROLE_CUSTOMER', 'ROLE_CARGO_PARTNER', 'ROLE_ADMIN']}>
              <Invoices />
            </ProtectedRoute>
          } />
          <Route path="/shipper/complaints" element={
            <ProtectedRoute allowedRoles={['ROLE_SHIPPER', 'ROLE_CUSTOMER']}>
              <Complaints />
            </ProtectedRoute>
          } />

          {/* ================= DRIVER PORTAL ================= */}
          <Route path="/driver/dashboard" element={
            <ProtectedRoute allowedRoles={['ROLE_DRIVER']}>
              <DriverDashboard />
            </ProtectedRoute>
          } />
          <Route path="/driver/trips" element={
            <ProtectedRoute allowedRoles={['ROLE_DRIVER']}>
              <DriverTrips />
            </ProtectedRoute>
          } />
          <Route path="/driver/documents" element={
            <ProtectedRoute allowedRoles={['ROLE_DRIVER']}>
              <DriverDocuments />
            </ProtectedRoute>
          } />

          {/* Backward compatibility aliases */}
          <Route path="/shipments" element={<RootRedirect />} />
          <Route path="/vehicles" element={<Navigate to="/admin/fleet" replace />} />
          <Route path="/drivers" element={<Navigate to="/admin/drivers" replace />} />
          <Route path="/customers" element={<Navigate to="/admin/customers" replace />} />
          <Route path="/payments" element={<Navigate to="/admin/payments" replace />} />
          <Route path="/complaints" element={<Navigate to="/admin/complaints" replace />} />
          <Route path="/simulator" element={<Navigate to="/admin/simulator" replace />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
