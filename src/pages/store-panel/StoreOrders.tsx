// FileName: StoreOrders.tsx
// Path: src/pages/store-panel/StoreOrders.tsx
import React from 'react';
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import type { Order } from "../../types";

// ... (datos mock y estilos sin cambios) ...
const mockOrders: Order[] = [ { id: 'ORD-001', clientName: 'Juan Pérez', productName: 'Taladro Inalámbrico 20V', date: '2025-10-19', status: 'Pendiente'}, { id: 'ORD-002', clientName: 'Ana García', productName: 'Juego de Desarmadores', date: '2025-10-18', status: 'Entregado'}, { id: 'ORD-003', clientName: 'Luis Morales', productName: 'Martillo de Uña 16oz', date: '2025-10-18', status: 'Confirmado'}, ];
const statusStyles: { [key in Order['status']]: string } = { 'Pendiente': 'bg-yellow-100 text-yellow-800', 'Confirmado': 'bg-blue-100 text-blue-800', 'Pagado': 'bg-purple-100 text-purple-800', 'Entregado': 'bg-green-100 text-green-800', 'Cancelado': 'bg-red-100 text-red-800', };
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const ThreeDotsVerticalIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>;


const StoreOrdersPage = () => {
    // Página simulada
    return (
        <>
             <div className="flex justify-end items-center mb-6">
                <div className="relative w-full sm:w-64">
                    <input id="searchOrders" type="text" placeholder="Buscar pedidos..." className="w-full pl-10 pr-4 py-2 border border-line-light bg-secondary rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary text-sm placeholder-text-muted/60" />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"> <SearchIcon /> </div>
                </div>
            </div>
            <Card className="overflow-hidden p-0">
                <div className="p-4 text-center text-text-muted">
                    <h3 className="font-semibold text-lg">Página en Construcción</h3>
                    <p className="text-sm">La API para `GET /web/stores/mine/orders` aún no está conectada.</p>
                </div>
                {/* ... (tabla de mock data comentada para simpleza) ... */}
            </Card>
        </>
    );
};
export default StoreOrdersPage;