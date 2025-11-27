// File: src/pages/admin-panel/AdminResetPasswordPage.tsx

import { useState } from "react";
import { adminResetPassword } from "../../services/api/recovery";

export default function AdminResetPasswordPage() {
  const [userId, setUserId] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await adminResetPassword(userId, newPassword);
      setMessage(res.message || "Contraseña restablecida.");
    } catch (err: any) {
      setMessage(err.message);
    }
  };

  return (
    <div className="p-10 bg-white rounded-xl shadow-lg max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-primary">
        Reiniciar contraseña (Admin)
      </h2>

      {message && <p className="mb-4 text-red-500">{message}</p>}

      <form onSubmit={handleReset}>
        <label className="block mb-2 font-semibold">ID del usuario</label>
        <input
          className="w-full border p-3 rounded-lg mb-4"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
        />

        <label className="block mb-2 font-semibold">Nueva contraseña</label>
        <input
          type="password"
          className="w-full border p-3 rounded-lg mb-4"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <button
          className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-blue-900 transition"
        >
          Restablecer
        </button>
      </form>
    </div>
  );
}
