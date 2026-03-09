// Shared auth utilities — include on every page that needs auth awareness

function getToken()    { return localStorage.getItem('token'); }
function getUsername() { return localStorage.getItem('username'); }

function saveAuth(token, username) {
  localStorage.setItem('token', token);
  localStorage.setItem('username', username);
}

function clearAuth() {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
}

function authHeaders() {
  return { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` };
}

// ── Login page functions ──────────────────────────────────────────────────────

function showLogin()    { document.getElementById('loginForm').style.display=''; document.getElementById('registerForm').style.display='none'; document.getElementById('formTitle').textContent='Sign In'; }
function showRegister() { document.getElementById('loginForm').style.display='none'; document.getElementById('registerForm').style.display=''; document.getElementById('formTitle').textContent='Create Account'; }

async function doLogin() {
  const status = document.getElementById('authStatus');
  status.textContent = 'Signing in…';
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: document.getElementById('loginEmail').value, password: document.getElementById('loginPassword').value }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    saveAuth(data.token, data.username);
    window.location.href = 'index.html';
  } catch (err) { status.textContent = err.message; }
}

async function doRegister() {
  const status = document.getElementById('authStatus');
  status.textContent = 'Creating account…';
  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: document.getElementById('regUsername').value, email: document.getElementById('regEmail').value, password: document.getElementById('regPassword').value }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    saveAuth(data.token, data.username);
    window.location.href = 'index.html';
  } catch (err) { status.textContent = err.message; }
}

// update nav
function updateNav() {
  const username = getUsername();
  const navUser  = document.getElementById('navUser');
  const navLogin = document.getElementById('navLogin');
  const navLogout = document.getElementById('navLogout');
  if (username) {
    navUser.textContent  = `@${username}`;
    navLogin.style.display  = 'none';
    navLogout.style.display = '';
  }
}
updateNav();