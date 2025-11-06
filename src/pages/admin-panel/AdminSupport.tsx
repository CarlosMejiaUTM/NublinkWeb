// FileName: AdminSupport.tsx
// Path: src/pages/admin-panel/AdminSupport.tsx

import React, { useState, useEffect } from 'react';
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
// (Quitamos DashboardLayout, App.tsx se encarga de eso)

// --- Iconos para la UI ---
import { 
    TicketIcon, 
    ClockIcon, 
    CheckCircleIcon, 
    EyeIcon 
} from '@heroicons/react/24/outline'; // Usamos outline para un look más limpio

// --- Tipos de Datos (Simulados) ---
type SupportTicketStatus = 'Abierto' | 'En Progreso' | 'Resuelto';
type SupportTicketPriority = 'Baja' | 'Media' | 'Alta';

interface SupportTicket {
  id: string;
  subject: string;
  userName: string; // O storeName
  date: string;
  status: SupportTicketStatus;
  priority: SupportTicketPriority;
}

// --- Componentes Internos ---
const LoadingSpinner = () => (<div className="flex justify-center items-center h-48"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>);
const ErrorMessage = ({ message }: { message: string }) => (<div className="p-4 text-center text-red-600 bg-red-100 rounded-lg">{message}</div>);

// Tarjeta de KPI
const StatCard = ({ title, value, icon: Icon }: { title: string, value: string, icon: React.ElementType }) => (
    <Card className="shadow-sm" hoverEffect={true}> {/* Añadido hoverEffect */}
      <div className="flex items-center gap-4">
        <div className="p-3 bg-secondary rounded-full">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium text-text-muted mb-0">{title}</p>
          <p className="text-3xl font-bold text-text-main mt-1">{value}</p>
        </div>
      </div>
    </Card>
);

// Badge de Estado
const StatusBadge = ({ status }: { status: SupportTicketStatus }) => {
    const styles: { [key in SupportTicketStatus]: string } = {
        'Abierto': 'bg-blue-100 text-blue-700',
        'En Progreso': 'bg-yellow-100 text-yellow-800',
        'Resuelto': 'bg-green-100 text-green-700',
    };
    return (
        <span className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>
            {status}
        </span>
    );
};

// Badge de Prioridad
const PriorityBadge = ({ priority }: { priority: SupportTicketPriority }) => {
    const styles: { [key in SupportTicketPriority]: string } = {
        'Baja': 'bg-gray-100 text-gray-700',
        'Media': 'bg-orange-100 text-orange-700',
        'Alta': 'bg-red-100 text-red-700',
    };
    return (
        <span className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full ${styles[priority]}`}>
            {priority}
        </span>
    );
};

// --- Datos Simulados (Mock Data) ---
// (Tu API `GET /admin/support/tickets` debería devolver esto)
const mockTickets: SupportTicket[] = [
    { id: 'TKT-001', subject: 'Problema con mi pago de suscripción', userName: 'Ferretería El Martillo', date: '2025-11-05', status: 'Abierto', priority: 'Alta' },
    { id: 'TKT-002', subject: 'No puedo subir mis productos', userName: 'Ropa y Estilo', date: '2025-11-05', status: 'Abierto', priority: 'Media' },
    { id: 'TKT-003', subject: 'Mi tienda no aparece en el mapa', userName: 'Café del Bosque', date: '2025-11-04', status: 'En Progreso', priority: 'Media' },
    { id: 'TKT-004', subject: 'Duda sobre la comisión', userName: 'Librería El Saber', date: '2025-11-03', status: 'Resuelto', priority: 'Baja' },
];


const AdminSupportPage = () => {
    const [activeTab, setActiveTab] = useState<SupportTicketStatus>('Abierto');
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Simulación de carga de datos
    useEffect(() => {
        const loadTickets = async () => {
            try {
                setIsLoading(true);
                setError(null);
                // --- LLAMADA A LA API (SIMULADA) ---
                // const data = await getAdminSupportTickets();
                // setTickets(data);
                
                await new Promise(resolve => setTimeout(resolve, 1000));
                setTickets(mockTickets); // Usamos los datos mock

            } catch (err) {
                setError(err instanceof Error ? err.message : "Error al cargar los tickets.");
            } finally {
                setIsLoading(false);
            }
        };
        loadTickets();
    }, []);

    // --- Lógica de filtrado por pestaña ---
    const filteredTickets = useMemo(() => {
        return tickets.filter(ticket => ticket.status === activeTab);
    }, [tickets, activeTab]);

    // --- Cálculos de KPIs ---
    const ticketsAbiertos = tickets.filter(t => t.status === 'Abierto' || t.status === 'En Progreso').length;
    const ticketsNuevos = tickets.filter(t => t.status === 'Abierto').length;

    const renderContent = () => {
        if (isLoading) return <LoadingSpinner />;
        if (error) return <ErrorMessage message={error} />;
        
        return (
            <Card className="overflow-hidden p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-secondary text-text-main">
                            <tr>
                                <th className="p-4 font-semibold">ID Ticket</th>
                                <th className="p-4 font-semibold">Asunto</th>
                                <th className="p-4 font-semibold">Usuario / Tienda</th>
                                <th className="p-4 font-semibold">Prioridad</th>
                                <th className="p-4 font-semibold">Estado</th>
                                <th className="p-4 font-semibold text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTickets.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center p-8 text-text-muted">
                                        No hay tickets en esta categoría.
                                    </td>
                                </tr>
                            ) : (
                                filteredTickets.map((ticket) => (
                                    <tr key={ticket.id} className="border-t border-line-light hover:bg-secondary-light">
                                        <td className="p-4 font-mono text-text-muted text-xs">{ticket.id}</td>
                                        <td className="p-4 font-medium text-text-main max-w-xs truncate" title={ticket.subject}>
                                            {ticket.subject}
                                        </td>
                                        <td className="p-4 text-text-muted">{ticket.userName}</td>
                                        <td className="p-4">
                                            <PriorityBadge priority={ticket.priority} />
                                        </td>
                                        <td className="p-4">
                                            <StatusBadge status={ticket.status} />
                                        </td>
                                        <td className="p-4 text-right">
                                            <Button variant="secondary" size="sm">
                                                <EyeIcon className="w-4 h-4" />
                                                <span>Ver Ticket</span>
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        );
    };

    const getTabClass = (tabName: SupportTicketStatus) => {
         return `px-4 py-2 font-medium text-sm rounded-md transition-colors ${activeTab === tabName ? 'bg-primary text-white shadow-sm' : 'text-text-muted hover:bg-secondary hover:text-text-main'}`;
    };

    return (
        // ¡Ya no se envuelve en el Layout!
        <>
            {/* --- ¡MEJORA! Tarjetas de KPIs --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
                <StatCard 
                    title="Tickets Abiertos (Total)" 
                    value={ticketsAbiertos.toString()}
                    icon={TicketIcon} 
                />
                <StatCard 
                    title="Tickets Nuevos (Sin Asignar)" 
                    value={ticketsNuevos.toString()} 
                    icon={ClockIcon} 
                />
                 <StatCard 
                    title="Resueltos (Hoy)" 
                    value={"0"} // (Dato simulado)
                    icon={CheckCircleIcon} 
                />
            </div>

            {/* --- ¡MEJORA! Pestañas de Flujo de Trabajo --- */}
            <div className="flex justify-between items-center mb-6">
                <div className="bg-surface p-1 rounded-lg border border-line-light shadow-sm inline-flex space-x-1">
                    <button onClick={() => setActiveTab('Abierto')} className={getTabClass('Abierto')}>
                        Nuevos
                    </button>
                    <button onClick={() => setActiveTab('En Progreso')} className={getTabClass('En Progreso')}>
                        En Progreso
                    </button>
                     <button onClick={() => setActiveTab('Resuelto')} className={getTabClass('Resuelto')}>
                        Resueltos
                    </button>
                </div>
                <Button>+ Crear Ticket</Button>
            </div>

            {renderContent()}
        </>
    );
};
export default AdminSupportPage;