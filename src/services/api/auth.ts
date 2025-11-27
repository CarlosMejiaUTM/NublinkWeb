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

/* ============================================================
 🔐 RECUPERACIÓN DE CONTRASEÑA
============================================================ */

/**
 * 📩 1) Solicitar código de recuperación
 * POST /recovery-password/request
 */
export const requestPasswordRecovery = async (email: string) => {
  const response = await fetch(`${API_BASE_URL}/recovery-password/request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data?.message || 'Error al solicitar recuperación.');
  return data;
};

/**
 * 🔐 2) Verificar código + actualizar contraseña
 * POST /recovery-password/verify
 */
export const verifyRecoveryCode = async (
  email: string,
  code: string,
  newPassword: string
) => {
  const response = await fetch(`${API_BASE_URL}/recovery-password/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code, newPassword }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data?.message || 'Error al verificar código.');
  return data;
};

/**
 * 🛠️ 3) Resetear contraseña por administrador
 * POST /recovery-password/admin/reset/{id}
 */
export const adminResetPassword = async (id: string, newPassword: string) => {
  const response = await fetchWithAuth(
    `/recovery-password/admin/reset/${id}`,
    {
      method: 'POST',
      body: JSON.stringify({ newPassword }),
    }
  );

  return response;
};
