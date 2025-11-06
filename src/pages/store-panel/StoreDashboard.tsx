// FileName: StoreDashboard.tsx
// Path: src/pages/store-panel/StoreDashboard.tsx

import React, { useState, useEffect } from 'react';
import type { StoreStatsData, KeyMetrics } from "../../types"; 
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import { getStoreDashboardData } from '../../services/api';

// --- ¡NUEVO! Iconos Profesionales (Outline) ---
import { 
    BanknotesIcon, 
    ChartPieIcon, 
    ReceiptPercentIcon, 
    ArchiveBoxXMarkIcon,
    ArrowUpIcon,
    ArrowDownIcon,
    PlusIcon
} from '@heroicons/react/24/outline';

// --- Componente de Carga (Spinner) ---
const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
    </div>
);

// --- Componente de Error ---
const ErrorMessage = ({ message }: { message: string }) => (
    <Card className="bg-red-50 border-red-200">
        <p className="text-center font-semibold text-red-700">Error al cargar datos</p>
        <p className="text-center text-sm text-red-600 mt-2">{message}</p>
    </Card>
);

// --- ¡MEJORA! Tarjeta de Estadística (KPI) Rediseñada ---
const StatCard = ({ title, value, icon: Icon, iconBgClass, change }: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  iconBgClass: string;
  change?: { value: number, period: string }; // Opcional
}) => (
  <Card className="shadow-md transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1">
    <div className="flex items-start justify-between">
      <div className="flex flex-col">
        <p className="text-sm font-medium text-text-muted mb-1">{title}</p>
        <p className="text-3xl font-bold text-text-main mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-full ${iconBgClass}`}>
        <Icon className="w-6 h-6 text-primary" />
      </div>
    </div>
    {/* Muestra el 'change' si existe (aún no lo usamos, pero está listo) */}
    {change && (
      <p className={`text-sm font-semibold mt-2 flex items-center gap-1 ${change.value >= 0 ? 'text-green-500' : 'text-red-500'}`}>
        {change.value >= 0 ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />}
        {change.value}% vs {change.period}
      </p>
    )}
  </Card>
);

// --- Gráfico de Líneas (Simulado) ---
const LineChartPlaceholder = ({ data }: { data: { label: string; value: number }[] }) => (
  <div className="relative h-56 bg-secondary rounded-lg flex items-end justify-around p-4 border border-line-light overflow-hidden">
    {/* Fondo de líneas */}
    <div className="absolute top-0 left-0 w-full h-full p-4 space-y-8">
        <div className="border-b border-dashed border-line-light/70"></div>
        <div className="border-b border-dashed border-line-light/70"></div>
        <div className="border-b border-dashed border-line-light/70"></div>
        <div className="border-b border-dashed border-line-light/70"></div>
    </div>
    {/* Barras (Simuladas) */}
    <div className="flex justify-around w-full h-full items-end absolute bottom-0 left-0 px-4 pb-4 gap-2">
        {data.map((point, index) => (
            <div key={index} className="flex-1 flex flex-col items-center justify-end">
                <div 
                    className="w-3/4 bg-primary/30 hover:bg-primary/50 rounded-t-md transition-all" 
                    style={{ height: `${(point.value / 6000) * 100}%` }}
                    title={`${point.label}: ${point.value}`}
                ></div>
                <div className="text-xs text-text-muted mt-1">{point.label}</div>
            </div>
        ))}
    </div>
  </div>
);
// --- (Fin Componentes Internos) ---


// --- Datos Simulados (Solo para el gráfico) ---
const mockGraphData: KeyMetrics = {
    salesTrend: {
        percentChange: 12, // Este dato lo podemos sacar del real si lo calculamos
        data: [{ label: 'W1', value: 3000 }, { label: 'W2', value: 4200 }, { label: 'W3', value: 3800 }, { label: 'W4', value: 4500 }],
    },
    // (Ya no usamos topScannedProducts)
    topScannedProducts: { totalScans: 0, change: 0, products: [] } 
};
// --- Fin Datos Simulados ---


