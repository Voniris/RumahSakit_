const BASE_URL = 'https://daftar4b06.vps-poliban.my.id/api';

async function checkAndRefreshToken() {
    const token = localStorage.getItem('rs_token');
    if (!token) return;
    if (window.location.href.includes('/auth/')) return;

    try {
        const response = await fetch(`${BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        const result = await response.json();

        if (response.ok && result.success) {
            localStorage.setItem('rs_token', result.data.token);
            console.log("Token berhasil diperbarui.");
        } else {
            console.warn("Refresh token gagal:", result?.message);
        }
    } catch (error) {
        console.error("Gagal refresh token:", error);
    }
}

function mulaiAutoRefresh() {
    const token = localStorage.getItem('rs_token');
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