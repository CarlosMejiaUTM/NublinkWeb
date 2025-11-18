// ✅ File: src/components/admin-dashboard/UserFormModal.tsx
// 📂 Path: src/components/admin-dashboard/UserFormModal.tsx

import React, { useState } from "react";
import Modal from "../common/Modal";
import Input from "../common/Input";
import Select from "../common/Select";
import Button from "../common/Button";
import type { User } from "../../types";

const roleOptions = [
  { value: "superadmin", label: "Administrador" },
  { value: "store", label: "Tienda" },
  { value: "client", label: "Cliente" },
];

interface Props {
  user?: User | null;
  onClose: () => void;
  onSave: (data: Partial<User>) => void;
}

const UserFormModal: React.FC<Props> = ({ user, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    role: user?.role || "client",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.name || !form.email) return alert("Nombre y correo son obligatorios");
    onSave(form);
  };

  return (
    <Modal title={user ? "Editar Usuario" : "Nuevo Usuario"} onClose={onClose}>
      <div className="space-y-4">
        <Input label="Nombre" name="name" value={form.name} onChange={handleChange} />
        <Input label="Correo" name="email" value={form.email} onChange={handleChange} />
        <Input label="Teléfono" name="phone" value={form.phone} onChange={handleChange} />
        {!user && (
          <Input
            label="Contraseña"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
          />
        )}
        <Select label="Rol" name="role" value={form.role} onChange={handleChange} options={roleOptions} />
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit}>{user ? "Guardar cambios" : "Crear Usuario"}</Button>
      </div>
    </Modal>
  );
};

export default UserFormModal;