const StoreDashboardPage = () => {
  const [data, setData] = useState<StoreStatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const dashboardData = await getStoreDashboardData();
        setData(dashboardData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Un error inesperado ocurrió.");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // --- Lógica de Renderizado ---
  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }
    if (error) {
      return <ErrorMessage message={error} />;
    }
    if (data) {
      return (
        <>
          {/* Stats Cards (¡DATOS REALES!) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <StatCard 
              title="Ingresos Totales (Mes)" 
              value={`$${Number(data.total_revenue).toLocaleString('es-MX', {minimumFractionDigits: 2})}`} 
              icon={BanknotesIcon}
              iconBgClass="bg-green-100"
            />
            <StatCard 
              title="Ventas Totales (Mes)" 
              value={data.total_sales.toLocaleString('es-MX')} 
              icon={ChartPieIcon}
              iconBgClass="bg-blue-100"
            />
            <StatCard 
              title="Ticket Promedio" 
              value={`$${data.average_ticket.toLocaleString('es-MX', {minimumFractionDigits: 2})}`}
              icon={ReceiptPercentIcon}
              iconBgClass="bg-purple-100"
            />
            <StatCard 
              title="Productos Bajo Stock" 
              value={data.low_stock.toString()}
              icon={ArchiveBoxXMarkIcon}
              iconBgClass="bg-red-100"
            />
          </div>

          {/* --- ¡NUEVO LAYOUT! 2 Columnas (Gráfico + Feed) --- */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Columna Principal (Gráficos) */}
            <div className="lg:col-span-2 space-y-6">
                <Card title="Tendencia de Ventas (Gráfico Simulado)">
                  <LineChartPlaceholder data={mockGraphData.salesTrend.data} />
                </Card>
                
                <Card title="Datos de Producto (Real)">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 text-sm">
                      <div>
                          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">MÁS VENDIDO</p>
                          <p className="font-semibold text-text-main truncate">{data.highest_selling_product.productName}</p>
                          <p className="text-text-muted">{data.highest_selling_product.units_sold} unidades</p>
                      </div>
                      <div>
                          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">MENOS VENDIDO</p>
                          <p className="font-semibold text-text-main truncate">{data.lowest_selling_product.productName}</p>
                          <p className="text-text-muted">{data.lowest_selling_product.units_sold} unidad</p>
                      </div>
                       <div>
                          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">MÁS STOCK</p>
                          <p className="font-semibold text-text-main truncate">{data.best_stocked_product.productName}</p>
                          <p className="text-text-muted">{data.best_stocked_product.quantity} unidades</p>
                      </div>
                      <div>
                          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">MENOS STOCK</p>
                          <p className="font-semibold text-text-main truncate">{data.worst_stocked_product.productName}</p>
                          <p className="text-text-muted">{data.worst_stocked_product.quantity} unidades</p>
                      </div>
                  </div>
                </Card>
            </div>

            {/* Columna Lateral (Feed de Ventas) */}
            <div className="lg:col-span-1">
                <Card title="Últimas Ventas (Real)" paddingClass="p-0">
                  {/* Lista con scroll */}
                  <div className="flow-root max-h-[500px] overflow-y-auto">
                      <ul role="list" className="divide-y divide-line-light">
                          {data.last_sales.length > 0 ? data.last_sales.map((sale, index) => (
                              <li key={index} className="p-4 hover:bg-secondary transition-colors">
                                  <div className="flex items-center space-x-3">
                                      <div className="flex-shrink-0">
                                          <div className="p-2 bg-green-100 rounded-full">
                                            <svg className="w-5 h-5 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M2.25 3.75a.75.75 0 00-1.5 0v1.5c0 .414.336.75.75.75h1.5a.75.75 0 000-1.5H2.25V3.75zM2.25 8.75a.75.75 0 00-1.5 0v1.5c0 .414.336.75.75.75h1.5a.75.75 0 000-1.5H2.25V8.75zM2.25 13.75a.75.75 0 00-1.5 0v1.5c0 .414.336.75.75.75h1.5a.75.75 0 000-1.5H2.25v-1.5zM6 3.75a.75.75 0 00-1.5 0v1.5c0 .414.336.75.75.75h1.5a.75.75 0 000-1.5H6V3.75zM6 8.75a.75.75 0 00-1.5 0v1.5c0 .414.336.75.75.75h1.5a.75.75 0 000-1.5H6V8.75zM6 13.75a.75.75 0 00-1.5 0v1.5c0 .414.336.75.75.75h1.5a.75.75 0 000-1.5H6v-1.5zM9.75 3.75a.75.75 0 00-1.5 0v1.5c0 .414.336.75.75.75h1.5a.75.75 0 000-1.5h-1.5V3.75zM9.75 8.75a.75.75 0 00-1.5 0v1.5c0 .414.336.75.75.75h1.5a.75.75 0 000-1.5h-1.5V8.75zM9.75 13.75a.75.75 0 00-1.5 0v1.5c0 .414.336.75.75.75h1.5a.75.75 0 000-1.5h-1.5v-1.5zM13.5 3.75a.75.75 0 00-1.5 0v1.5c0 .414.336.75.75.75h1.5a.75.75 0 000-1.5h-1.5V3.75zM13.5 8.75a.75.75 0 00-1.5 0v1.5c0 .414.336.75.75.75h1.5a.75.75 0 000-1.5h-1.5V8.75zM13.5 13.75a.75.75 0 00-1.5 0v1.5c0 .414.336.75.75.75h1.5a.75.75 0 000-1.5h-1.5v-1.5zM17.25 3.75a.75.75 0 00-1.5 0v1.5c0 .414.336.75.75.75h1.5a.75.75 0 000-1.5h-1.5V3.75zM17.25 8.75a.75.75 0 00-1.5 0v1.5c0 .414.336.75.75.75h1.5a.75.75 0 000-1.5h-1.5V8.75zM17.25 13.75a.75.75 0 00-1.5 0v1.5c0 .414.336.75.75.75h1.5a.75.75 0 000-1.5h-1.5v-1.5z" /></svg>
                                          </div>
                                      </div>
                                      <div className="min-w-0 flex-auto">
                                          <p className="text-sm font-semibold text-text-main truncate" title={sale.productName}>{sale.productName}</p>
                                          <p className="text-xs text-text-muted">Cantidad: {sale.quantity} &middot; {new Date(sale.createdAt).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}</p>
                                      </div>
                                      <div className="flex-shrink-0">
                                          <p className="text-sm font-semibold text-green-600">+${Number(sale.total).toLocaleString('es-MX')}</p>
                                      </div>
                                  </div>
                              </li>
                          )) : (
                              <p className="p-4 text-sm text-text-muted text-center">No hay ventas registradas hoy.</p>
                          )}
                      </ul>
                  </div>
                </Card>
            </div>
          </div>
        </>
      );
    }
    
    return <p>No hay datos disponibles.</p>;
  };

  return (
    <>
      <div className="flex justify-end items-center mb-6">
        <Button>
            <PlusIcon className="w-5 h-5" />
            Añadir Producto
        </Button>
      </div>
      
      {renderContent()}
    </>
  );
};

export default StoreDashboardPage;