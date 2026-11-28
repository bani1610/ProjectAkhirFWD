import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { getCurrentUser, changePassword } from '../../services/auth';

export default function TenantProfilePage() {
  const currentUser = getCurrentUser();

  const [profile, setProfile] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    occupation: '',
    emergency_name: '',
    emergency_relation: '',
    emergency_phone: '',
  });
  const [passwords, setPasswords] = useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  });
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState(''); // 'success' | 'error'
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  useEffect(() => {
    api
      .get('/tenant/profile')
      .then((res) => {
        if (res.data) setProfile((prev) => ({ ...prev, ...res.data }));
      })
      .catch((err) => {
        // Tampilkan error jika gagal load profil
        setMsg(err?.response?.data?.message || 'Gagal memuat profil.');
        setMsgType('error');
      });
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setMsg('');
    setMsgType('');
    setLoadingProfile(true);
    try {
      await api.put('/tenant/profile', {
        occupation: profile.occupation,
        emergency_name: profile.emergency_name,
        emergency_relation: profile.emergency_relation,
        emergency_phone: profile.emergency_phone,
      });
      setMsg('Data profil & kontak darurat berhasil diperbarui.');
      setMsgType('success');
    } catch (err) {
      setMsg(
        err?.response?.data?.message ||
          'Gagal menyimpan perubahan profil. Silakan coba lagi.'
      );
      setMsgType('error');
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMsg('');
    setMsgType('');

    if (passwords.password !== passwords.password_confirmation) {
      setMsg('Konfirmasi password baru tidak cocok.');
      setMsgType('error');
      return;
    }

    setLoadingPassword(true);
    try {
      await changePassword({
        currentPassword: passwords.current_password,
        newPassword: passwords.password,
        newPasswordConfirmation: passwords.password_confirmation,
      });
      setMsg('Password berhasil diubah.');
      setMsgType('success');
      setPasswords({ current_password: '', password: '', password_confirmation: '' });
    } catch (err) {
      setMsg(
        err?.response?.data?.message ||
          'Gagal mengubah password. Periksa password lama Anda.'
      );
      setMsgType('error');
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <>
      <section className="rounded-[24px] bg-white border border-[#E5E1D8] p-6 sm:p-8 shadow-sm mb-6">
        <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#1B6B3A]">
          <span className="h-0.5 w-4 rounded-full bg-[#F5A623]" />
          AKUN & PROFIL PENGHUNI
        </span>
        <h1 className="font-['Fraunces',Georgia,serif] text-2xl sm:text-3xl font-bold text-[#112A1C] mt-1">
          Profil & Keamanan Akun
        </h1>
        <p className="text-xs sm:text-sm text-[#4B5850] mt-1">
          Sesuai kebijakan KostKuy, perubahan Nama Lengkap dan Nomor HP hanya dapat dilakukan oleh Pemilik Kost.
        </p>
      </section>

      {/* Feedback message dengan warna sesuai tipe */}
      {msg && (
        <div
          className={`mb-5 rounded-2xl border px-4 py-3 text-xs font-bold ${
            msgType === 'success'
              ? 'bg-[#E5F1EA] border-[#1B6B3A]/25 text-[#14532D]'
              : 'bg-[#FEE2E2] border-[#FCA5A5] text-[#B91C1C]'
          }`}
        >
          {msg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Data Diri & Kontak Darurat */}
        <form
          onSubmit={handleSaveProfile}
          className="rounded-[22px] bg-white border border-[#E5E1D8] p-6 shadow-sm space-y-4"
        >
          <h2 className="font-['Fraunces',Georgia,serif] text-xl font-bold text-[#112A1C]">
            Data Penghuni & Kontak Darurat
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-[#7A867E] mb-1">
                Nama Lengkap (Terkunci)
              </label>
              <input
                type="text"
                readOnly
                value={profile.name}
                className="w-full rounded-xl border border-[#E5E1D8] bg-[#F1EDE3] px-3.5 py-2.5 text-sm text-[#4B5850] cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#7A867E] mb-1">
                Nomor HP Login (Terkunci)
              </label>
              <input
                type="text"
                readOnly
                value={profile.phone}
                className="w-full rounded-xl border border-[#E5E1D8] bg-[#F1EDE3] px-3.5 py-2.5 font-['JetBrains_Mono',monospace] text-sm text-[#4B5850] cursor-not-allowed"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-[#112A1C] mb-1">Pekerjaan</label>
            <input
              type="text"
              required
              value={profile.occupation}
              onChange={(e) => setProfile({ ...profile, occupation: e.target.value })}
              className="w-full rounded-xl border border-[#E5E1D8] bg-[#F8F6F1] px-3.5 py-2.5 text-sm"
            />
          </div>
          <div className="pt-2 border-t border-[#E5E1D8]">
            <div className="text-xs font-extrabold uppercase tracking-wider text-[#1B6B3A] mb-3">
              Kontak Darurat
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#112A1C] mb-1">Nama</label>
                <input
                  type="text"
                  required
                  value={profile.emergency_name}
                  onChange={(e) => setProfile({ ...profile, emergency_name: e.target.value })}
                  className="w-full rounded-xl border border-[#E5E1D8] bg-[#F8F6F1] px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#112A1C] mb-1">Hubungan</label>
                <input
                  type="text"
                  required
                  value={profile.emergency_relation}
                  onChange={(e) => setProfile({ ...profile, emergency_relation: e.target.value })}
                  className="w-full rounded-xl border border-[#E5E1D8] bg-[#F8F6F1] px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#112A1C] mb-1">No. HP Darurat</label>
                <input
                  type="tel"
                  required
                  value={profile.emergency_phone}
                  onChange={(e) => setProfile({ ...profile, emergency_phone: e.target.value })}
                  className="w-full rounded-xl border border-[#E5E1D8] bg-[#F8F6F1] px-3 py-2 font-['JetBrains_Mono',monospace] text-sm"
                />
              </div>
            </div>
          </div>
          <button
            type="submit"
            disabled={loadingProfile}
            className="rounded-full bg-[#14532D] hover:bg-[#0B331C] text-white font-bold text-xs px-6 py-3 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingProfile ? 'Menyimpan...' : 'Simpan Perubahan Profil'}
          </button>
        </form>

        {/* Ganti Password */}
        <form
          onSubmit={handleChangePassword}
          className="rounded-[22px] bg-white border border-[#E5E1D8] p-6 shadow-sm space-y-4"
        >
          <h2 className="font-['Fraunces',Georgia,serif] text-xl font-bold text-[#112A1C]">
            Ganti Kata Sandi
          </h2>
          <p className="text-xs text-[#4B5850]">
            Wajib mengganti kata sandi sementara saat login pertama kali demi keamanan akun Anda.
          </p>
          <div>
            <label className="block text-xs font-bold text-[#112A1C] mb-1">Password Saat Ini</label>
            <input
              type="password"
              required
              value={passwords.current_password}
              onChange={(e) => setPasswords({ ...passwords, current_password: e.target.value })}
              className="w-full rounded-xl border border-[#E5E1D8] bg-[#F8F6F1] px-3.5 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#112A1C] mb-1">Password Baru</label>
            <input
              type="password"
              required
              minLength={8}
              value={passwords.password}
              onChange={(e) => setPasswords({ ...passwords, password: e.target.value })}
              className="w-full rounded-xl border border-[#E5E1D8] bg-[#F8F6F1] px-3.5 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#112A1C] mb-1">
              Konfirmasi Password Baru
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={passwords.password_confirmation}
              onChange={(e) =>
                setPasswords({ ...passwords, password_confirmation: e.target.value })
              }
              className="w-full rounded-xl border border-[#E5E1D8] bg-[#F8F6F1] px-3.5 py-2.5 text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loadingPassword}
            className="rounded-full bg-[#14532D] hover:bg-[#0B331C] text-white font-bold text-xs px-6 py-3 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingPassword ? 'Mengubah...' : 'Perbarui Kata Sandi'}
          </button>
        </form>
      </div>
    </>
  );
}