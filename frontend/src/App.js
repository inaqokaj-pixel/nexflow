import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import { AuthProvider, useAuth } from './AuthContext';
import Sidebar from './components/Navbar';
import Landing from './pages/Landing';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import ShipperDashboard from './pages/ShipperDashboard';
import CarrierDashboard from './pages/CarrierDashboard';
import AdminDashboard from './pages/AdminDashboard';
import BookShipment from './pages/BookShipment';
import MyBookings from './pages/MyBookings';
import FleetManager from './pages/FleetManager';
import Notifications from './pages/Notifications';

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
  return <ShipperDashboard />;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/"         element={<Landing />} />
      <Route path="/login"    element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />

      <Route path="/dashboard"        element={<ProtectedLayout><Dashboard /></ProtectedLayout>} />
      <Route path="/bookings"         element={<ProtectedLayout><MyBookings /></ProtectedLayout>} />
      <Route path="/book"             element={<ProtectedLayout><BookShipment /></ProtectedLayout>} />
      <Route path="/carrier/fleet"    element={<ProtectedLayout><FleetManager /></ProtectedLayout>} />
      <Route path="/carrier/bookings" element={<ProtectedLayout><MyBookings /></ProtectedLayout>} />
      <Route path="/notifications"    element={<ProtectedLayout><Notifications /></ProtectedLayout>} />

      <Route path="*" element={<Navigate to={user ? '/dashboard' : '/'} replace />} />
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
