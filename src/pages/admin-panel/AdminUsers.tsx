// FileName: AdminUsers.tsx
// Path: src/pages/admin-panel/AdminUsers.tsx
import { Link } from "react-router-dom";
import React, { useState, useEffect, useMemo } from 'react';
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input"; // <-- ¡NUEVO!
import Select from "../../components/common/Select"; // <-- ¡NUEVO!
import type { User } from "../../types";
import { getAdminUsers } from '../../services/api';

// --- ¡NUEVO! Iconos Profesionales ---
import { 
    MagnifyingGlassIcon, 
    PlusIcon,
    PencilSquareIcon,
    TrashIcon
} from '@heroicons/react/20/solid';

// --- (Spinner y Error) ---
const LoadingSpinner = () => (<div className="flex justify-center items-center h-48"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>);
const ErrorMessage = ({ message }: { message: string }) => (<div className="p-4 text-center text-red-600 bg-red-100 rounded-lg">{message}</div>);

// --- ¡NUEVO! Avatar de Usuario ---
const UserAvatar = ({ name }: { name: string }) => {
    const initial = name ? name.charAt(0).toUpperCase() : 'U';
    // Colores aleatorios suaves para los avatares
    const colors = ['bg-blue-100 text-blue-700', 'bg-green-100 text-green-700', 'bg-yellow-100 text-yellow-800', 'bg-purple-100 text-purple-700'];
    const colorClass = colors[name.length % colors.length];
    
    return (
        <div className={`w-10 h-10 rounded-full ${colorClass} flex items-center justify-center font-semibold flex-shrink-0`}>
            {initial}
        </div>
    );
};

// --- ¡NUEVO! Badge de Rol ---
const RoleBadge = ({ role }: { role: User['role'] }) => {
    const roleStyles: { [key: string]: string } = {
        'superadmin': 'bg-primary-light text-primary',
        'store': 'bg-blue-100 text-blue-700',
        'client': 'bg-gray-100 text-gray-700',
    };
    return (
        <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${roleStyles[role] || 'bg-gray-100 text-gray-700'}`}>
            {role === 'superadmin' ? 'Admin' : role.charAt(0).toUpperCase() + role.slice(1)}
        </span>
    );
};

// Opciones para el filtro de rol
const roleFilterOptions = [
    { value: 'all', label: 'Todos los Roles' },
    { value: 'superadmin', label: 'Administradores' },
    { value: 'store', label: 'Tiendas' },
    { value: 'client', label: 'Clientes' },
];


const AdminUsersPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // --- ¡NUEVO! Estados para filtros ---
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');

    useEffect(() => {
        const loadUsers = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const data = await getAdminUsers();
                setUsers(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Error desconocido");
            } finally {
                setIsLoading(false);
            }
        };
        loadUsers();
    }, []);

    // --- ¡NUEVO! Lógica de filtrado ---
    const filteredUsers = useMemo(() => {
        return users
            .filter(user => 
                // Filtro de Rol
                roleFilter === 'all' ? true : user.role === roleFilter
            )
            .filter(user => 
                // Filtro de Búsqueda
                user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase())
            );
    }, [users, searchQuery, roleFilter]);

    const renderContent = () => {
        if (isLoading) return <LoadingSpinner />;
        if (error) return <ErrorMessage message={error} />;
        if (users.length > 0 && filteredUsers.length === 0) {
             return <p className="text-center text-text-muted p-8">No se encontraron usuarios que coincidan con tu búsqueda.</p>;
        }
        if (filteredUsers.length === 0) {
            return <p className="text-center text-text-muted p-8">No hay usuarios en la plataforma.</p>;
        }

        return (
            <Card className="overflow-hidden p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-secondary text-text-main">
                            <tr>
                                <th className="p-4 font-semibold">Usuario</th>
                                <th className="p-4 font-semibold">Rol</th>
                                <th className="p-4 font-semibold">Teléfono</th>
                                <th className="p-4 font-semibold">Registrado</th>
                                <th className="p-4 font-semibold">Tienda Asociada</th>
                                <th className="p-4 font-semibold text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="border-t border-line-light hover:bg-secondary-light transition-colors">
                                    
                                    {/* --- ¡MEJORA! Avatar + Nombre/Email --- */}
                                    <td className="p-4 flex items-center gap-3 whitespace-nowrap">
                                        <UserAvatar name={user.name} />
                                        <div>
                                            <p className="font-semibold text-text-main">{user.name}</p>
                                            <p className="text-xs text-text-muted">{user.email}</p>
                                        </div>
                                    </td>
                                    
                                    <td className="p-4">
                                        <RoleBadge role={user.role} />
                                    </td>
                                    
                                    <td className="p-4 text-text-muted">{user.phone || 'N/A'}</td>
                                    
                                    <td className="p-4 text-text-muted">{new Date(user.created_at).toLocaleDateString('es-MX')}</td>

                                    <td className="p-4 text-text-muted">
                                        {user.store ? (
                                            <Link to={`/admin/tienda/${user.store.id}`} className="text-primary hover:underline">
                                                {user.store.business_name} (ID: {user.store.id})
                                            </Link>
                                        ) : (
                                            'N/A'
                                        )}
                                    </td>
                                    
                                    {/* --- ¡MEJORA! Acciones con Iconos --- */}
                                    <td className="p-4 text-right space-x-1">
                                        <Button variant="ghost" size="sm" className="text-text-muted hover:text-primary">
                                            <PencilSquareIcon className="w-5 h-5" />
                                        </Button>
                                        <Button variant="ghost" size="sm" className="text-text-muted hover:text-red-500">
                                            <TrashIcon className="w-5 h-5" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {/* --- ¡MEJORA! Paginación (Placeholder) --- */}
                { !isLoading && filteredUsers.length > 0 && (
                    <div className="p-4 border-t border-line-light flex justify-between items-center text-xs text-text-muted">
                        <span>Mostrando {filteredUsers.length} de {users.length} usuarios</span>
                        <div className="flex gap-1">
                            <Button variant="secondary" size="sm" className="px-2" disabled> &lt; Anterior </Button>
                            <Button variant="secondary" size="sm" className="px-2"> Siguiente &gt; </Button>
                        </div>
                    </div>
                )}
            </Card>
        );
    };

    return (
        <>
            {/* --- ¡MEJORA! Barra de Controles --- */}
            <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
                <div className="flex gap-4">
                    <div className="relative w-full md:w-72">
                        <Input
                            id="searchUser"
                            label=""
                            placeholder="Buscar por nombre o email..."
                            className="pl-10 !py-2"
                            containerClassName="mb-0"
                            icon={<MagnifyingGlassIcon />}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="w-full md:w-48">
                        <Select
                            id="roleFilter"
                            label=""
                            containerClassName="mb-0"
                            className="!py-2"
                            options={roleFilterOptions}
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                        />
                    </div>
                </div>
                <Button>
                  <PlusIcon className="w-5 h-5" />
                  Añadir Usuario
                </Button>
            </div>
        
            {renderContent()}
        </>
    );
};
export default AdminUsersPage;