// FileName: StoreReports.tsx
// Path: src/pages/store-panel/StoreReports.tsx

import React, { useState, useEffect } from 'react';
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Select from "../../components/common/Select"; // <-- ¡NUEVO!

// --- ¡NUEVO! Iconos Profesionales ---
import { 
    ChartBarIcon, 
    CursorArrowRaysIcon, 
    ArrowDownTrayIcon,
    CalendarDaysIcon
} from '@heroicons/react/20/solid';
// --- Fin Iconos ---

// --- ¡NUEVO! Tipos de Reporte (Simulados) ---
interface ReportProductRank {
    id: string;
    name: string;
    value: number; // Puede ser 'unidades vendidas' o 'escaneos'
    maxValue: number; // El valor máximo del ranking para la barra de progreso
}
interface ReportData {
    salesByPeriod: { label: string, value: number }[];
    topSellingProducts: ReportProductRank[];
    topScannedProducts: ReportProductRank[];
}

// --- (Spinner y Error) ---
const LoadingSpinner = () => (<div className="flex justify-center items-center h-48"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>);
const ErrorMessage = ({ message }: { message: string }) => (<div className="p-4 text-center text-red-600 bg-red-100 rounded-lg">{message}</div>);

// --- ¡NUEVO! Gráfico de Barras (Simulado) ---
const BarChartPlaceholder = ({ data }: { data: { label: string; value: number }[] }) => (
    <div className="relative h-64 bg-secondary rounded-lg flex items-end justify-around p-4 border border-line-light overflow-hidden">
        {/* Fondo de líneas */}
        <div className="absolute top-0 left-0 w-full h-full p-4 grid grid-rows-4">
            <div className="border-b border-dashed border-line-light/70"></div>
            <div className="border-b border-dashed border-line-light/70"></div>
            <div className="border-b border-dashed border-line-light/70"></div>
            <div className="border-b border-dashed border-line-light/70"></div>
        </div>
        {/* Barras */}
        <div className="flex justify-around w-full h-full items-end absolute bottom-0 left-0 px-4 pb-4 gap-2">
            {data.map((point, index) => (
                <div key={index} className="flex-1 flex flex-col items-center justify-end">
                    <div 
                        className="w-3/5 bg-primary/30 hover:bg-primary/50 rounded-t-md transition-all" 
                        style={{ height: `${(point.value / 6000) * 100}%` }}
                        title={`${point.label}: ${point.value}`}
                    ></div>
                    <div className="text-xs text-text-muted mt-1">{point.label}</div>
                </div>
            ))}
        </div>
    </div>
);

// --- ¡NUEVO! Lista de Ranking ---
const RankingList = ({ items }: { items: ReportProductRank[] }) => (
    <div className="space-y-3">
        {items.map((item, index) => (
            <div key={item.id} className="flex items-center gap-3">
                <span className="font-semibold text-text-muted text-sm w-4">#{index + 1}</span>
                <div className="flex-1">
                    <p className="text-sm font-medium text-text-main truncate">{item.name}</p>
                    <div className="h-2 flex-1 bg-secondary rounded-full border border-line-light overflow-hidden mt-1">
                        <div 
                            className="h-full bg-primary-light rounded-full" 
                            style={{ width: `${(item.value / item.maxValue) * 100}%` }}
                        ></div>
                    </div>
                </div>
                <span className="text-sm font-semibold text-text-main w-10 text-right">{item.value}</span>
            </div>
        ))}
    </div>
);


// --- Datos Simulados (Mock Data) ---
const mockReportData: ReportData = {
    salesByPeriod: [
        { label: 'Lun', value: 1200 }, { label: 'Mar', value: 2100 },
        { label: 'Mié', value: 1800 }, { label: 'Jue', value: 3200 },
        { label: 'Vie', value: 4500 }, { label: 'Sáb', value: 5800 },
        { label: 'Dom', value: 2500 },
    ],
    topSellingProducts: [
        { id: 'p1', name: 'Martillo de Uña 16oz', value: 150, maxValue: 150 },
        { id: 'p2', name: 'Taladro Inalámbrico 20V', value: 120, maxValue: 150 },
        { id: 'p3', name: 'Caja de Clavos 1kg', value: 95, maxValue: 150 },
    ],
    topScannedProducts: [
        { id: 'p1', name: 'Martillo de Uña 16oz', value: 520, maxValue: 520 },
        { id: 'p3', name: 'Caja de Clavos 1kg', value: 480, maxValue: 520 },
        { id: 'p2', name: 'Taladro Inalámbrico 20V', value: 310, maxValue: 520 },
    ]
};

// Opciones para el filtro de fecha
const dateRangeOptions = [
    { value: '7d', label: 'Últimos 7 días' },
    { value: '30d', label: 'Últimos 30 días' },
    { value: '3m', label: 'Últimos 3 meses' },
    { value: 'all', label: 'Todo el tiempo' },
];


const StoreReportsPage = () => {
    const [reportData, setReportData] = useState<ReportData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dateRange, setDateRange] = useState('30d'); // Estado para el filtro

    // Simulación de carga de datos (depende del filtro)
    useEffect(() => {
        const loadReportData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                // --- LLAMADA A LA API (SIMULADA) ---
                // const data = await getStoreReports(dateRange);
                // setReportData(data);
                
                console.log(`Simulando carga de reportes para: ${dateRange}`);
                await new Promise(resolve => setTimeout(resolve, 1000));
                // Devolvemos los mismos datos mock sin importar el filtro (por ahora)
                setReportData(mockReportData);

            } catch (err) {
                setError(err instanceof Error ? err.message : "Error al cargar los reportes.");
            } finally {
                setIsLoading(false);
            }
        };
        loadReportData();
    }, [dateRange]); // ¡Se vuelve a cargar si 'dateRange' cambia!

    const renderContent = () => {
        if (isLoading) return <LoadingSpinner />;
        if (error) return <ErrorMessage message={error} />;
        if (!reportData) return <p className="text-center text-text-muted">No hay datos de reporte disponibles.</p>;

        return (
            <div className="space-y-6">
                {/* Gráfico Principal */}
                <Card title="Ventas por Periodo">
                     <BarChartPlaceholder data={reportData.salesByPeriod} />
                </Card>

                {/* Rankings */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card title="Ranking: Más Vendidos (Unidades)">
                        <RankingList items={reportData.topSellingProducts} />
                    </Card>
                    <Card title="Ranking: Más Escaneados (App)">
                        <RankingList items={reportData.topScannedProducts} />
                    </Card>
                </div>
            </div>
        );
    };

    return (
        // ¡Ya no se envuelve en el Layout!
        <>
            {/* --- ¡MEJORA! Barra de Controles de Reporte --- */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                {/* Filtro de Fecha */}
                <div className="w-full md:w-56">
                    <Select
                        id="dateRange"
                        label=""
                        containerClassName="mb-0"
                        className="!py-2"
                        icon={<CalendarDaysIcon />}
                        options={dateRangeOptions}
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                    />
                </div>
                
                {/* Botón de Exportar */}
                <Button variant="secondary" disabled={isLoading}>
                    <ArrowDownTrayIcon className="w-5 h-5" />
                    Exportar Reporte (PDF/Excel)
                </Button>
            </div>

            {renderContent()}
        </>
    );
};
export default StoreReportsPage;