import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import {api} from '../lib/api';
import TenantNavbar from './TenantNavbar';
import TenantFooter from './TenantFooter';

export default function TenantLayout({ children }) {
  const [shellData, setShellData] = useState({
    user: { id: 2, name: 'Budi Santoso', phone: '081311110001' },
    occupancy: { room: { number: '101', floor: 1, type_name: 'Non-AC' } },
    notifications: [
      {
        id: 1,
        title: 'Tagihan baru terbit',
        body: 'Tagihan sewa 10 Nov 2026 - 9 Mei 2027 sudah terbit. Jatuh tempo 10 Nov 2026.',
        read_at: null,
      },
      {
        id: 5,
        title: 'Keluhan selesai',
        body: 'Keluhan "Kipas angin bunyi keras" ditandai Selesai. Konfirmasi apakah masalah sudah beres.',
        read_at: null,
      },
    ],
  });

  useEffect(() => {
    api
      .get('/tenant/dashboard')
      .then((res) => {
        if (res.data) {
          setShellData((prev) => ({
            user: res.data.user || prev.user,
            occupancy: res.data.occupancy || prev.occupancy,
            notifications: res.data.notifications || prev.notifications,
          }));
        }
      })
      .catch(() => {});
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await api.post('/tenant/notifications/read-all');
    } catch (_) {
      // optimistic fallback
    }
    setShellData((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({
        ...n,
        read_at: n.read_at || new Date().toISOString(),
      })),
    }));
  };

  return (
    <div className="min-h-screen bg-[#F8F6F1] text-[#112A1C] font-['Plus_Jakarta_Sans',sans-serif] antialiased pb-24 flex flex-col">
      <TenantNavbar
        user={shellData.user}
        occupancy={shellData.occupancy}
        notifications={shellData.notifications}
        onMarkAllRead={handleMarkAllRead}
      />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        {children || <Outlet context={shellData} />}
      </main>

      <TenantFooter />
    </div>
  );
}
