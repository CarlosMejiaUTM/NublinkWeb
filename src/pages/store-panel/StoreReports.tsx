import { useEffect, useState } from "react";
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  ChartPieIcon,
  ShoppingCartIcon,
  SparklesIcon,
  TrophyIcon,
  ArrowTrendingDownIcon,
  CalendarIcon,
  TagIcon,
  FireIcon,
  CubeIcon,
} from "@heroicons/react/20/solid";
import { fetchRawReportData, type RawData } from "../../services/api";

const StoreReportsPage = () => {
  const [rawData, setRawData] = useState<RawData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchRawReportData();
        setRawData(data);
      } catch (err: any) {
        setError(err.message || "Error al cargar reportes");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Calcular totales por tipo de venta
  const getSalesByType = () => {
    if (!rawData) return [];
    
    const apartadoTotal = rawData.apartado.reduce((sum, item) => {
      const total = typeof item.total === 'number' ? item.total : parseFloat(String(item.total || 0));
      return sum + total;
    }, 0);
    
    const fullTotal = rawData.full.reduce((sum, item) => {
      const total = typeof item.total === 'number' ? item.total : parseFloat(String(item.total || 0));
      return sum + total;
    }, 0);
    
    const fisicoTotal = rawData.fisico.reduce((sum, item) => {
      const total = typeof item.total === 'number' ? item.total : parseFloat(String(item.total || 0));
      return sum + total;
    }, 0);

    return [
      { name: 'Apartado', value: apartadoTotal, count: rawData.apartado.length },
      { name: 'Full', value: fullTotal, count: rawData.full.length },
      { name: 'Físico', value: fisicoTotal, count: rawData.fisico.length },
    ].filter(item => item.value > 0 || item.count > 0);
  };

  // Colores para gráficas
  const colors = [
    { bg: '#f59e0b', light: '#fde68a' }, // amber
    { bg: '#10b981', light: '#6ee7b7' }, // green
    { bg: '#3b82f6', light: '#93c5fd' }, // blue
  ];

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[500px]">
        <div className="relative flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
          <SparklesIcon className="w-8 h-8 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="text-gray-800 text-2xl font-bold mt-6">
          Generando Reportes...
        </p>
        <p className="text-gray-500 text-sm mt-2">
          Analizando datos de ventas del periodo
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="bg-white border border-red-200 rounded-xl p-8 max-w-md shadow-sm">
          <ExclamationTriangleIcon className="w-14 h-14 text-red-500 mx-auto mb-4" />
          <h3 className="text-red-700 font-semibold text-lg mb-2 text-center">Error al cargar reportes</h3>
          <p className="text-gray-600 text-center mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!rawData) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="bg-white border border-gray-200 rounded-xl p-8 max-w-md shadow-sm">
          <ChartBarIcon className="w-14 h-14 text-gray-400 mx-auto mb-4" />
          <h3 className="text-gray-700 font-semibold text-lg mb-2 text-center">Sin datos disponibles</h3>
          <p className="text-gray-500 text-center">No hay información para mostrar</p>
        </div>
      </div>
    );
  }

  const salesByType = getSalesByType();
  const totalRevenue = salesByType.reduce((sum, item) => sum + item.value, 0);
  const topSales = Array.isArray(rawData.top_sales) ? rawData.top_sales : [];
  const lowestSales = Array.isArray(rawData.top_lowest_sales) ? rawData.top_lowest_sales : [];

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      
      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl shadow-lg p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full -ml-32 -mb-32"></div>
        <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-white opacity-5 rounded-full"></div>
        
        <div className="relative">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                <ChartBarIcon className="w-10 h-10 text-white animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-white text-blue-600 text-xs font-bold px-3 py-1 rounded-full">
                    DASHBOARD
                  </span>
                </div>
                <h1 className="text-4xl font-bold text-white mb-2">Reportes de Ventas</h1>
                <p className="text-blue-100 text-lg">Análisis completo de tu tienda</p>
              </div>
            </div>
            
            {rawData.month_range && (
              <div className="hidden md:block bg-white/20 backdrop-blur-sm px-4 py-3 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <CalendarIcon className="w-4 h-4 text-white" />
                  <span className="text-white text-xs font-semibold">Periodo</span>
                </div>
                <p className="text-white font-bold">{rawData.month_range.from} - {rawData.month_range.to}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10">
            <CurrencyDollarIcon className="w-32 h-32" />
          </div>
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <CurrencyDollarIcon className="w-8 h-8" />
              <span className="text-xs font-bold uppercase tracking-wide">Ingresos</span>
            </div>
            <p className="text-4xl font-bold mb-1">
              ${(rawData.total_sales || totalRevenue).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-green-100 text-sm">Total generado en el periodo</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10">
            <ShoppingCartIcon className="w-32 h-32" />
          </div>
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <ShoppingCartIcon className="w-8 h-8" />
              <span className="text-xs font-bold uppercase tracking-wide">Productos</span>
            </div>
            <p className="text-4xl font-bold mb-1">{rawData.total_products_sales || 0}</p>
            <p className="text-blue-100 text-sm">Unidades vendidas</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10">
            <ChartPieIcon className="w-32 h-32" />
          </div>
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <ChartPieIcon className="w-8 h-8" />
              <span className="text-xs font-bold uppercase tracking-wide">Ticket Medio</span>
            </div>
            <p className="text-4xl font-bold mb-1">
              ${rawData.average_ticket?.toFixed(2) || (totalRevenue / (rawData.total_products_sales || 1)).toFixed(2)}
            </p>
            <p className="text-purple-100 text-sm">Por venta</p>
          </div>
        </div>
      </div>

      {/* Gráfica Circular - Ventas por Tipo */}
      {salesByType.length > 0 && (
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-indigo-100 p-2.5 rounded-full">
              <ChartPieIcon className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Distribución por Tipo de Venta</h2>
              <p className="text-sm text-gray-600">Análisis de canales de venta</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Gráfica circular */}
            <div className="flex justify-center">
              <div className="relative w-72 h-72">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {salesByType.map((item, index) => {
                    const percentage = (item.value / totalRevenue) * 100;
                    const circumference = 2 * Math.PI * 40;
                    const offset = salesByType.slice(0, index).reduce((sum, dataItem) => {
                      return sum + ((dataItem.value / totalRevenue) * circumference);
                    }, 0);
                    
                    const color = colors[index % colors.length];
                    
                    return (
                      <circle
                        key={item.name}
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke={color.bg}
                        strokeWidth="20"
                        strokeDasharray={`${(percentage / 100) * circumference} ${circumference}`}
                        strokeDashoffset={-offset}
                        className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                      />
                    );
                  })}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-3xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</p>
                  <p className="text-xs text-gray-500 mt-1">Total</p>
                </div>
              </div>
            </div>

            {/* Leyenda */}
            <div className="space-y-3">
              {salesByType.map((item, index) => {
                const percentage = ((item.value / totalRevenue) * 100).toFixed(1);
                const color = colors[index % colors.length];
                
                return (
                  <div 
                    key={item.name} 
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:shadow-md transition-all cursor-pointer border border-gray-200"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div 
                        className="w-5 h-5 rounded-full flex-shrink-0 ring-2 ring-white shadow-md" 
                        style={{ backgroundColor: color.bg }}
                      ></div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-800">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.count} transacciones</p>
                      </div>
                    </div>
                    <div className="text-right ml-4 flex-shrink-0">
                      <p className="text-lg font-bold text-gray-900">${item.value.toFixed(2)}</p>
                      <p className="text-xs font-semibold text-indigo-600">{percentage}%</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Top Productos */}
      {topSales.length > 0 && (
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-5 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-full">
                  <FireIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Productos Más Vendidos</h2>
                  <p className="text-sm text-green-100">Los líderes del periodo</p>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="font-bold text-sm">{topSales.length} productos</span>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topSales.map((product, idx) => (
                <div key={product.id} className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border-2 border-green-300 hover:border-green-500 transition-all hover:shadow-lg relative overflow-hidden group">
                  <div className="absolute top-2 right-2">
                    <div className="flex items-center gap-1 bg-amber-400 px-3 py-1 rounded-full shadow-md">
                      <TrophyIcon className="w-3 h-3 text-amber-900" />
                      <span className="text-xs font-bold text-amber-900">#{idx + 1}</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md mb-3">
                      <CubeIcon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">{product.name}</h3>
                    <p className="text-xs text-gray-500">ID: {product.id}</p>
                  </div>

                  <div className="bg-white rounded-xl p-4 border-2 border-green-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-600 font-semibold">Total Vendido</span>
                      <ShoppingCartIcon className="w-4 h-4 text-green-600" />
                    </div>
                    <p className="text-3xl font-bold text-green-600">{product.total_sold}</p>
                    <p className="text-xs text-gray-500 mt-1">unidades</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Productos con Menor Venta */}
      {lowestSales.length > 0 && (
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-5 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-full">
                  <ArrowTrendingDownIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Productos de Menor Venta</h2>
                  <p className="text-sm text-orange-100">Oportunidades de mejora</p>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="font-bold text-sm">{lowestSales.length} productos</span>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lowestSales.map((product, idx) => (
                <div key={product.id} className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-5 border-2 border-orange-300 hover:border-orange-500 transition-all hover:shadow-lg relative overflow-hidden group">
                  <div className="absolute top-2 right-2">
                    <div className="bg-orange-500 px-3 py-1 rounded-full shadow-md">
                      <span className="text-xs font-bold text-white">ATENCIÓN</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-md mb-3">
                      <ExclamationTriangleIcon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">{product.name}</h3>
                    <p className="text-xs text-gray-500">ID: {product.id}</p>
                  </div>

                  <div className="bg-white rounded-xl p-4 border-2 border-orange-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-600 font-semibold">Total Vendido</span>
                      <ShoppingCartIcon className="w-4 h-4 text-orange-600" />
                    </div>
                    <p className="text-3xl font-bold text-orange-600">{product.total_sold}</p>
                    <p className="text-xs text-gray-500 mt-1">unidades</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Detalle de Ventas por Tipo */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50 border-b border-indigo-200 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-500 p-2.5 rounded-xl shadow-md">
              <TagIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                Detalle por Canal de Venta
                <span className="bg-indigo-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {(rawData.apartado.length + rawData.full.length + rawData.fisico.length)}
                </span>
              </h2>
              <p className="text-sm text-gray-600">Transacciones registradas por tipo</p>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Apartado */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5 border-2 border-amber-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Apartado</h3>
                <span className="bg-amber-500 text-white px-3 py-1 rounded-full font-bold text-sm">
                  {rawData.apartado.length}
                </span>
              </div>
              {rawData.apartado.length > 0 ? (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {rawData.apartado.map((item, idx) => (
                    <div key={idx} className="bg-white rounded-lg p-3 border border-amber-200 hover:border-amber-400 transition-colors">
                      <p className="text-sm font-semibold text-gray-900 mb-1">{item.product_name}</p>
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>{item.quantity} unidades</span>
                        <span className="font-bold text-amber-700">${(typeof item.total === 'number' ? item.total : parseFloat(String(item.total))).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <TagIcon className="w-12 h-12 text-amber-300 mb-2" />
                  <p className="text-sm text-gray-400">Sin transacciones</p>
                </div>
              )}
            </div>

            {/* Full */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border-2 border-green-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Full</h3>
                <span className="bg-green-500 text-white px-3 py-1 rounded-full font-bold text-sm">
                  {rawData.full.length}
                </span>
              </div>
              {rawData.full.length > 0 ? (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {rawData.full.map((item, idx) => (
                    <div key={idx} className="bg-white rounded-lg p-3 border border-green-200 hover:border-green-400 transition-colors">
                      <p className="text-sm font-semibold text-gray-900 mb-1">{item.product_name}</p>
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>{item.quantity} unidades</span>
                        <span className="font-bold text-green-700">${(typeof item.total === 'number' ? item.total : parseFloat(String(item.total))).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <TagIcon className="w-12 h-12 text-green-300 mb-2" />
                  <p className="text-sm text-gray-400">Sin transacciones</p>
                </div>
              )}
            </div>

            {/* Físico */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border-2 border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Físico</h3>
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full font-bold text-sm">
                  {rawData.fisico.length}
                </span>
              </div>
              {rawData.fisico.length > 0 ? (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {rawData.fisico.map((item, idx) => (
                    <div key={idx} className="bg-white rounded-lg p-3 border border-blue-200 hover:border-blue-400 transition-colors">
                      <p className="text-sm font-semibold text-gray-900 mb-1">{item.product_name}</p>
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>{item.quantity} unidades</span>
                        <span className="font-bold text-blue-700">${(typeof item.total === 'number' ? item.total : parseFloat(String(item.total))).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <TagIcon className="w-12 h-12 text-blue-300 mb-2" />
                  <p className="text-sm text-gray-400">Sin transacciones</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default StoreReportsPage;