import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { isAuthenticated, getCurrentUser } from '../../services/auth';
import TenantNavbar from './TenantNavbar';
import TenantFooter from './TenantFooter';

export default function TenantLayout() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  // State awal: user dari auth, occupancy & notifications KOSONG (bukan dummy)
  const [shellData, setShellData] = useState({
    user: currentUser || { name: 'Penghuni' },
    occupancy: null,
    notifications: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Guard: redirect ke login jika belum authenticated
    if (!isAuthenticated()) {
      navigate('/login', { replace: true });
      return;
    }

    // Fetch data dari API (bukan hardcode)
    api
      .get('/tenant/dashboard')
      .then((res) => {
        if (res.data) {
          setShellData({
            user: res.data.user || currentUser || { name: 'Penghuni' },
            occupancy: res.data.occupancy || null,
            notifications: res.data.notifications || [],
          });
        }
      })
      .catch((err) => {
        if (err?.response?.status === 401) {
          navigate('/login', { replace: true });
          return;
        }
        // Jika error lain, biarkan data kosong (TIDAK pakai dummy)
        setError(err?.response?.data?.message || 'Gagal memuat data.');
      })
      .finally(() => setLoading(false));
  }, [navigate, currentUser]);

  const handleMarkAllRead = async () => {
    try {
      await api.post('/tenant/notifications/read-all');
      setShellData((prev) => ({
        ...prev,
        notifications: prev.notifications.map((n) => ({
          ...n,
          read_at: n.read_at || new Date().toISOString(),
        })),
      }));
    } catch {
      // optimistic fallback
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F6F1] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#14532D] border-r-transparent" />
          <p className="mt-4 text-sm font-semibold text-[#4B5850]">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F6F1] text-[#112A1C] font-['Plus_Jakarta_Sans',sans-serif] antialiased pb-24 flex flex-col">
      <TenantNavbar
        occupancy={shellData.occupancy}
        notifications={shellData.notifications}
        onMarkAllRead={handleMarkAllRead}
      />
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        {/* Error banner jika API gagal (bukan data dummy) */}
        {error && (
          <div className="mb-4 rounded-2xl bg-[#FEE2E2] border border-[#FCA5A5] px-4 py-3 text-xs font-bold text-[#B91C1C]">
            {error}
          </div>
        )}
        <Outlet context={shellData} />
      </main>
      <TenantFooter />
    </div>
  );
}