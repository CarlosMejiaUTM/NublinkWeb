// FileName: StoreOrders.tsx
// Path: src/pages/store-panel/StoreOrders.tsx

import DashboardLayout from "../../layouts/DashboardLayout";
import { Order } from "../../types";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Card from "../../components/common/Card"; // Usa Card

// Iconos Placeholder
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const ThreeDotsVerticalIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>;

// Datos Mock
const mockOrders: Order[] = [
    { id: 'ORD-001', clientName: 'Juan Pérez', productName: 'Taladro Inalámbrico 20V', date: '2025-10-19', status: 'Pendiente'},
    { id: 'ORD-002', clientName: 'Ana García', productName: 'Juego de Desarmadores', date: '2025-10-18', status: 'Entregado'},
    { id: 'ORD-003', clientName: 'Luis Morales', productName: 'Martillo de Uña 16oz', date: '2025-10-18', status: 'Confirmado'},
    { id: 'ORD-004', clientName: 'Sofía López', productName: 'Sierra Circular Eléctrica', date: '2025-10-17', status: 'Pagado'},
    { id: 'ORD-005', clientName: 'Carlos Ruiz', productName: 'Caja de Herramientas Grande', date: '2025-10-17', status: 'Pendiente'},
];

// Estilos de Badge para el estado
const statusStyles: { [key in Order['status']]: string } = {
    'Pendiente': 'bg-yellow-100 text-yellow-800',
    'Confirmado': 'bg-blue-100 text-blue-800',
    'Pagado': 'bg-purple-100 text-purple-800',
    'Entregado': 'bg-green-100 text-green-800',
    'Cancelado': 'bg-red-100 text-red-800',
};


const StoreOrdersPage = () => {
    return (
        <DashboardLayout
            pageTitle="Orders" // Título simplificado
            pageDescription="Manage your customer's reservations and purchases."
        >
             <div className="flex justify-end items-center mb-6">
                <div className="relative w-full sm:w-64">
                     {/* Input de búsqueda estilizado */}
                    <input
                        id="searchOrders"
                        type="text"
                        placeholder="Search orders..."
                        className="w-full pl-10 pr-4 py-2 border border-line-light bg-secondary rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary text-sm placeholder-text-muted/60"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon />
                    </div>
                </div>
            </div>

            {/* Tabla dentro de una Card */}
            <Card className="overflow-hidden p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-secondary text-text-main">
                            <tr>
                                <th className="p-4 font-semibold">Order ID</th>
                                <th className="p-4 font-semibold">Client</th>
                                <th className="p-4 font-semibold">Product</th>
                                <th className="p-4 font-semibold">Date</th>
                                <th className="p-4 font-semibold">Status</th>
                                <th className="p-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockOrders.map((order) => (
                                <tr key={order.id} className="border-t border-line-light hover:bg-secondary-light transition-colors">
                                    <td className="p-4 font-mono text-text-muted whitespace-nowrap">{order.id}</td>
                                    <td className="p-4 font-medium text-text-main whitespace-nowrap">{order.clientName}</td>
                                    <td className="p-4 text-text-muted whitespace-nowrap">{order.productName}</td>
                                    <td className="p-4 text-text-muted whitespace-nowrap">{order.date}</td>
                                    <td className="p-4">
                                        <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full ${statusStyles[order.status]}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        {/* Placeholder para menú desplegable */}
                                        <Button variant="ghost" size="sm" className="px-2">
                                            <ThreeDotsVerticalIcon />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                 {/* Footer de la tabla con Paginación */}
                <div className="p-4 border-t border-line-light flex justify-between items-center text-xs text-text-muted">
                    <span>Showing 1-5 of {mockOrders.length} orders</span>
                    <div className="flex gap-1">
                        <Button variant="secondary" size="sm" className="px-2" disabled>
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        </Button>
                        <Button variant="secondary" size="sm" className="px-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </Button>
                    </div>
                </div>
            </Card>

        </DashboardLayout>
    );
};

export default StoreOrdersPage;