const API_URL = 'https://dummyjson.com';

export async function login(username, password) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, expiresInMins: 30 }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Eroare de autentificare');
  }
  return data;
}

export async function getMe(token) {
  const response = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Sesiune expirată');
  }
  return data;
}