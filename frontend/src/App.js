import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import { AuthProvider, useAuth } from './AuthContext';
import Sidebar from './components/Navbar';

// Public pages
import Landing from './pages/Landing';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import Solutions from './pages/Solutions';
import Platform from './pages/Platform';
import Pricing from './pages/Pricing';
import Resources from './pages/Resources';
import Carriers from './pages/Carriers';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

// Protected pages
import ShipperDashboard from './pages/ShipperDashboard';
import CarrierDashboard from './pages/CarrierDashboard';
import AdminDashboard from './pages/AdminDashboard';
import BookShipment from './pages/BookShipment';
import MyBookings from './pages/MyBookings';
import FleetManager from './pages/FleetManager';
import Notifications from './pages/Notifications';
import TrackingPage from './pages/TrackingPage';

function ProtectedLayout({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', background:'var(--bg)' }}>
      <div className="spinner" style={{ width:36, height:36 }} />
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'admin') return <>{children}</>;
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">{children}</div>
    </div>
  );
}

function Dashboard() {
  const { user } = useAuth();
  if (user?.role === 'admin')   return <AdminDashboard />;
  if (user?.role === 'carrier') return <CarrierDashboard />;
  if (user?.role === 'shipper') return <ShipperDashboard />;
  return <Navigate to="/" replace />;
}

function AppRoutes() {
  const { user } = useAuth();
  const postLoginPath = (!user?.role || user.role === 'user') ? '/' : '/dashboard';

  return (
    <Routes>
      {/* ── Public marketing pages ── */}
      <Route path="/"          element={<Landing />} />
      <Route path="/solutions" element={<Solutions />} />
      <Route path="/platform"  element={<Platform />} />
      <Route path="/pricing"   element={<Pricing />} />
      <Route path="/resources" element={<Resources />} />
      <Route path="/carriers"  element={<Carriers />} />
      <Route path="/about"     element={<About />} />
      <Route path="/contact"   element={<Contact />} />

      {/* ── Auth ── */}
      <Route path="/login"    element={user ? <Navigate to={postLoginPath} replace /> : <LoginPage />} />
      <Route path="/register" element={user ? <Navigate to={postLoginPath} replace /> : <RegisterPage />} />

      {/* ── Protected app ── */}
      <Route path="/dashboard"        element={<ProtectedLayout><Dashboard /></ProtectedLayout>} />
      <Route path="/bookings"         element={<ProtectedLayout><MyBookings /></ProtectedLayout>} />
      <Route path="/book"             element={<ProtectedLayout><BookShipment /></ProtectedLayout>} />
      <Route path="/tracking"         element={<ProtectedLayout><TrackingPage /></ProtectedLayout>} />
      <Route path="/carrier/fleet"    element={<ProtectedLayout><FleetManager /></ProtectedLayout>} />
      <Route path="/carrier/bookings" element={<ProtectedLayout><MyBookings /></ProtectedLayout>} />
      <Route path="/notifications"    element={<ProtectedLayout><Notifications /></ProtectedLayout>} />

      {/* ── 404 ── */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
