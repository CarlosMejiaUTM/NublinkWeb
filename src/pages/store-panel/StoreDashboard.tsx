// FileName: StoreDashboard.tsx
// Path: src/pages/store-panel/StoreDashboard.tsx

import React, { useState, useEffect, useMemo } from "react";
import type { StoreStatsData } from "../../types";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import { getStoreDashboardData } from "../../services/api";

// 📊 Gráficos con Recharts
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

// 🧩 Iconos sólidos (versión 20)
import {
  BanknotesIcon,
  ChartPieIcon,
  ReceiptPercentIcon,
  ArchiveBoxXMarkIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowPathIcon,
} from "@heroicons/react/20/solid";

// --- Componente de carga mejorado ---
const LoadingSpinner = ({ message }: { message?: string }) => (
  <div className="flex flex-col justify-center items-center h-64">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary mb-4"></div>
    {message && (
      <p className="text-text-muted text-sm animate-pulse">{message}</p>
    )}
  </div>
);

// --- Componente de error mejorado ---
const ErrorMessage = ({ message, onRetry }: { message: string; onRetry?: () => void }) => (
  <Card className="bg-red-50 border-red-200">
    <div className="text-center">
      <p className="font-semibold text-red-700 mb-2">⚠️ Error al cargar datos</p>
      <p className="text-sm text-red-600 mb-4">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} className="bg-red-600 hover:bg-red-700">
          <ArrowPathIcon className="w-4 h-4 mr-2" />
          Intentar de nuevo
        </Button>
      )}
    </div>
  </Card>
);

// --- Tarjeta de Estadística (KPI) ---
const StatCard = ({
  title,
  value,
  icon: Icon,
  iconBgClass,
  change,
  isLoading,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  iconBgClass: string;
  change?: { value: number; period: string };
  isLoading?: boolean;
}) => (
  <Card className="shadow-md transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1">
    <div className="flex items-start justify-between">
      <div className="flex flex-col">
        <p className="text-sm font-medium text-text-muted mb-1">{title}</p>
        {isLoading ? (
          <div className="h-9 w-24 bg-gray-200 animate-pulse rounded mt-1"></div>
        ) : (
          <p className="text-3xl font-bold text-text-main mt-1">{value}</p>
        )}
      </div>
      <div className={`p-3 rounded-full ${iconBgClass}`}>
        <Icon className="w-6 h-6 text-primary" />
      </div>
    </div>
    {change && !isLoading && (
      <p
        className={`text-sm font-semibold mt-2 flex items-center gap-1 ${
          change.value >= 0 ? "text-green-500" : "text-red-500"
        }`}
      >
        {change.value >= 0 ? (
          <ArrowUpIcon className="w-4 h-4" />
        ) : (
          <ArrowDownIcon className="w-4 h-4" />
        )}
        {change.value}% vs {change.period}
      </p>
    )}
  </Card>
);

// --- Componente para mostrar info de producto o mensaje de "sin datos" ---
const ProductDataItem = ({
  label,
  product,
  valueKey,
  valueSuffix,
  isLoading,
}: {
  label: string;
  product: any;
  valueKey: string;
  valueSuffix: string;
  isLoading?: boolean;
}) => (
  <div>
    <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">
      {label}
    </p>
    {isLoading ? (
      <>
        <div className="h-5 w-32 bg-gray-200 animate-pulse rounded mb-1"></div>
        <div className="h-4 w-20 bg-gray-200 animate-pulse rounded"></div>
      </>
    ) : product ? (
      <>
        <p className="font-semibold text-text-main truncate">
          {product.productName}
        </p>
        <p className="text-text-muted">
          {product[valueKey]} {valueSuffix}
        </p>
      </>
    ) : (
      <p className="text-sm text-text-muted italic">Sin datos aún</p>
    )}
  </div>
);

