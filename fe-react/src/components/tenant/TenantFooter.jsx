import { NavLink } from 'react-router-dom';

export default function TenantFooter() {
  return (
    <>
      <footer className="max-w-6xl mx-auto px-4 sm:px-6 mt-12 pt-6 border-t border-[#E5E1D8] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#7A867E]">
        <span>© 2026 KostKuy · Portal Penghuni Terpadu</span>
        <span>Butuh bantuan mendesak? Hubungi Pemilik Kost atau buat tiket Darurat di menu Keluhan.</span>
      </footer>

      {/* Bottom Nav: hanya tampil di mobile (md:hidden) */}
      <nav
        aria-label="Navigasi Bawah Penghuni"
        className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-md rounded-full bg-[#112A1C]/95 backdrop-blur-md border border-white/15 px-2 py-1.5 shadow-2xl flex items-center justify-around"
      >
        {[
          { to: '/penghuni/dashboard', label: 'Ringkasan' },
          { to: '/penghuni/kamar', label: 'Kamar' },
          { to: '/penghuni/tagihan', label: 'Tagihan' },
          { to: '/penghuni/keluhan', label: 'Keluhan' },
          { to: '/penghuni/profil', label: 'Profil' },
        ].map((nav) => (
          <NavLink
            key={nav.to}
            to={nav.to}
            className={({ isActive }) =>
              `px-3.5 py-2 rounded-full text-[11px] font-bold transition-all ${
                isActive
                  ? 'bg-[#F5A623] text-[#112A1C] shadow'
                  : 'text-white/75 hover:text-white'
              }`
            }
          >
            {nav.label}
          </NavLink>
        ))}
      </nav>
    </>
  );
}