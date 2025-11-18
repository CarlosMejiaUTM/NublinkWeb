// FileName: StoreReportsPage.tsx
// Path: src/pages/store-panel/StoreReportsPage.tsx

import { useEffect, useState } from "react";
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  ChartPieIcon,
  ShoppingCartIcon,
  ArrowDownTrayIcon,
  FireIcon,
  SparklesIcon,
  TrophyIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  StarIcon,
} from "@heroicons/react/20/solid";
import { fetchRawReportData, type RawData } from "../../services/api";

const StoreReportsPage = () => {
  const [rawData, setRawData] = useState<RawData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState("30d");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchRawReportData();
        console.log('✅ Datos de reportes cargados:', data);
        setRawData(data);
      } catch (err: any) {
        console.error("Error al cargar reportes:", err);
        setError(err.message || "Error al cargar reportes");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [dateRange]);

  const calculateKPIs = () => {
    if (!rawData) return null;
    const allProducts = [
      ...(rawData.top_products || []),
      ...(rawData.low_products || [])
    ];
    const totalRevenue = rawData.sales_total || 0;
    const totalProducts = allProducts.reduce((sum, item) => sum + (item.totalQty || 0), 0);
    const avgTicket = totalProducts > 0 ? totalRevenue / totalProducts : 0;
    return { totalRevenue, totalProducts, avgTicket, totalProductsInCatalog: allProducts.length };
  };

  const getAllProducts = () => {
    if (!rawData) return [];
    return [...(rawData.top_products || []), ...(rawData.low_products || [])];
  };

  const getTop5ByQty = () => {
    const allProducts = getAllProducts();
    return [...allProducts].sort((a, b) => (b.totalQty || 0) - (a.totalQty || 0)).slice(0, 5);
  };

  const getTop10ByRevenue = () => {
    const allProducts = getAllProducts();
    return [...allProducts].sort((a, b) => (b.totalRevenue || 0) - (a.totalRevenue || 0)).slice(0, 10);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[500px]">
        <div className="relative flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
          <SparklesIcon
            className="w-8 h-8 text-primary absolute top-1/2 left-1/2
                       transform -translate-x-1/2 -translate-y-1/2"
          />
        </div>
        <p className="text-gray-800 text-2xl font-bold mt-6">
          Analizando tus Reportes...
        </p>
        <p className="text-gray-500 text-sm mt-2">
          Esto puede tomar hasta 2 minutos
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="bg-white border border-red-200 rounded-xl p-8 max-w-md shadow-sm">
          <ExclamationTriangleIcon className="w-14 h-14 text-red-500 mx-auto mb-4" />
          <h3 className="text-red-700 font-semibold text-lg mb-2 text-center">Error al cargar datos</h3>
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

  if (!rawData || (!rawData.top_products?.length && !rawData.low_products?.length)) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="bg-white border border-gray-200 rounded-xl p-8 max-w-md shadow-sm">
          <ChartBarIcon className="w-14 h-14 text-gray-400 mx-auto mb-4" />
          <h3 className="text-gray-700 font-semibold text-lg mb-2 text-center">Sin datos disponibles</h3>
          <p className="text-gray-500 text-center">No hay suficientes datos para generar reportes</p>
        </div>
      </div>
    );
  }

  const kpis = calculateKPIs();
  const top5ByQty = getTop5ByQty();
  const top10Revenue = getTop10ByRevenue();
  const allProducts = getAllProducts();

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      
      {/* HEADER */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-lg p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
              <ChartBarIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">Dashboard de Reportes Inteligentes</h1>
              <p className="text-blue-100">Análisis de ventas y productos predecidos por AI</p>
            </div>
          </div>
          
          <button className="px-5 py-2.5 bg-white/20 backdrop-blur-sm text-white rounded-xl font-medium hover:bg-white/30 transition-all flex items-center gap-2 border border-white/30">
            <ArrowDownTrayIcon className="w-5 h-5" />
            Exportar
          </button>
        </div>
      </div>
 
      {/* KPIS */}
      {kpis && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">
      
              <div className="p-3 rounded-full bg-green-100">
                <CurrencyDollarIcon className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xs font-bold text-text-muted uppercase tracking-wide">Ingresos Totales</span>
            </div>
            <p className="text-3xl font-bold text-text-main mt-1">${kpis.totalRevenue.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <div className="flex items-center gap-2">
              <div className="h-1.5 flex-1 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full" style={{ width: '100%' }}></div>
              </div>
              <span className="text-xs text-gray-500">100%</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-full bg-blue-100">
                <ShoppingCartIcon className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xs font-bold text-text-muted uppercase tracking-wide">Unidades Vendidas</span>
            </div>
            <p className="text-3xl font-bold text-text-main mt-1">{kpis.totalProducts.toLocaleString('es-MX')}</p>
            <div className="flex items-center gap-2">
              <div className="h-1.5 flex-1 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full" style={{ width: '85%' }}></div>
              </div>
              <span className="text-xs text-gray-500">85%</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">

              <div className="p-3 rounded-full bg-purple-100">
                <ChartPieIcon className="w-6 h-6 text-primary" />
              </div>
              
              <span className="text-xs font-bold text-text-muted uppercase tracking-wide">Ticket Promedio</span>
            </div>
            <p className="text-3xl font-bold text-text-main mt-1">${kpis.avgTicket.toFixed(2)}</p>
            <div className="flex items-center gap-2">
              <div className="h-1.5 flex-1 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-400 to-pink-500 rounded-full" style={{ width: '70%' }}></div>
              </div>
              <span className="text-xs text-gray-500">70%</span>
            </div>
          </div>
        </div>
      )}

      {/* GRÁFICA DE BARRAS - TOP 5 POR VENTAS */}
      {top5ByQty.length > 0 && (
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
          <div className="border-b border-gray-200 px-6 py-5 bg-gradient-to-r from-indigo-50 to-purple-50">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-100 p-2.5 rounded-full">
                <ChartBarIcon className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Top 5 Productos por Ventas</h2>
                <p className="text-sm text-gray-600">Los más vendidos del periodo</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-5">
              {top5ByQty.map((product, idx) => {
                const maxQty = Math.max(...top5ByQty.map(p => p.totalQty || 0));
                const percentage = maxQty > 0 ? ((product.totalQty || 0) / maxQty) * 100 : 0;
                
                return (
                  <div key={idx} className="group">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold shadow-md group-hover:scale-110 transition-transform">
                          {idx + 1}
                        </span>
                        <span className="font-semibold text-gray-900 text-base">{product.productName}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-base font-bold text-gray-900">{product.totalQty} unidades</p>
                        <p className="text-xs text-gray-500">${product.totalRevenue.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="h-3 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full overflow-hidden shadow-inner">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-700 shadow-md"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* GRÁFICA CIRCULAR - DISTRIBUCIÓN DE INGRESOS */}
      {allProducts.length > 0 && (
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
          <div className="border-b border-gray-200 px-6 py-5 bg-gradient-to-r from-emerald-50 to-teal-50">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-100 p-2.5 rounded-full">
                <ChartPieIcon className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Distribución de Ingresos</h2>
                <p className="text-sm text-gray-600">Participación por producto</p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Gráfica Circular Visual */}
              <div className="flex items-center justify-center">
                <div className="relative w-64 h-64">
                  {/* Círculo base */}
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {allProducts.slice(0, 5).map((product, idx) => {
                      const totalRevenue = allProducts.reduce((sum, p) => sum + (p.totalRevenue || 0), 0);
                      const percentage = totalRevenue > 0 ? ((product.totalRevenue || 0) / totalRevenue) * 100 : 0;
                      const colors = [
                        'stroke-emerald-500',
                        'stroke-teal-500',
                        'stroke-cyan-500',
                        'stroke-blue-500',
                        'stroke-indigo-500'
                      ];
                      
                      // Calcular el offset acumulado
                      const prevPercentages = allProducts.slice(0, idx).reduce((sum, p) => {
                        const pct = totalRevenue > 0 ? ((p.totalRevenue || 0) / totalRevenue) * 100 : 0;
                        return sum + pct;
                      }, 0);
                      
                      const circumference = 2 * Math.PI * 40;
                      const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
                      const strokeDashoffset = -((prevPercentages / 100) * circumference);
                      
                      return (
                        <circle
                          key={idx}
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          className={`${colors[idx]} transition-all duration-700`}
                          strokeWidth="12"
                          strokeDasharray={strokeDasharray}
                          strokeDashoffset={strokeDashoffset}
                          strokeLinecap="round"
                        />
                      );
                    })}
                  </svg>
                  
                  {/* Centro del círculo */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center bg-white rounded-full w-28 h-28 flex flex-col items-center justify-center shadow-lg border-4 border-gray-100">
                      <p className="text-2xl font-black text-gray-900">{allProducts.length}</p>
                      <p className="text-xs text-gray-500 font-semibold">Productos</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lista de productos */}
              <div className="space-y-3">
                {allProducts.slice(0, 5).map((product, idx) => {
                  const totalRevenue = allProducts.reduce((sum, p) => sum + (p.totalRevenue || 0), 0);
                  const percentage = totalRevenue > 0 ? ((product.totalRevenue || 0) / totalRevenue) * 100 : 0;
                  const colors = [
                    'bg-emerald-500',
                    'bg-teal-500',
                    'bg-cyan-500',
                    'bg-blue-500',
                    'bg-indigo-500'
                  ];
                  
                  return (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                      <div className={`w-4 h-4 rounded-full ${colors[idx]} shadow-md`}></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{product.productName}</p>
                        <p className="text-xs text-gray-500">{percentage.toFixed(1)}% del total</p>
                      </div>
                      <p className="text-sm font-bold text-gray-900">${product.totalRevenue.toFixed(2)}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCTOS DESTACADOS Y OPORTUNIDADES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* PRODUCTOS DESTACADOS */}
        {rawData.top_products && rawData.top_products.length > 0 && (
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="border-b border-gray-200 px-6 py-5 bg-gradient-to-r from-amber-50 to-yellow-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-100 p-2.5 rounded-full">
                    <TrophyIcon className="w-6 h-6 text-amber-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Productos Destacados</h2>
                </div>
                <div className="bg-amber-100 px-3 py-1.5 rounded-full">
                  <span className="text-amber-700 font-bold text-sm">{rawData.top_products.length}</span>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {rawData.top_products.map((product, idx) => (
                  <div key={idx} className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-4 border-2 border-amber-200 hover:border-amber-400 transition-all hover:shadow-md">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 shadow-md">
                        <span className="text-white font-bold">{idx + 1}</span>
                      </div>
                      <h3 className="font-bold text-gray-900 flex-1">{product.productName}</h3>
                      <div className="flex items-center gap-1 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-300">
                        <StarIcon className="w-4 h-4 text-amber-600" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                        <p className="text-xs text-gray-500 font-semibold mb-1">Unidades</p>
                        <p className="text-xl font-bold text-gray-900">{product.totalQty}</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                        <p className="text-xs text-gray-500 font-semibold mb-1">Ingresos</p>
                        <p className="text-xl font-bold text-gray-900">${product.totalRevenue.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* OPORTUNIDADES */}
        {rawData.low_products && rawData.low_products.length > 0 && (
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="border-b border-gray-200 px-6 py-5 bg-gradient-to-r from-orange-50 to-red-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 p-2.5 rounded-full">
                    <ArrowTrendingUpIcon className="w-6 h-6 text-orange-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Oportunidades</h2>
                </div>
                <div className="bg-orange-100 px-3 py-1.5 rounded-full">
                  <span className="text-orange-700 font-bold text-sm">{rawData.low_products.length}</span>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {rawData.low_products.map((product, idx) => (
                  <div key={idx} className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 border-2 border-orange-200 hover:border-orange-400 transition-all hover:shadow-md">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-md">
                        <ArrowTrendingUpIcon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-bold text-gray-900 flex-1">{product.productName}</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                        <p className="text-xs text-gray-500 font-semibold mb-1">Unidades</p>
                        <p className="text-xl font-bold text-gray-900">{product.totalQty}</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                        <p className="text-xs text-gray-500 font-semibold mb-1">Ingresos</p>
                        <p className="text-xl font-bold text-gray-900">${product.totalRevenue.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-xs text-orange-700 bg-white rounded-lg p-2 border border-orange-200">
                      <ArrowTrendingDownIcon className="w-4 h-4 text-orange-600 flex-shrink-0" />
                      <span className="font-medium">Producto con potencial de mejora</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* RANKING POR INGRESOS - ESTILO LISTA */}
      {top10Revenue.length > 0 && (
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
          <div className="border-b border-gray-200 px-6 py-5 bg-gradient-to-r from-violet-50 to-purple-50">
            <div className="flex items-center gap-3">
              <div className="bg-violet-100 p-2.5 rounded-xl">
                <FireIcon className="w-6 h-6 text-violet-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Ranking por Ingresos</h2>
                <p className="text-sm text-gray-600">Top 10 productos más rentables</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {top10Revenue.map((product, idx) => {
                const maxRevenue = Math.max(...top10Revenue.map(p => p.totalRevenue || 0));
                const percentage = maxRevenue > 0 ? ((product.totalRevenue || 0) / maxRevenue) * 100 : 0;
                
                return (
                  <div key={idx} className="group">
                    <div className="flex items-center gap-4 bg-gradient-to-r from-gray-50 to-violet-50 p-4 rounded-xl border border-gray-200 hover:border-violet-300 transition-all hover:shadow-md">
                      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-md flex-shrink-0 group-hover:scale-110 transition-transform">
                        <span className="text-white font-bold text-lg">{idx + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 truncate mb-1">{product.productName}</h3>
                        <div className="flex items-center gap-3">
                          <p className="text-sm text-gray-600">{product.totalQty} unidades</p>
                          <div className="h-1 flex-1 bg-gray-200 rounded-full overflow-hidden max-w-[200px]">
                            <div 
                              className="h-full bg-gradient-to-r from-violet-400 to-purple-500 rounded-full transition-all duration-700"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-text-main mt-1">${product.totalRevenue.toFixed(2)}</p>
                        <p className="text-xs text-gray-500 font-semibold">ingresos</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreReportsPage;