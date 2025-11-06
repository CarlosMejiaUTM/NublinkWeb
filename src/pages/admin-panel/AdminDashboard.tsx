// FileName: AdminDashboard.tsx
// Path: src/pages/admin-panel/AdminDashboard.tsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { AdminDashboardSummary, Store, User } from "../../types"; // Importa Store y User
import Card from "../../components/common/Card";
import Button from "../../components/common/Button"; // Importa Button
import { getAdminDashboardData, getAdminPendingStores, getAdminUsers } from '../../services/api'; // Importa todas las APIs

// --- ¡NUEVOS Iconos Profesionales (Outline) ---
import {
  UsersIcon,
  BuildingStorefrontIcon,
  ClockIcon,
  CreditCardIcon,
  ChartBarIcon,
  UserGroupIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'; // Usamos outline para un look más limpio

// --- Componente de Carga (Spinner) ---
const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-96"> {/* Más alto */}
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-primary"></div>
    </div>
);

// --- Componente de Error ---
const ErrorMessage = ({ message }: { message: string }) => (
    <Card className="bg-red-50 border-red-200">
        <div className="flex items-center gap-3">
            <ExclamationTriangleIcon className="w-8 h-8 text-red-500 flex-shrink-0" />
            <div>
                <p className="font-semibold text-red-700">Error al Cargar Datos</p>
                <p className="text-sm text-red-600 mt-1">{message}</p>
            </div>
        </div>
    </Card>
);

// --- ¡NUEVO! Tarjeta de Estadísticas Rediseñada ---
const StatCard = ({ title, value, to, icon: Icon }: { title: string, value: string | number, to: string, icon: React.ElementType }) => (
  <Link to={to} className="block transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg">
    <Card className="shadow-md">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary-light rounded-full">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium text-text-muted mb-0">{title}</p>
          <p className="text-3xl font-bold text-text-main">{value}</p>
        </div>
      </div>
    </Card>
  </Link>
);

// --- ¡NUEVO! Placeholder de Gráfico de Barras ---
const BarChartPlaceholder = () => (
    <div className="h-64 bg-secondary rounded-lg border border-line-light flex items-end justify-around p-4 gap-2">
        <div className="w-1/12 bg-primary-light hover:bg-primary/50 rounded-t-md" style={{ height: '40%' }}></div>
        <div className="w-1/12 bg-primary-light hover:bg-primary/50 rounded-t-md" style={{ height: '60%' }}></div>
        <div className="w-1/12 bg-primary-light hover:bg-primary/50 rounded-t-md" style={{ height: '80%' }}></div>
        <div className="w-1/12 bg-primary-light hover:bg-primary/50 rounded-t-md" style={{ height: '50%' }}></div>
        <div className="w-1/12 bg-primary-light hover:bg-primary/50 rounded-t-md" style={{ height: '70%' }}></div>
        <div className="w-1/12 bg-primary-light hover:bg-primary/50 rounded-t-md" style={{ height: '90%' }}></div>
        <div className="w-1/12 bg-primary-light hover:bg-primary/50 rounded-t-md" style={{ height: '65%' }}></div>
    </div>
);

// --- ¡NUEVO! Placeholder de Gráfico de Dona ---
const DonutChartPlaceholder = () => (
    <div className="h-40 w-40 mx-auto bg-secondary rounded-full flex items-center justify-center border-8 border-primary-light">
        <div className="w-24 h-24 bg-surface rounded-full flex flex-col items-center justify-center">
            <UserGroupIcon className="w-8 h-8 text-primary" />
        </div>
    </div>
);


const AdminDashboardPage = () => {
    // --- Estados para TODOS los datos de la página ---
    const [statsData, setStatsData] = useState<AdminDashboardSummary | null>(null);
    const [pendingStores, setPendingStores] = useState<Store[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // --- Carga de datos unificada ---
    useEffect(() => {
        const loadAllDashboardData = async () => {
            try {
                setIsPageLoading(true);
                setError(null);

                // Llama a todas las APIs en paralelo
                const [statsResult, pendingStoresResult, usersResult] = await Promise.allSettled([
                    getAdminDashboardData(),
                    getAdminPendingStores(),
                    getAdminUsers()
                ]);

                // Maneja los resultados
                if (statsResult.status === 'fulfilled') {
                    setStatsData(statsResult.value);
                } else {
                    console.error("Error en stats:", statsResult.reason);
                    throw new Error("No se pudieron cargar las estadísticas principales.");
                }

                if (pendingStoresResult.status === 'fulfilled') {
                    setPendingStores(pendingStoresResult.value);
                } else {
                    console.error("Error en tiendas pendientes:", pendingStoresResult.reason);
                    // No es un error fatal, la página puede seguir
                }
                
                if (usersResult.status === 'fulfilled') {
                    setUsers(usersResult.value);
                } else {
                    console.error("Error en usuarios:", usersResult.reason);
                    // No es un error fatal
                }

            } catch (err) {
                setError(err instanceof Error ? err.message : "Un error inesperado ocurrió.");
            } finally {
                setIsPageLoading(false);
            }
        };
        
        loadAllDashboardData();
    }, []);

    // --- Lógica de Renderizado ---
    const renderContent = () => {
        if (isPageLoading) {
            return <LoadingSpinner />;
        }
        if (error) {
            return <ErrorMessage message={error} />;
        }
        if (statsData && statsData.usuarios) { 
            return (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* --- Columna Principal (Izquierda/Centro) --- */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Tarjetas de Estadísticas Reales */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <StatCard title="Usuarios Totales" value={statsData.usuarios.total.toLocaleString('es-MX')} to="/admin/usuarios" icon={UsersIcon} />
                            <StatCard title="Tiendas Activas" value={statsData.tiendas.activas.toLocaleString('es-MX')} to="/admin/tiendas?tab=approved" icon={BuildingStorefrontIcon} />
                            <StatCard title="Tiendas Pendientes" value={statsData.tiendas.pendientes.toLocaleString('es-MX')} to="/admin/tiendas?tab=pending" icon={ClockIcon} />
                            <StatCard title="Suscripciones Activas" value={statsData.stripe.suscripciones_activas.toLocaleString('es-MX')} to="/admin/pagos" icon={CreditCardIcon} />
                        </div>
                        
                        <Card title="Actividad de la Plataforma (Simulado)">
                           <BarChartPlaceholder />
                        </Card>
                    </div>

                    {/* --- Columna Lateral (Derecha) --- */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card title="Tiendas Pendientes por Aprobar">
                            <div className="space-y-3">
                                {pendingStores.length > 0 ? (
                                    pendingStores.slice(0, 5).map(store => ( // Muestra solo las primeras 5
                                        <div key={store.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary">
                                            <div>
                                                <p className="font-semibold text-sm text-text-main">{store.business_name}</p>
                                                <p className="text-xs text-text-muted">{store.owner_name}</p>
                                            </div>
                                            <Link to={`/admin/tienda/${store.id}`}>
                                                <Button variant="secondary" size="sm">Ver</Button>
                                            </Link>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-text-muted text-center py-4">¡No hay tiendas pendientes!</p>
                                )}
                            </div>
                            <Link to="/admin/tiendas?tab=pending">
                                <Button variant="ghost" size="sm" className="w-full mt-4">Ver todas las tiendas pendientes</Button>
                            </Link>
                        </Card>

                        <Card title="Distribución de Roles">
                            <DonutChartPlaceholder />
                            <div className="mt-4 space-y-2 text-sm">
                                <div className="flex justify-between"><span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-primary"></div>Admin</span> <span className="font-semibold">{users.filter(u => u.role === 'superadmin').length}</span></div>
                                <div className="flex justify-between"><span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-400"></div>Tiendas</span> <span className="font-semibold">{users.filter(u => u.role === 'store').length}</span></div>
                                <div className="flex justify-between"><span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-secondary"></div>Clientes</span> <span className="font-semibold">{users.filter(u => u.role === 'client').length}</span></div>
                            </div>
                        </Card>
                    </div>

                </div>
            );
        }
        
        // Mensaje si la API devuelve algo inesperado
        if (statsData && !statsData.usuarios) {
             return <ErrorMessage message="La API devolvió datos en un formato inesperado." />;
        }
        
        return <p>No hay datos disponibles.</p>;
    };

    return (
        <>
            {renderContent()}
        </>
    );
};
export default AdminDashboardPage;