import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { changePassword, getCurrentUser } from '../../services/auth';

export default function ChangePasswordPage() {
    const navigate = useNavigate();
    const user = getCurrentUser(); // Ambil data user dari localStorage

    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        newPasswordConfirmation: '',
        consentData: false, // Checkbox persetujuan UU PDP
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        // Validasi frontend
        if (formData.newPassword !== formData.newPasswordConfirmation) {
            setErrorMsg('Konfirmasi kata sandi baru tidak cocok.');
            return;
        }
        if (formData.newPassword.length < 8) {
            setErrorMsg('Kata sandi baru minimal 8 karakter.');
            return;
        }
        if (!formData.consentData) {
            setErrorMsg('Anda wajib menyetujui penggunaan data pribadi untuk melanjutkan.');
            return;
        }

        setLoading(true);
        try {
            // Panggil service. Backend saat ini hanya butuh 3 field password.
            await changePassword({
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
                newPasswordConfirmation: formData.newPasswordConfirmation,
                // consentedAt: new Date().toISOString(), // Opsional, tergantung kesiapan backend
            });

            // Update status di localStorage agar tidak terjebak di loop
            const updatedUser = getCurrentUser();
            if (updatedUser) {
                updatedUser.must_change_password = false;
                localStorage.setItem('auth_user', JSON.stringify(updatedUser));
            }

            // Redirect ke dashboard sesuai role
            navigate(updatedUser?.role === 'owner' ? '/owner/dashboard' : '/penghuni/dashboard');
        } catch (err) {
            const payload = err?.response?.data;

            // Handle error spesifik dari AuthController.php
            if (payload?.code === 'INVALID_CURRENT_PASSWORD') {
                setErrorMsg('Kata sandi lama (sementara) yang Anda masukkan salah.');
            } else {
                setErrorMsg(
                    payload?.message || 'Gagal mengubah kata sandi. Silakan coba lagi.'
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F6F1] flex items-center justify-center p-6 font-['Plus_Jakarta_Sans',sans-serif]">
            <div className="w-full max-w-[480px] bg-white rounded-[24px] border border-[#E5E1D8] p-8 shadow-[0_12px_32px_rgba(17,42,28,0.05)]">

                {/* Header */}
                <div className="mb-6">
                    <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.1em] text-[#F5A623] mb-2">
                        <span className="h-0.5 w-4 rounded-full bg-[#F5A623]" />
                        <span>LANGKAH WAJIB</span>
                    </div>
                    <h1 className="font-['Fraunces',Georgia,serif] text-2xl font-bold text-[#112A1C]">
                        Ganti Kata Sandi & Persetujuan Data
                    </h1>
                    <p className="text-sm text-[#4B5850] mt-1">
                        Halo, <strong>{user?.name || 'Pengguna'}</strong>. Untuk keamanan akun, silakan ganti kata sandi sementara Anda.
                    </p>
                </div>

                {/* Error Message */}
                {errorMsg && (
                    <div className="mb-4 rounded-xl bg-[#FEE2E2] border border-[#FCA5A5] px-4 py-3 text-xs font-semibold text-[#B91C1C]">
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Password Lama */}
                    <div>
                        <label className="block text-xs font-bold text-[#112A1C] mb-1.5">
                            Kata Sandi Lama (Sementara)
                        </label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="currentPassword"
                            required
                            value={formData.currentPassword}
                            onChange={handleChange}
                            placeholder="Masukkan kata sandi dari pemilik"
                            className="w-full rounded-xl border border-[#E5E1D8] bg-[#F8F6F1] px-4 py-3 text-sm outline-none focus:border-[#1B6B3A] focus:ring-2 focus:ring-[#1B6B3A]/15"
                        />
                    </div>

                    {/* Password Baru */}
                    <div>
                        <label className="block text-xs font-bold text-[#112A1C] mb-1.5">
                            Kata Sandi Baru
                        </label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="newPassword"
                            required
                            minLength={8}
                            value={formData.newPassword}
                            onChange={handleChange}
                            placeholder="Minimal 8 karakter"
                            className="w-full rounded-xl border border-[#E5E1D8] bg-[#F8F6F1] px-4 py-3 text-sm outline-none focus:border-[#1B6B3A] focus:ring-2 focus:ring-[#1B6B3A]/15"
                        />
                    </div>

                    {/* Konfirmasi Password Baru */}
                    <div>
                        <label className="block text-xs font-bold text-[#112A1C] mb-1.5">
                            Konfirmasi Kata Sandi Baru
                        </label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="newPasswordConfirmation"
                            required
                            minLength={8}
                            value={formData.newPasswordConfirmation}
                            onChange={handleChange}
                            placeholder="Ulangi kata sandi baru"
                            className="w-full rounded-xl border border-[#E5E1D8] bg-[#F8F6F1] px-4 py-3 text-sm outline-none focus:border-[#1B6B3A] focus:ring-2 focus:ring-[#1B6B3A]/15"
                        />
                    </div>

                    {/* Toggle Show Password */}
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-xs font-bold text-[#1B6B3A] hover:underline cursor-pointer"
                    >
                        {showPassword ? 'Sembunyikan' : 'Tampilkan'} kata sandi
                    </button>

                    {/* Checkbox Persetujuan UU PDP */}
                    <div className="rounded-xl bg-[#F8F6F1] border border-[#E5E1D8] p-4">
                        <label className="flex items-start gap-3 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                name="consentData"
                                checked={formData.consentData}
                                onChange={handleChange}
                                className="mt-0.5 h-4 w-4 rounded border-[#D3CEC2] accent-[#14532D] shrink-0"
                            />
                            <span className="text-xs text-[#4B5850] leading-relaxed">
                                <strong className="text-[#112A1C]">Persetujuan Penggunaan Data Pribadi</strong>
                                <br />
                                Dengan mencentang kotak ini, saya menyetujui pengumpulan dan penggunaan data pribadi saya oleh KostKuy untuk keperluan pengelolaan hunian, penagihan sewa, dan komunikasi terkait kost, sesuai dengan Undang-Undang Pelindungan Data Pribadi (UU PDP).
                            </span>
                        </label>
                    </div>

                    {/* Tombol Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-full bg-[#14532D] hover:bg-[#0B331C] disabled:opacity-60 text-white font-bold text-sm py-3.5 shadow-lg transition-all cursor-pointer mt-2"
                    >
                        {loading ? 'Memproses...' : 'Simpan & Lanjutkan ke Dashboard →'}
                    </button>
                </form>
            </div>
        </div>
    );
}