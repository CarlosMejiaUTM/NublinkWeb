// File: src/services/api/recovery.ts

import { API_BASE_URL, fetchWithAuth } from "./helpers";

/* ============================================================
 📩 1) Enviar código de recuperación
 ============================================================ */
export const requestRecoveryCode = async (email: string) => {
  const endpoint = "/recovery-password/request";

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || "Error enviando código.");
  }

  return data;
};

/* ============================================================
 🔐 2) Verificar código y actualizar contraseña
 ============================================================ */
export const verifyRecoveryCode = async (
  email: string,
  code: string,
  newPassword: string
) => {
  const endpoint = "/recovery-password/verify";

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      code,
      new_password: newPassword,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || "Código incorrecto o expirado.");
  }

  return data;
};

/* ============================================================
 🛠️ 3) Admin resetea contraseña de un usuario
 ============================================================ */
export const adminResetPassword = async (
  userId: string,
  newPassword: string
) => {
  const endpoint = `/recovery-password/admin/reset/${userId}`;

  const response = await fetchWithAuth(endpoint, {
    method: "POST",
    body: JSON.stringify({ new_password: newPassword }),
  });

  if (!response || response.error) {
    throw new Error(response?.message || "Error al resetear contraseña.");
  }

  return response;
};