const StoreDashboardPage = () => {
  const [data, setData] = useState<StoreStatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Función para cargar los datos del dashboard
  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('📊 Cargando dashboard...');
      
      const dashboardData = await getStoreDashboardData();
      console.log('✅ Dashboard cargado:', dashboardData);
      
      setData(dashboardData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error inesperado al cargar los datos.";
      console.error('❌ Error al cargar dashboard:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para reintentar la carga
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    loadData();
  };

  useEffect(() => {
    loadData();
  }, []);

  // --- 📈 Procesamos los datos de ventas para el gráfico ---
  const salesTrendData = useMemo(() => {
    if (!data || !data.last_sales || data.last_sales.length === 0) {
      return []; // ✅ Devolver array vacío en lugar de datos simulados
    }
    
    const grouped: Record<string, number> = {};

    data.last_sales.forEach((sale) => {
      const hour = new Date(sale.createdAt).getHours().toString().padStart(2, "0") + ":00";
      grouped[hour] = (grouped[hour] || 0) + parseFloat(sale.total);
    });

    return Object.entries(grouped)
      .sort(([a], [b]) => (a > b ? 1 : -1))
      .map(([hour, value]) => ({ label: hour, value }));
  }, [data]);


  // --- Render principal ---
  const renderContent = () => {
    if (error) {
      return <ErrorMessage message={error} onRetry={handleRetry} />;
    }

    return (
      <>
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatCard
            title="Ingresos Totales (Mes)"
            value={data ? `$${Number(data.total_revenue || 0).toLocaleString("es-MX", {
              minimumFractionDigits: 2,
            })}` : "$0.00"}
            icon={BanknotesIcon}
            iconBgClass="bg-green-100"
            isLoading={isLoading}
          />
          <StatCard
            title="Ventas Totales (Mes)"
            value={data ? (data.total_sales || 0).toLocaleString("es-MX") : "0"}
            icon={ChartPieIcon}
            iconBgClass="bg-blue-100"
            isLoading={isLoading}
          />
          <StatCard
            title="Ticket Promedio"
            value={data ? `$${(data.average_ticket || 0).toLocaleString("es-MX", {
              minimumFractionDigits: 2,
            })}` : "$0.00"}
            icon={ReceiptPercentIcon}
            iconBgClass="bg-purple-100"
            isLoading={isLoading}
          />
          <StatCard
            title="Productos Bajo Stock"
            value={data ? (data.low_stock || 0).toString() : "0"}
            icon={ArchiveBoxXMarkIcon}
            iconBgClass="bg-red-100"
            isLoading={isLoading}
          />
        </div>

        {/* --- Layout de dos columnas --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-6">
            <Card title="Tendencia de Ventas (Últimas horas)">
              {isLoading ? (
                <LoadingSpinner message="Cargando gráfico de ventas..." />
              ) : data && data.last_sales && data.last_sales.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip formatter={(v: number) => `$${v.toFixed(2)}`} />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#4f46e5"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center">
                  <div className="text-center">
                    <ChartPieIcon className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                    <p className="text-text-muted">
                      No hay ventas registradas aún
                    </p>
                    <p className="text-sm text-text-muted mt-1">
                      Las tendencias aparecerán cuando realices tu primera venta
                    </p>
                  </div>
                </div>
              )}
            </Card>

            <Card title="Datos de Productos">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 text-sm">
                <ProductDataItem
                  label="MÁS VENDIDO"
                  product={data?.highest_selling_product}
                  valueKey="units_sold"
                  valueSuffix="unidades"
                  isLoading={isLoading}
                />
                <ProductDataItem
                  label="MENOS VENDIDO"
                  product={data?.lowest_selling_product}
                  valueKey="units_sold"
                  valueSuffix="unidades"
                  isLoading={isLoading}
                />
                <ProductDataItem
                  label="MÁS STOCK"
                  product={data?.best_stocked_product}
                  valueKey="quantity"
                  valueSuffix="unidades"
                  isLoading={isLoading}
                />
                <ProductDataItem
                  label="MENOS STOCK"
                  product={data?.worst_stocked_product}
                  valueKey="quantity"
                  valueSuffix="unidades"
                  isLoading={isLoading}
                />
              </div>
            </Card>
          </div>

          {/* Columna lateral */}
          <div className="lg:col-span-1">
            <Card title="Últimas Ventas" paddingClass="p-0">
              <div className="flow-root max-h-[500px] overflow-y-auto">
                {isLoading ? (
                  <div className="p-8">
                    <LoadingSpinner message="Cargando ventas..." />
                  </div>
                ) : (
                  <ul role="list" className="divide-y divide-line-light">
                    {data && data.last_sales && data.last_sales.length > 0 ? (
                      data.last_sales.map((sale, index) => (
                        <li key={index} className="p-4 hover:bg-secondary transition-colors">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-green-100 rounded-full">
                              <BanknotesIcon className="w-5 h-5 text-green-600" />
                            </div>
                            <div className="min-w-0 flex-auto">
                              <p
                                className="text-sm font-semibold text-text-main truncate"
                                title={sale.productName}
                              >
                                {sale.productName}
                              </p>
                              <p className="text-xs text-text-muted">
                                Cantidad: {sale.quantity} ·{" "}
                                {new Date(sale.createdAt).toLocaleTimeString("es-MX", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                            <div className="flex-shrink-0">
                              <p className="text-sm font-semibold text-green-600">
                                +$
                                {Number(sale.total).toLocaleString("es-MX", {
                                  minimumFractionDigits: 2,
                                })}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))
                    ) : (
                      <div className="p-8 text-center">
                        <BanknotesIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm text-text-muted font-medium">
                          No hay ventas recientes
                        </p>
                        <p className="text-xs text-text-muted mt-1">
                          Las ventas aparecerán aquí en tiempo real
                        </p>
                      </div>
                    )}
                  </ul>
                )}
              </div>
            </Card>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          {retryCount > 0 && (
            <p className="text-sm text-text-muted">
              Intento {retryCount} de carga
            </p>
          )}
        </div>
      </div>
      
      {renderContent()}    
    </>
  );
};

export default StoreDashboardPage;