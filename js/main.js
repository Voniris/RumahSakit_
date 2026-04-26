function togglePassword(id, el) {
  const input = document.getElementById(id);
  const icon = el.querySelector('img');

  if (input.type === 'password') {
    input.type = 'text';
    icon.src = '/assets/icons/openeyes.png';
  } else {
    input.type = 'password';
    icon.src = '/assets/icons/closedeyes.png';
  }
}

// Switch tab Pasien / Petugas
function switchTab(role) {
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => tab.classList.remove('active'));

  if (role === 'pasien') {
    tabs[0].classList.add('active');
    document.getElementById('field-nik').style.display = 'block';
  } else {
    tabs[1].classList.add('active');
    document.getElementById('field-nik').style.display = 'block'; /*petugas perlu nik atau gak*/
  }
}