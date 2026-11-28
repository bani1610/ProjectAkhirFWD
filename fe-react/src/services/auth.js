import {api} from '../lib/api'; // ← Ganti ini ke path axios instance kamu

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

/**
 * Login dengan nomor HP + password.
 */
export async function login({ phone, password }) {
    const { data } = await api.post('/auth/login', { phone, password });
    const { token, user } = data.data;

    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));

    return { user, token };
}

/**
 * Logout — mencabut token di sisi backend (Sanctum).
 */
export async function logout() {
    try {
        await api.post('/auth/logout');
    } finally {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    }
}

/**
 * Ganti password.
 */
export async function changePassword({ currentPassword, newPassword, newPasswordConfirmation }) {
    const { data } = await api.post('/auth/change-password', {
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: newPasswordConfirmation,
    });

    const stored = localStorage.getItem(USER_KEY);
    if (stored) {
        const user = JSON.parse(stored);
        user.must_change_password = data.data?.must_change_password ?? false;
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    }

    return data.data;
}

export function getCurrentUser() {
    const stored = localStorage.getItem(USER_KEY);
    if (!stored) return null;
    try {
        return JSON.parse(stored);
    } catch {
        return null;
    }
}

export function isAuthenticated() {
    return Boolean(localStorage.getItem(TOKEN_KEY));
}

export function clearAuth() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}