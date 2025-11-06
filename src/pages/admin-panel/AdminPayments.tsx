// FileName: AdminPayments.tsx
// Path: src/pages/admin-panel/AdminPayments.tsx

import React, { useState, useEffect } from 'react';
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
// (Quitamos DashboardLayout, App.tsx se encarga de eso)

// --- Iconos para la UI ---
import { CurrencyDollarIcon, BanknotesIcon, CheckCircleIcon, ArrowDownOnSquareIcon } from '@heroicons/react/24/outline';

// --- Tipos de Datos (Simulados) ---
type TransactionStatus = 'Pagado' | 'Pendiente' | 'Fallido';
interface Transaction {
  id: string; // ej. "sub_1SP9R8..."
  storeName: string;
  amount: number; // Monto total
  commission: number; // Comisión de Nublink
  date: string;
  status: TransactionStatus;
}

// --- Componentes Internos ---
const LoadingSpinner = () => (<div className="flex justify-center items-center h-48"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>);
const ErrorMessage = ({ message }: { message: string }) => (<div className="p-4 text-center text-red-600 bg-red-100 rounded-lg">{message}</div>);

// Tarjeta de KPI
const StatCard = ({ title, value, icon: Icon }: { title: string, value: string, icon: React.ElementType }) => (
    <Card className="shadow-sm">
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
const StatusBadge = ({ status }: { status: TransactionStatus }) => {
    const styles: { [key in TransactionStatus]: string } = {
        'Pagado': 'bg-green-100 text-green-700',
        'Pendiente': 'bg-yellow-100 text-yellow-800',
        'Fallido': 'bg-red-100 text-red-700',
    };
    return (
        <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
            {status}
        </span>
    );
};

// --- Datos Simulados (Mock Data) ---
// (Tu API `GET /admin/payments/transactions` debería devolver esto)
const mockTransactions: Transaction[] = [
    { id: 'sub_1SP9R8...', storeName: 'Librería El Saber', amount: 500.00, commission: 50.00, date: '2025-11-03', status: 'Pagado' },
    { id: 'sub_1SP9Qk...', storeName: 'Ferretería La Llave', amount: 200.00, commission: 20.00, date: '2025-11-03', status: 'Pagado' },
    { id: 'sub_1SP9Pa...', storeName: 'Panadería La Tradición', amount: 500.00, commission: 50.00, date: '2025-11-02', status: 'Pagado' },
    { id: 'sub_1SP8z... ', storeName: 'Café del Bosque', amount: 200.00, commission: 20.00, date: '2025-11-01', status: 'Pendiente' },
];


const AdminPaymentsPage = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Simulación de carga de datos
    useEffect(() => {
        const loadTransactions = async () => {
            try {
                setIsLoading(true);
                setError(null);
                // --- LLAMADA A LA API (SIMULADA) ---
                // const data = await getAdminTransactions();
                // setTransactions(data);
                
                // Simulación:
                await new Promise(resolve => setTimeout(resolve, 1000));
                setTransactions(mockTransactions);

            } catch (err) {
                setError(err instanceof Error ? err.message : "Error al cargar transacciones.");
            } finally {
                setIsLoading(false);
            }
        };
        loadTransactions();
    }, []);

    // --- Cálculos de KPIs (basados en los datos mock) ---
    const totalRecaudado = transactions.reduce((acc, t) => t.status === 'Pagado' ? acc + t.amount : acc, 0);
    const comisionesGanadas = transactions.reduce((acc, t) => t.status === 'Pagado' ? acc + t.commission : acc, 0);
    const tasaExito = transactions.length > 0 ? (transactions.filter(t => t.status === 'Pagado').length / transactions.length) * 100 : 100;

    const renderContent = () => {
        if (isLoading) return <LoadingSpinner />;
        if (error) return <ErrorMessage message={error} />;

        return (
            <Card className="overflow-hidden p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-secondary text-text-main">
                            <tr>
                                <th className="p-4 font-semibold">ID Transacción (Stripe)</th>
                                <th className="p-4 font-semibold">Tienda</th>
                                <th className="p-4 font-semibold">Monto Total</th>
                                <th className="p-4 font-semibold">Comisión (Nublink)</th>
                                <th className="p-4 font-semibold">Fecha</th>
                                <th className="p-4 font-semibold">Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((tx) => (
                                <tr key={tx.id} className="border-t border-line-light hover:bg-secondary-light">
                                    <td className="p-4 font-mono text-text-muted text-xs">{tx.id}</td>
                                    <td className="p-4 font-medium text-text-main">{tx.storeName}</td>
                                    <td className="p-4 text-text-muted">${tx.amount.toLocaleString('es-MX')}</td>
                                    <td className="p-4 font-medium text-green-600">${tx.commission.toLocaleString('es-MX')}</td>
                                    <td className="p-4 text-text-muted">{tx.date}</td>
                                    <td className="p-4">
                                        <StatusBadge status={tx.status} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        );
    };

    return (
        // ¡Ya no se envuelve en el Layout!
        <>
            {/* --- ¡MEJORA! Tarjetas de KPIs --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
                <StatCard 
                    title="Total Recaudado (Stripe)" 
                    value={`$${totalRecaudado.toLocaleString('es-MX', {minimumFractionDigits: 2})}`} 
                    icon={BanknotesIcon} 
                />
                <StatCard 
                    title="Comisiones Ganadas" 
                    value={`$${comisionesGanadas.toLocaleString('es-MX', {minimumFractionDigits: 2})}`} 
                    icon={CurrencyDollarIcon} 
                />
                 <StatCard 
                    title="Tasa de Transacciones Exitosas" 
                    value={`${tasaExito.toFixed(0)}%`} 
                    icon={CheckCircleIcon} 
                />
            </div>

            {/* --- Controles de la Tabla --- */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                <div className="flex gap-2">
                    {/* Placeholder para filtro de fecha */}
                    <Input id="dateFrom" label="" type="date" className="!py-1.5" />
                    <Input id="dateTo" label="" type="date" className="!py-1.5" />
                </div>
                <Button variant="secondary" disabled>
                    <ArrowDownOnSquareIcon className="w-4 h-4" />
                    Exportar Reporte
                </Button>
            </div>

            {renderContent()}
        </>
    );
};
export default AdminPaymentsPage;