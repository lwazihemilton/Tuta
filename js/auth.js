// js/auth.js – Complete Auth System (2025)
const API = 'https://api.tutsapp.co.za/auth';

document.getElementById('loginForm')?.addEventListener('submit', async e => {
  e.preventDefault();
  const identifier = document.getElementById('identifier').value.trim();
  const password = document.getElementById('password').value;
  const btn = e.target.querySelector('.btn');

  btn.innerHTML = 'Loading...';
  try {
    const res = await fetch(`${API}/login`, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({identifier,password})});
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    localStorage.setItem('tuts_token', data.token);
    localStorage.setItem('tuts_user', JSON.stringify(data.user));

    if (!data.user.emailVerified) {
      alert('Please verify your email first!');
      return location.href = 'login.html';
    }

    const role = data.user.role?.toLowerCase();
    location.href = role==='admin' ? 'admin-dashboard.html' : role==='tutor' ? 'tutor-dashboard.html' : 'dashboard.html';
  } catch(err) {
    alert(err.message);
    btn.innerHTML = 'Login';
  }
});

// Registration + Email Verification
document.getElementById('registerForm')?.addEventListener('submit', async e => {
  e.preventDefault();
  const data = {
    fullName: document.getElementById('fullName').value,
    email: document.getElementById('email').value.toLowerCase(),
    studentNumber: document.getElementById('studentNumber').value,
    password: document.getElementById('password').value,
    role: document.querySelector('[name=role]:checked').value
  };

  const btn = e.target.querySelector('.btn');
  btn.innerHTML = 'Creating...';

  try {
    const res = await fetch(`${API}/register`, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data)});
    const json = await res.json();
    if (!res.ok) throw new Error(json.message);

    localStorage.setItem('tuts_token', json.token);
    localStorage.setItem('tuts_user', JSON.stringify(json.user));
    localStorage.setItem('email_verified', 'false');

    document.getElementById('registerForm').style.display = 'none';
    const vs = document.getElementById('verifyScreen');
    vs.style.display = 'block';
    document.getElementById('sentEmail').textContent = data.email;

    startVerificationPolling(json.user.id);
  } catch(err) {
    alert(err.message);
    btn.innerHTML = 'Create Free Account';
  }
});

async function resendVerification() {
  try {
    await fetch(`${API}/resend-verification`, {method:'POST', headers:{'Authorization':`Bearer ${localStorage.tuts_token}`}});
    alert('Sent!');
  } catch { alert('Failed'); }
}

function startVerificationPolling(id) {
  const int = setInterval(async () => {
    try {
      const res = await fetch(`${API}/verify-status/${id}`, {headers:{'Authorization':`Bearer ${localStorage.tuts_token}`}});
      const d = await res.json();
      if (d.verified) {
        clearInterval(int);
        localStorage.email_verified = 'true';
        alert('Verified! Welcome');
        location.href = JSON.parse(localStorage.tuts_user).role === 'tutor' ? 'register-tutor.html' : 'dashboard.html';
      }
    } catch(e) {}
  }, 3000);
}

function logout() {
  localStorage.clear();
  location.href = 'index.html';
}

// Protect all dashboards
(() => {
  const p = ['dashboard.html','tutor-dashboard.html','admin-dashboard.html'];
  if (p.includes(location.pathname.split('/').pop()) && !localStorage.tuts_token) {
    alert('Login required');
    location.href = 'login.html';
  }
})();