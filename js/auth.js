const BASE_URL = 'http://kelompok1-rs.test/api';

async function checkAndRefreshToken() {
    const token = localStorage.getItem('rs_token');
    if (!token) return;

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
            paksakLogout();
        }
    } catch (error) {
        console.error("Gagal refresh token:", error);
    }
}

function paksakLogout() {
    localStorage.removeItem('rs_token');
    localStorage.removeItem('token');
    window.location.href = '../auth/masuk.html';
}
function mulaiAutoRefresh() {
    const token = localStorage.getItem('rs_token');
    if (!token) return;

    checkAndRefreshToken();
    setInterval(checkAndRefreshToken, 50 * 60 * 1000);
}

mulaiAutoRefresh();