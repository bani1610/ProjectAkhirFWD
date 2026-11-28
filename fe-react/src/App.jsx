import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './landing/Landing'
import Login from './pages/auth/Login'
import ChangePassword from './pages/auth/ChangePassword'
import DemoKomponen from './pages/DemoKomponen'

import TenantLayout from './components/TenantLayout';
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
        <Route path="login" element={<Login />}/>
        <Route path="change-password" element={<ChangePassword />}/>
        <Route path="demo-komponen" element={<DemoKomponen />} />

        <Route path="/penghuni" element={<TenantLayout />}>
          <Route path="dashboard" element={<TenantDashboardPage />} />
          <Route path="kamar" element={<TenantRoomPage />} />
          <Route path="tagihan" element={<TenantBillsPage />} />
          <Route path="keluhan" element={<TenantComplaintsPage />} />
          <Route path="profil" element={<TenantProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
