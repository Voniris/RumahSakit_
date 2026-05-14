// Fungsi Mata-mata (Toggle Password)
function togglePassword(id, el) {
  const input = document.getElementById(id);
  const icon = el.querySelector('img');

  // Gunakan ../../ untuk keluar dari folder Halaman/auth dulu
  if (input.type === 'password') {
    input.type = 'text';
    icon.src = '../../assets/icons/openeyes.png'; 
  } else {
    input.type = 'password';
    icon.src = '../../assets/icons/closedeyes.png';
  }
}

// Switch tab Pasien / Petugas
function switchTab(role) {
  const tabs = document.querySelectorAll('.tab');
  const inputLabel = document.querySelector('label[for="nik_login"]'); // Ambil labelnya
  const inputPlaceHolder = document.getElementById('nik_login');

  tabs.forEach(tab => tab.classList.remove('active'));

  if (role === 'pasien') {
    tabs[0].classList.add('active');
    inputLabel.innerText = "NIK Pasien";
    inputPlaceHolder.placeholder = "Masukkan NIK Anda";
  } else {
    tabs[1].classList.add('active');
    // Untuk petugas, biasanya pakai NIP atau Username
    // Tapi di API kamu minta 'username', jadi labelnya kita ubah aja
    inputLabel.innerText = "NIP / Username Petugas";
    inputPlaceHolder.placeholder = "Masukkan NIP/Username";
  }
}

// ==========================================
// KONFIGURASI UTAMA
// ==========================================
// Sesuaikan BASE_URL dengan alamat backend di komputermu
const BASE_URL = 'http://localhost:8000/api'; // contoh: 'https://api.vamedika.id/api'

// ==========================================
// 1. FUNGSI LOGIN PASIEN (Untuk masuk.html)
// ==========================================
async function loginPasien(event) {
    event.preventDefault(); // Mencegah halaman reload saat tombol diklik

    // Ambil nilai dari inputan form (Pastikan ID di input HTML-mu sesuai)
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        // Tembak API Login (berdasarkan docx: /auth/login)
        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                email: email, // Di API Backend minta 'email'
                password: password,
                remember_me: false
            })
        });

        const result = await response.json();

        if (response.ok && result.success) {
            alert('Login Berhasil! Selamat datang.');
            // Simpan token di localStorage biar sesi login tersimpan
            localStorage.setItem('rs_token', result.data.token);
            
            // Pindah halaman ke Dashboard
            window.location.href = '../pasien/dashboard_pasien.html'; 
        } else {
            alert('Login Gagal: ' + (result.message || 'Cek kembali NIK dan Password!'));
        }

    } catch (error) {
        console.error('Error saat login:', error);
        alert('Terjadi kesalahan pada server. Coba lagi nanti.');
    }
}

// ==========================================
// 2. FUNGSI REGISTER PASIEN (Untuk daftar.html)
// ==========================================
async function daftarPasien(event) {
    event.preventDefault(); 

    // Kumpulkan data dari form (Pastikan ID HTML sesuai)
    const dataRegister = {
        nik: document.getElementById('nik_daftar').value,
        nama_lengkap: document.getElementById('nama_daftar').value,
        email: document.getElementById('email_daftar').value,
        password: document.getElementById('password_daftar').value,
        password_confirmation: document.getElementById('password_confirm_daftar').value,
        // ... (tambahkan input lain kayak tanggal_lahir, alamat, dll sesuai API docs) ...
        jenis_pasien: "umum" 
    };

    try {
        // Tembak API Register (berdasarkan docx: /auth/register)
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
            alert('Registrasi Berhasil! Silakan cek email untuk verifikasi.');
            // Arahkan ke halaman login
            window.location.href = 'masuk.html';
        } else {
            // Nangkep error dari Laravel (biasanya formatnya agak dalam)
            console.log(result);
            alert('Gagal Mendaftar! Periksa kembali data Anda.');
        }

    } catch (error) {
        console.error('Error saat register:', error);
        alert('Server sedang bermasalah.');
    }
}