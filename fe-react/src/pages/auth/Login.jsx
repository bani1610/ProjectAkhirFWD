import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../services/auth'; // ← pakai service, bukan api langsung

export default function LoginPage() {
  const navigate = useNavigate();

  // Hapus state role, email, rememberMe.
  // Backend pakai phone + password, dan role ditentukan dari data user.
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      // Panggil service login (sudah simpan token & user ke localStorage).
      const { user } = await login({ phone, password });

      // PRD F-AUTH-02: Penyewa WAJIB ganti password di login pertama.
      if (user.must_change_password) {
        navigate('/change-password');
        return;
      }

      // Redirect berdasarkan role dari backend.
      if (user.role === 'owner') {
        navigate('/owner/dashboard');
      } else {
        navigate('/penghuni/dashboard'); // atau '/tenant/dashboard' sesuai routing kamu
      }
    } catch (err) {
      const payload = err?.response?.data;
      const code = payload?.code;
      const meta = payload?.meta || {};

      // Handle error code spesifik dari AuthController.
      if (code === 'ACCOUNT_LOCKED') {
        const lockedUntil = meta.locked_until
          ? new Date(meta.locked_until).toLocaleString('id-ID')
          : 'beberapa saat lagi';
        setErrorMsg(
          `Akun terkunci sementara karena terlalu banyak percobaan gagal. Silakan coba lagi setelah ${lockedUntil}.`
        );
      } else if (code === 'ACCOUNT_INACTIVE') {
        setErrorMsg('Akun Anda sudah dinonaktifkan. Hubungi pemilik kost.');
      } else {
        const remaining = meta.remaining_attempts;
        const baseMsg =
          payload?.message ||
          'Nomor HP atau kata sandi tidak sesuai. Silakan periksa kembali.';
        setErrorMsg(
          remaining !== undefined
            ? `${baseMsg} (Percobaan tersisa: ${remaining})`
            : baseMsg
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F6F1] text-[#112A1C] flex flex-col lg:flex-row font-['Plus_Jakarta_Sans',sans-serif] antialiased selection:bg-[#14532D] selection:text-white">
      {/* Left Panel */}
      <aside className="relative lg:w-[46%] xl:w-[44%] bg-gradient-to-br from-[#1B6B3A] via-[#14532D] to-[#0B331C] text-white p-8 sm:p-12 lg:p-14 flex flex-col justify-between overflow-hidden">
        <div
          className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #F5A623 0%, transparent 70%)' }}
        />
        <div
          className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #E5F1EA 0%, transparent 70%)' }}
        />

        {/* Brand Header */}
        <div className="relative z-10 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <span className="h-10 w-10 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </span>
            <span className="font-['Fraunces',Georgia,serif] text-2xl font-bold tracking-tight text-white">
              KostKuy
            </span>
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 px-3.5 py-1.5 text-xs font-semibold text-white transition"
          >
            <span>← Beranda</span>
          </Link>
        </div>

        {/* Center Editorial Copy */}
        <div className="relative z-10 my-10 lg:my-0 space-y-6">
          <div className="inline-flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#F5A623]">
            <span className="h-0.5 w-5 rounded-full bg-[#F5A623]" />
            <span>PORTAL HUNIAN TERPADU</span>
          </div>
          <h1 className="font-['Fraunces',Georgia,serif] text-3xl sm:text-4xl xl:text-[42px] font-bold leading-[1.15] tracking-tight text-white">
            Hunian nyaman, urusan sewa & keluhan serba transparan.
          </h1>
          <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-md">
            Satu akses terintegrasi bagi penghuni untuk memantau tagihan dan kuitansi digital, serta bagi pemilik kos mengelola unit secara real-time.
          </p>

          {/* Summary Card */}
          <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-5 max-w-md space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="uppercase tracking-wider font-bold text-white/70">KostKuy Lenteng Agung</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F5A623]/20 text-[#F5A623] px-2.5 py-0.5 font-bold">
                <span className="h-1.5 w-1.5 rounded-full bg-[#F5A623]" />
                Terverifikasi
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3 pt-1 border-t border-white/10">
              <div>
                <div className="font-['JetBrains_Mono',monospace] text-lg font-bold text-white">10</div>
                <div className="text-[11px] text-white/70">Unit Kamar</div>
              </div>
              <div>
                <div className="font-['JetBrains_Mono',monospace] text-lg font-bold text-white">&lt;24j</div>
                <div className="text-[11px] text-white/70">Respon Keluhan</div>
              </div>
              <div>
                <div className="font-['JetBrains_Mono',monospace] text-lg font-bold text-white">100%</div>
                <div className="text-[11px] text-white/70">Kuitansi Digital</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center justify-between text-xs text-white/65 border-t border-white/10 pt-5">
          <span>© 2026 KostKuy Management</span>
          <span>Keamanan Sesi Terenkripsi</span>
        </div>
      </aside>

      {/* Right Form */}
      <main className="flex-1 flex items-center justify-center p-6 sm:p-10 lg:p-14">
        <div className="w-full max-w-[460px] bg-white rounded-[24px] border border-[#E5E1D8] p-7 sm:p-10 shadow-[0_1px_2px_rgba(17,42,28,0.04),0_12px_32px_rgba(17,42,28,0.05)]">
          <div className="mb-7">
            <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.1em] text-[#1B6B3A] mb-2">
              <span className="h-0.5 w-4 rounded-full bg-[#F5A623]" />
              <span>SELAMAT DATANG KEMBALI</span>
            </div>
            <h2 className="font-['Fraunces',Georgia,serif] text-2xl sm:text-[28px] font-bold text-[#112A1C] tracking-tight">
              Masuk ke Akun Anda
            </h2>
            <p className="text-sm text-[#4B5850] mt-1">
              Gunakan nomor HP yang terdaftar untuk melanjutkan ke dashboard.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-5 rounded-xl bg-[#FEE2E2] border border-[#FCA5A5] px-4 py-3 text-xs font-semibold text-[#B91C1C]">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nomor HP */}
            <div>
              <label htmlFor="loginPhone" className="block text-xs font-bold text-[#112A1C] mb-1.5">
                Nomor HP
              </label>
              <input
                id="loginPhone"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="081234567890"
                className="w-full rounded-xl border border-[#E5E1D8] bg-[#F8F6F1] px-4 py-3 font-['JetBrains_Mono',monospace] text-sm text-[#112A1C] placeholder:text-[#7A867E] outline-none transition focus:border-[#1B6B3A] focus:bg-white focus:ring-2 focus:ring-[#1B6B3A]/15"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="loginPassword" className="block text-xs font-bold text-[#112A1C]">
                  Kata Sandi
                </label>
                <Link
                  to="/lupa-password"
                  className="text-xs font-semibold text-[#1B6B3A] hover:text-[#14532D] hover:underline"
                >
                  Lupa kata sandi?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="loginPassword"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-[#E5E1D8] bg-[#F8F6F1] px-4 py-3 pr-16 text-sm text-[#112A1C] placeholder:text-[#7A867E] outline-none transition focus:border-[#1B6B3A] focus:bg-white focus:ring-2 focus:ring-[#1B6B3A]/15"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#4B5850] hover:text-[#14532D] cursor-pointer"
                >
                  {showPassword ? 'Tutup' : 'Lihat'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-[#14532D] hover:bg-[#0B331C] disabled:opacity-60 text-white font-bold text-sm py-3.5 px-6 shadow-[0_6px_16px_rgba(20,83,45,0.22)] transition-all hover:-translate-y-0.5 cursor-pointer mt-2"
            >
              {loading ? 'Memverifikasi Akun...' : 'Masuk →'}
            </button>
          </form>

        </div>
      </main>
    </div>
  );
}