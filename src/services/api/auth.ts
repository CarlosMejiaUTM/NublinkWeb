// File: src/services/api/auth.ts

import { fetchWithAuth, API_BASE_URL } from './helpers';
import type { LoginResponse, MeResponse } from '../../types';

/* ============================================================
 🧍 AUTENTICACIÓN
 ============================================================ */
export const loginUser = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const LOGIN_ENDPOINT = '/auth/login';
  const response = await fetch(`${API_BASE_URL}${LOGIN_ENDPOINT}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok) {
    const errorMessage = data?.message || `Error HTTP: ${response.status}`;
    throw new Error(errorMessage);
  }

  if (!data.access_token && !data.token) {
    throw new Error("Respuesta inválida: falta 'access_token' o 'token'.");
  }

  return data as LoginResponse;
};

export const getMe = async (): Promise<MeResponse> => {
  const ME_ENDPOINT = '/auth/me';
  const data = await fetchWithAuth(ME_ENDPOINT, { method: 'GET' });
  if (!data || (!data.id && !data.user_id))
    throw new Error('Respuesta inválida de /auth/me.');
  return data as MeResponse;
};
