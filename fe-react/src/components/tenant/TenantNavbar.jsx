import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { logout, getCurrentUser } from '../../services/auth';

export default function TenantNavbar({ occupancy, notifications = [], onMarkAllRead }) {
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const user = getCurrentUser();
  const unreadCount = notifications.filter((n) => !n.read_at).length;

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F8F6F1]/90 backdrop-blur-md border-b border-[#E5E1D8]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Brand */}
        <NavLink to="/penghuni/dashboard" className="inline-flex items-center gap-2.5 group">
          <span className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#1B6B3A] to-[#0B331C] text-white flex items-center justify-center shadow-sm transition-transform group-hover:scale-105">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </span>
          <div>
            <span className="font-['Fraunces',Georgia,serif] text-xl font-bold tracking-tight text-[#112A1C] block leading-none">
              KostKuy
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#1B6B3A]">
              Portal Penghuni
            </span>
          </div>
        </NavLink>

        {/* Desktop Nav Pills: hanya di md ke atas */}
        <nav className="hidden md:flex items-center gap-1 rounded-full bg-[#F1EDE3] p-1 border border-[#E5E1D8]">
          {[
            { to: '/penghuni/dashboard', label: 'Ringkasan' },
            { to: '/penghuni/kamar', label: 'Kamar Saya' },
            { to: '/penghuni/tagihan', label: 'Tagihan' },
            { to: '/penghuni/keluhan', label: 'Keluhan' },
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  isActive ? 'bg-[#14532D] text-white shadow-sm' : 'text-[#4B5850] hover:text-[#112A1C]'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 relative">
          {/* Notification Bell */}
          <button
            type="button"
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative h-10 w-10 rounded-full bg-white border border-[#E5E1D8] hover:border-[#1B6B3A] flex items-center justify-center text-[#112A1C] transition cursor-pointer"
            aria-label="Notifikasi"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-4 min-w-[16px] px-1 rounded-full bg-[#DC2626] text-white text-[10px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {notifOpen && (
            <div className="absolute right-0 top-12 w-80 sm:w-96 rounded-2xl bg-white border border-[#E5E1D8] shadow-xl p-4 z-50">
              <div className="flex items-center justify-between pb-2.5 border-b border-[#E5E1D8]">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#112A1C]">
                  Notifikasi ({unreadCount} baru)
                </span>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={onMarkAllRead}
                    className="text-[11px] font-bold text-[#1B6B3A] hover:underline cursor-pointer"
                  >
                    Tandai dibaca
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-[#F1EDE3] mt-1">
                {notifications.length === 0 ? (
                  <p className="py-6 text-center text-xs text-[#7A867E]">Belum ada notifikasi.</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`py-2.5 px-2 rounded-lg text-xs ${!n.read_at ? 'bg-[#E5F1EA]/50' : ''}`}
                    >
                      <div className="font-bold text-[#112A1C]">{n.title}</div>
                      <p className="text-[#4B5850] mt-0.5 leading-relaxed">{n.body}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Profile Link — sembunyikan di mobile agar tidak penuh */}
          <NavLink
            to="/penghuni/profil"
            className="hidden sm:inline-flex items-center gap-2 rounded-full bg-white border border-[#E5E1D8] hover:border-[#1B6B3A] pl-1.5 pr-3 py-1 transition"
          >
            <span className="h-7 w-7 rounded-full bg-[#14532D] text-white text-xs font-bold flex items-center justify-center">
              {(user?.name || 'P')[0]}
            </span>
            <span className="hidden sm:inline text-xs font-bold text-[#112A1C] max-w-[110px] truncate">
              {user?.name || 'Penghuni'}
            </span>
            {occupancy?.room?.number && (
              <span className="rounded-full bg-[#E5F1EA] text-[#14532D] px-2 py-0.5 font-['JetBrains_Mono',monospace] text-[11px] font-bold">
                #{occupancy.room.number}
              </span>
            )}
          </NavLink>

          {/* Logout Button — hanya di desktop */}
          <button
            type="button"
            onClick={handleLogout}
            title="Keluar"
            className="hidden md:inline-flex h-9 w-9 rounded-full bg-white border border-[#E5E1D8] hover:bg-[#FEE2E2] hover:text-[#B91C1C] hover:border-[#FCA5A5] items-center justify-center text-[#4B5850] transition cursor-pointer"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}