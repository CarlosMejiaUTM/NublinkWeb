// File: src/pages/auth/RecoveryRequestPage.tsx

import { useState } from "react";
import { requestRecoveryCode } from "../../services/api/recovery";

export default function RecoveryRequestPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await requestRecoveryCode(email);
      setMessage(res.message || "Código enviado al correo.");
    } catch (err: any) {
      setMessage(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary text-white">
      <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md text-primary">
        <h2 className="text-2xl font-bold mb-4">Recuperar contraseña</h2>
        <p className="mb-4 text-gray-600">
          Ingresa tu correo para enviarte el código de recuperación.
        </p>

        {message && <p className="mb-4 text-red-500">{message}</p>}

        <form onSubmit={handleSubmit}>
          <label className="block mb-2 font-semibold">Correo</label>
          <input
            type="email"
            className="w-full border p-3 rounded-lg mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-blue-900 transition"
          >
            Enviar código
          </button>
        </form>
      </div>
    </div>
  );
}
