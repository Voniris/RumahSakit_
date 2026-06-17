
function togglePassword(id, el) {
  const input = document.getElementById(id);
  const icon = el.querySelector('img');

  if (input.type === 'password') {
    input.type = 'text';
    icon.src = '../../assets/icons/openeyes.png'; 
  } else {
    input.type = 'password';
    icon.src = '../../assets/icons/closedeyes.png';
  }
}

function showAlert(type, title, message, callback) {
  const icons = {
  success: '<img src="../../assets/icons/alertberhasil.png" width="100" />',
  error: '<img src="../../assets/icons/erroralert.png" width="100" />',
  warning: '<img src="../../assets/icons/warningalert.png" width="100" />',
  info: '<img src="../../assets/icons/infoalert.png" width="100" />'
};

  const overlay = document.createElement('div');
  overlay.className = 'custom-alert-overlay';
  overlay.innerHTML = `
    <div class="custom-alert-box">
      <div class="custom-alert-icon">${icons[type]}</div>
      <div class="custom-alert-title">${title}</div>
      <div class="custom-alert-message">${message}</div>
      <button class="custom-alert-btn ${type}" id="alertOkBtn">OK</button>
    </div>
  `;

  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('show'));

  overlay.querySelector('#alertOkBtn').addEventListener('click', () => {
    overlay.classList.remove('show');
    setTimeout(() => {
      overlay.remove();
      if (callback) callback();
    }, 200);
  });
}

function setRoles(roles) {
  const selectedId = document.getElementById('selectedRoles') || document.getElementById('selectedroles');
  if (selectedId) selectedId.value = roles;

  const btnPasien = document.getElementById('btnPasien');
  const btnPetugas = document.getElementById('btnPetugas');
  if (btnPasien) btnPasien.classList.toggle('active', roles === 'pasien');
  if (btnPetugas) btnPetugas.classList.toggle('active', roles === 'petugas');
}

function switchTab(role) {
  const tabs = document.querySelectorAll('.tab');
  const inputLabel = document.querySelector('label[for="nik_login"]');
  const inputPlaceHolder = document.getElementById('nik_login');

  tabs.forEach(tab => tab.classList.remove('active'));

  if (role === 'pasien') {
    tabs[0].classList.add('active');
    inputLabel.innerText = "NIK Pasien";
    inputPlaceHolder.placeholder = "Masukkan NIK Anda";
  } else {
    tabs[1].classList.add('active');
    inputLabel.innerText = "NIP / Username Petugas";
    inputPlaceHolder.placeholder = "Masukkan NIP/Username";
  }
}

const BASE_URL = 'https://kelompok1-rs.test/api';

async function loginPasien(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password,
                remember_me: false
            })
        });

        const result = await response.json();

        if (response.ok && result.success) {
            localStorage.setItem('rs_token', result.data.token);
            showAlert('success', 'Login Berhasil!', 'Selamat datang ' + result.data.user.nama_lengkap, () => {
                window.location.href = '../pasien/dashboard_pasien.html';
            });
        } else {
            showAlert('error', 'Login Gagal', result.message || 'Cek kembali Email dan Password!');
        }

    } catch (error) {
        console.error('Error saat login:', error);
        showAlert('error', 'Koneksi Gagal', 'Terjadi kesalahan pada server. Coba lagi nanti.');
    }
}

async function daftarPasien(event) {
    event.preventDefault(); 

    const dataRegister = {
        nik: document.getElementById('nik_daftar').value,
        nama_lengkap: document.getElementById('nama_daftar').value,
        email: document.getElementById('email_daftar').value,
        password: document.getElementById('password_daftar').value,
        password_confirmation: document.getElementById('password_confirm_daftar').value,
        jenis_pasien: "umum" 
    };

    try {
        const response = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(dataRegister)
        });

        const result = await response.json();

        if (response.ok && result.success) {
            showAlert('success', 'Registrasi Berhasil!', 'Silakan cek email untuk verifikasi.', () => {
                window.location.href = 'masuk.html';
            });
        } else {
            console.log(result);
            showAlert('error', 'Pendaftaran Gagal', 'Periksa kembali data Anda.');
        }

    } catch (error) {
        console.error('Error saat register:', error);
        showAlert('error', 'Server Bermasalah', 'Tidak dapat terhubung ke server. Coba lagi.');
    }
}