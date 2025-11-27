// File: src/pages/auth/RecoveryVerifyPage.tsx

import { useState } from "react";
import { verifyRecoveryCode } from "../../services/api/recovery";

export default function RecoveryVerifyPage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await verifyRecoveryCode(email, code, password);
      setMessage(res.message || "Contraseña actualizada correctamente.");
    } catch (err: any) {
      setMessage(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary text-white">
      <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md text-primary">
        <h2 className="text-2xl font-bold mb-4">Verificar código</h2>

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

          <label className="block mb-2 font-semibold">Código</label>
          <input
            type="text"
            className="w-full border p-3 rounded-lg mb-4"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />

          <label className="block mb-2 font-semibold">Nueva contraseña</label>
          <input
            type="password"
            className="w-full border p-3 rounded-lg mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-blue-900 transition"
          >
            Actualizar contraseña
          </button>
        </form>
      </div>
    </div>
  );
}
