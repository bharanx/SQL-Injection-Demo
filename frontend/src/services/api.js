// Centralized API Client Service
const API_BASE = 'http://127.0.0.1:8000/api';

export async function loginVulnerable(username, password) {
  const res = await fetch(`${API_BASE}/login/vulnerable`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return res.json();
}

export async function loginParameterized(username, password) {
  const res = await fetch(`${API_BASE}/login/parameterized`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return res.json();
}

export async function loginOrm(username, password) {
  const res = await fetch(`${API_BASE}/login/orm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return res.json();
}

export async function searchUsersVulnerable(query) {
  const res = await fetch(`${API_BASE}/users/vulnerable?q=${encodeURIComponent(query)}`);
  return res.json();
}

export async function searchUsersParameterized(query) {
  const res = await fetch(`${API_BASE}/users/parameterized?q=${encodeURIComponent(query)}`);
  return res.json();
}

export async function searchUsersOrm(query) {
  const res = await fetch(`${API_BASE}/users/orm?q=${encodeURIComponent(query)}`);
  return res.json();
}

export async function validateInputFields(payload) {
  const res = await fetch(`${API_BASE}/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
}

export async function fetchDatabaseUsers() {
  const res = await fetch(`${API_BASE}/database/users`);
  return res.json();
}
