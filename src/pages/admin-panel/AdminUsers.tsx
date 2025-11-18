// File: src/pages/admin-dashboard/AdminUsers.tsx
import { Link } from "react-router-dom";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import UserFormModal from "../../components/admin-dashboard/UserFormModal";
import type { User } from "../../types";
import {
  getAdminUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../services/api/admin";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import toast, { Toaster } from "react-hot-toast";

/* ============================================================
   ⚙️ Componentes de utilidad
   ============================================================ */
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-48">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    <span className="ml-3 text-text-muted">Cargando usuarios...</span>
  </div>
);

const ErrorMessage = ({ message }: { message: string }) => (
  <div className="p-4 text-center text-red-600 bg-red-100 rounded-lg">
    {message}
  </div>
);

const UserAvatar = ({ name }: { name: string }) => {
  const initial = name ? name.charAt(0).toUpperCase() : "U";
  const colors = [
    "bg-blue-100 text-blue-700",
    "bg-green-100 text-green-700",
    "bg-yellow-100 text-yellow-800",
    "bg-purple-100 text-purple-700",
  ];
  const colorClass = colors[name.length % colors.length];
  return (
    <div
      className={`w-10 h-10 rounded-full ${colorClass} flex items-center justify-center font-semibold flex-shrink-0`}
    >
      {initial}
    </div>
  );
};

const RoleBadge = ({ role }: { role: User["role"] }) => {
  const roleStyles: Record<string, string> = {
    superadmin: "bg-primary-light text-primary",
    store: "bg-blue-100 text-blue-700",
    client: "bg-gray-100 text-gray-700",
  };
  return (
    <span
      className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
        roleStyles[role] || "bg-gray-100 text-gray-700"
      }`}
    >
      {role === "superadmin"
        ? "Administrador"
        : role.charAt(0).toUpperCase() + role.slice(1)}
    </span>
  );
};

/* ============================================================
   🧠 Lógica principal
   ============================================================ */
const roleFilterOptions = [
  { value: "all", label: "Todos los Roles" },
  { value: "superadmin", label: "Administradores" },
  { value: "store", label: "Tiendas" },
  { value: "client", label: "Clientes" },
];

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalUser, setModalUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<User | null>(null);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  // Cargar usuarios
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setIsLoading(true);
        const data = await getAdminUsers();
        setUsers(data);
      } catch (err) {
        setError("Error al cargar usuarios");
      } finally {
        setIsLoading(false);
      }
    };
    loadUsers();
  }, []);

  // Filtrado optimizado
  const filteredUsers = useMemo(() => {
    return users
      .filter((u) => (roleFilter === "all" ? true : u.role === roleFilter))
      .filter(
        (u) =>
          u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [users, roleFilter, searchQuery]);

  const handleSave = useCallback(
    async (formData: Partial<User>) => {
      if (!formData.name || !formData.email) {
        toast.error("Nombre y correo son obligatorios");
        return;
      }
      try {
        if (modalUser) {
          const updated = await updateUser(modalUser.id, formData);
          setUsers((prev) =>
            prev.map((u) => (u.id === updated.id ? updated : u))
          );
          toast.success("Usuario actualizado correctamente");
        } else {
          const newUser = await createUser(formData);
          setUsers((prev) => [newUser, ...prev]);
          toast.success("Usuario creado correctamente");
        }
        setShowModal(false);
        setModalUser(null);
      } catch (err) {
        toast.error("❌ Error al guardar usuario");
      }
    },
    [modalUser]
  );

  const handleDelete = useCallback(async () => {
    if (!confirmDelete) return;
    try {
      await deleteUser(confirmDelete.id);
      setUsers((prev) => prev.filter((u) => u.id !== confirmDelete.id));
      toast.success("Usuario eliminado correctamente");
      setConfirmDelete(null);
    } catch (err) {
      toast.error("❌ No se pudo eliminar el usuario");
    }
  }, [confirmDelete]);

  // Paginación local
  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  /* ============================================================
     🖥️ Tabla principal
     ============================================================ */
  const renderTable = () => {
    if (isLoading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} />;
    if (filteredUsers.length === 0)
      return (
        <p className="text-center text-text-muted p-8">
          No se encontraron usuarios.
        </p>
      );

    return (
      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary text-text-main">
              <tr>
                <th className="p-4">Usuario</th>
                <th className="p-4">Rol</th>
                <th className="p-4">Teléfono</th>
                <th className="p-4">Registrado</th>
                <th className="p-4">Tienda</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-t border-line-light hover:bg-secondary-light hover:shadow-sm transition"
                >
                  <td className="p-4 flex items-center gap-3">
                    <UserAvatar name={user.name} />
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-xs text-text-muted">{user.email}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <RoleBadge role={user.role} />
                  </td>
                  <td className="p-4 text-text-muted">{user.phone || "N/A"}</td>
                  <td className="p-4 text-text-muted">
                    {new Date(user.created_at).toLocaleDateString("es-MX")}
                  </td>
                  <td className="p-4 text-text-muted">
                    {user.store ? (
                      <Link
                        to={`/admin/tienda/${user.store.id}`}
                        className="text-primary hover:underline"
                      >
                        {user.store.business_name}
                      </Link>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="p-4 text-right space-x-1">
                    {user.role === "superadmin" && user.email === "superadmin@gmail.com" ? (
                      <span className="text-text-muted text-xs">No editable</span>
                    ) : (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Editar usuario"
                          onClick={() => {
                            setModalUser(user);
                            setShowModal(true);
                          }}
                        >
                          <PencilSquareIcon className="w-5 h-5 text-primary hover:scale-110 transition" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Eliminar usuario"
                          onClick={() => setConfirmDelete(user)}
                        >
                          <TrashIcon className="w-5 h-5 text-red-500 hover:scale-110 transition" />
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredUsers.length > usersPerPage && (
          <div className="p-4 border-t flex justify-between text-xs text-text-muted">
            <span>
              Mostrando {indexOfFirst + 1}-{Math.min(indexOfLast, filteredUsers.length)} de{" "}
              {filteredUsers.length}
            </span>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </Card>
    );
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
        <div className="flex gap-4 flex-1">
          <Input
            placeholder="Buscar por nombre o email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 !py-2 w-full md:w-72"
            icon={
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
            }
          />
          <Select
            options={roleFilterOptions}
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="!py-2 w-full md:w-48"
          />
        </div>

        <Button
          className="flex items-center gap-2 bg-primary text-white hover:bg-primary-dark"
          onClick={() => {
            setModalUser(null);
            setShowModal(true);
          }}
        >
          <PlusIcon className="w-5 h-5" /> Añadir Usuario
        </Button>
      </div>

      {renderTable()}

      {showModal && (
        <UserFormModal
          user={modalUser}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}

      {confirmDelete && (
        <ConfirmDialog
          title="Eliminar Usuario"
          message={`¿Seguro que deseas eliminar a ${confirmDelete.name}?`}
          onCancel={() => setConfirmDelete(null)}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
};

export default AdminUsers;
