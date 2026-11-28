import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './landing/Landing';
import Login from './pages/auth/Login';
import ChangePassword from './pages/auth/ChangePassword';
import DemoKomponen from './pages/DemoKomponen';
import ProtectedRoute from './components/ProtectedRoute';

import TenantLayout from './components/tenant/TenantLayout';
import TenantDashboardPage from './pages/tenant/TenantDashboardPage';
import TenantRoomPage from './pages/tenant/TenantRoomPage';
import TenantBillsPage from './pages/tenant/TenantBillsPage';
import TenantComplaintsPage from './pages/tenant/TenantComplaintsPage';
import TenantProfilePage from './pages/tenant/TenantProfilePage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="login" element={<Login />} />
        <Route path="change-password" element={<ChangePassword />} />
        <Route path="demo-komponen" element={<DemoKomponen />} />

        {/* Route Penghuni dilindungi ProtectedRoute */}
        <Route path="/penghuni" element={
            <ProtectedRoute>
              <TenantLayout />
            </ProtectedRoute>
          }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<TenantDashboardPage />} />
          <Route path="kamar" element={<TenantRoomPage />} />
          <Route path="tagihan" element={<TenantBillsPage />} />
          <Route path="keluhan" element={<TenantComplaintsPage />} />
          <Route path="profil" element={<TenantProfilePage />} />
        </Route>

        {/* Redirect route tidak dikenal ke landing page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}