// File: src/services/api/helpers.ts

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/* ============================================================
 🔧 fetchWithAuth
 ============================================================ */
export const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    window.location.href = '/login?sessionExpired=true';
    throw new Error('No estás autenticado.');
  }

  const headers = new Headers(options.headers || {});
  headers.append('Authorization', `Bearer ${token}`);
  if (!headers.has('Content-Type')) headers.append('Content-Type', 'application/json');

  const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.clear();
      window.location.href = '/login?sessionExpired=true';
      throw new Error('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.');
    }
    try {
      const errorData = await response.json();
      const msg = Array.isArray(errorData.message)
        ? errorData.message.join(', ')
        : errorData.message || `Error HTTP: ${response.status}`;
      throw new Error(msg);
    } catch {
      throw new Error(`Error HTTP: ${response.status}`);
    }
  }

  if (response.status === 204) return null;
  try {
    return await response.json();
  } catch {
    throw new Error('Respuesta del servidor no es JSON válido.');
  }
};

/* ============================================================
 🔧 fetchWithoutAuth
 ============================================================ */
export const fetchWithoutAuth = async (endpoint: string, options: RequestInit = {}) => {
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type')) headers.append('Content-Type', 'application/json');

  const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });

  if (!response.ok) {
    try {
      const err = await response.json();
      const msg = Array.isArray(err.message)
        ? err.message.join(', ')
        : err.message || `Error HTTP: ${response.status}`;
      throw new Error(msg);
    } catch {
      throw new Error(`Error HTTP: ${response.status}`);
    }
  }

  if (response.status === 204) return null;
  try {
    return await response.json();
  } catch {
    throw new Error('Respuesta del servidor no es JSON válido.');
  }
};

export { API_BASE_URL };
