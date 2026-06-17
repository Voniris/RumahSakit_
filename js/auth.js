const BASE_URL = 'https://daftar4b06.vps-poliban.my.id/api';

function getToken() {
    return localStorage.getItem('rs_token') || sessionStorage.getItem('rs_token');
}
function saveToken(token, rememberMe, expiresIn) {
    if (rememberMe) {
        localStorage.setItem('rs_token', token);
        if (expiresIn) localStorage.setItem('rs_expires_in', expiresIn);
        sessionStorage.removeItem('rs_token');
        sessionStorage.removeItem('rs_expires_in');
    } else {
        sessionStorage.setItem('rs_token', token);
        if (expiresIn) sessionStorage.setItem('rs_expires_in', expiresIn);
        localStorage.removeItem('rs_token');
        localStorage.removeItem('rs_expires_in');
    }
}

function clearToken() {
    localStorage.removeItem('rs_token');
    localStorage.removeItem('rs_expires_in');
    sessionStorage.removeItem('rs_token');
    sessionStorage.removeItem('rs_expires_in');
}

function isLoggedIn() {
    return !!getToken();
}

async function authFetch(url, options = {}) {
    const token = getToken();
    const headers = {
        'Accept': 'application/json',
        ...(options.headers || {}),
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return fetch(url, { ...options, headers });
}

/* ===================== AUTO REFRESH TOKEN ===================== */

async function checkAndRefreshToken() {
    const token = getToken();
    if (!token) return;
    if (window.location.href.includes('/auth/')) return;

    try {
        const response = await authFetch(`${BASE_URL}/auth/refresh`, {
            method: 'POST'
        });

        const result = await response.json();

        if (response.ok && result.success) {
            // Simpan token baru ke tempat yang sama dengan token lama
            const rememberMe = !!localStorage.getItem('rs_token');
            saveToken(result.data.token, rememberMe, result.data.expires_in);
            console.log("Token berhasil diperbarui.");
        } else {
            console.warn("Refresh token gagal:", result?.message);
        }
    } catch (error) {
        console.error("Gagal refresh token:", error);
    }
}

function mulaiAutoRefresh() {
    const token = getToken();
    if (!token) return;
    if (window.location.href.includes('/auth/')) return;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const rememberMe = payload?.remember_me || false;

        const intervalMs = rememberMe
            ? 6 * 24 * 60 * 60 * 1000
            : 45 * 60 * 1000;

        console.log(`Auto refresh: ${rememberMe ? 'setiap 6 hari' : 'setiap 45 menit'}`);

        setTimeout(() => {
            checkAndRefreshToken();
            setInterval(checkAndRefreshToken, intervalMs);
        }, intervalMs / 2);

    } catch (e) {

        console.warn("Gagal baca payload token, pakai default 45 menit");
        setTimeout(() => {
            checkAndRefreshToken();
            setInterval(checkAndRefreshToken, 45 * 60 * 1000);
        }, 45 * 60 * 1000);
    }
}

mulaiAutoRefresh();