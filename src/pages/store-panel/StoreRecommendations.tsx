import { useEffect, useState } from "react";
import {
  SparklesIcon,
  TrophyIcon,
  ExclamationTriangleIcon,
  LightBulbIcon,
  RocketLaunchIcon,
  ShoppingCartIcon,
  StarIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  FireIcon,
  ChartBarIcon,
} from "@heroicons/react/20/solid";
import { fetchAIRecommendationsstats, type AIRecommendation } from "../../services/api";

const StoreRecommendationsPage = () => {
  const [aiData, setAiData] = useState<AIRecommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchAIRecommendationsstats();
        setAiData(data);
      } catch (err: any) {
        setError(err.message || "Error al obtener recomendaciones");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const cleanText = (text: string) => {
    if (!text) return '';
    return text
      .replace(/\*\*/g, '')
      .replace(/###\s*/g, '')
      .replace(/^\*\s*/gm, '')
      .replace(/^•\s*/gm, '')
      .trim();
  };

  const parseAnalysisLines = (analysis: string | string[]): string[] => {
    if (Array.isArray(analysis)) {
      return analysis
        .map(line => typeof line === 'string' ? cleanText(line) : '')
        .filter(line => line && line.length > 3 && line !== '**' && line !== '###');
    }
    
    if (typeof analysis === 'string' && analysis.trim()) {
      return analysis
        .split('\n')
        .map(line => cleanText(line))
        .filter(line => line && line.length > 3 && line !== '**' && line !== '###');
    }
    
    return [];
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[500px]">
        <div className="relative flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
          <SparklesIcon className="w-8 h-8 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="text-gray-800 text-2xl font-bold mt-6">
          Generando Recomendaciones Inteligentes...
        </p>
        <p className="text-gray-500 text-sm mt-2">
          Analizando datos de ventas para crear insights personalizados
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="bg-white border border-red-200 rounded-xl p-8 max-w-md shadow-sm">
          <ExclamationTriangleIcon className="w-14 h-14 text-red-500 mx-auto mb-4" />
          <h3 className="text-red-700 font-semibold text-lg mb-2 text-center">Error al cargar recomendaciones</h3>
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

  if (!aiData) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="bg-white border border-gray-200 rounded-xl p-8 max-w-md shadow-sm">
          <LightBulbIcon className="w-14 h-14 text-gray-400 mx-auto mb-4" />
          <h3 className="text-gray-700 font-semibold text-lg mb-2 text-center">Sin datos disponibles</h3>
          <p className="text-gray-500 text-center">No se pudo generar un análisis para tu tienda</p>
        </div>
      </div>
    );
  }

  const hasTopProducts = aiData.topProducts && aiData.topProducts.length > 0;
  const hasLowProducts = aiData.lowProducts && aiData.lowProducts.length > 0;
  const topAnalysisLines = parseAnalysisLines(aiData.aiTopProductAnalysis || []);
  const lowAnalysisLines = parseAnalysisLines(aiData.aiLowProductAnalysis || []);
  const hasSummary = aiData.aiSummary && cleanText(aiData.aiSummary).length > 10;
  const hasTopAnalysis = topAnalysisLines.length > 0;
  const hasLowAnalysis = lowAnalysisLines.length > 0;
  const hasAnyData = hasTopProducts || hasLowProducts || hasSummary || hasTopAnalysis || hasLowAnalysis;

  if (!hasAnyData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-10 max-w-lg shadow-md text-center">
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <SparklesIcon className="w-10 h-10 text-purple-600" />
          </div>
          <h3 className="text-gray-900 font-bold text-2xl mb-3">Sin datos aún</h3>
          <p className="text-gray-600 leading-relaxed mb-6">
            Aún no hay suficiente información de ventas para generar recomendaciones inteligentes. 
            Una vez que tu tienda tenga historial de ventas, aquí verás análisis detallados y consejos personalizados.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-800">
              <strong>💡 Consejo:</strong> Comienza registrando tus ventas para desbloquear insights poderosos sobre tu negocio.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const totalProducts = (aiData.topProducts?.length || 0) + (aiData.lowProducts?.length || 0);
  const totalInsights = topAnalysisLines.length + lowAnalysisLines.length;

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      
      {/* HEADER - Estilo Promocional */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-lg p-8 relative overflow-hidden">
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
                  <span className="bg-white text-indigo-600 text-xs font-bold px-3 py-1 rounded-full">
                    ANÁLISIS AI
                  </span>
                </div>
                <h1 className="text-4xl font-bold text-white mb-2">Recomendaciones Inteligentes</h1>
                <p className="text-purple-100 text-lg">Insights personalizados para maximizar tus ventas</p>
              </div>
            </div>
            <div className="hidden md:flex flex-col items-end gap-2">
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                <p className="text-white text-sm font-medium">Productos Analizados</p>
                <p className="text-white text-3xl font-bold">{totalProducts}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10">
            <TrophyIcon className="w-32 h-32" />
          </div>
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <TrophyIcon className="w-8 h-8" />
              <span className="text-xs font-bold uppercase tracking-wide">Top Sellers</span>
            </div>
            <p className="text-4xl font-bold mb-1">{aiData.topProducts?.length || 0}</p>
            <p className="text-green-100 text-sm">Productos estrella</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10">
            <RocketLaunchIcon className="w-32 h-32" />
          </div>
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <RocketLaunchIcon className="w-8 h-8" />
              <span className="text-xs font-bold uppercase tracking-wide">Oportunidades</span>
            </div>
            <p className="text-4xl font-bold mb-1">{aiData.lowProducts?.length || 0}</p>
            <p className="text-orange-100 text-sm">Para mejorar</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10">
            <LightBulbIcon className="w-32 h-32" />
          </div>
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <LightBulbIcon className="w-8 h-8" />
              <span className="text-xs font-bold uppercase tracking-wide">Insights</span>
            </div>
            <p className="text-4xl font-bold mb-1">{totalInsights}</p>
            <p className="text-purple-100 text-sm">Recomendaciones</p>
          </div>
        </div>
      </div>

      {/* DIAGNÓSTICO DE LA TIENDA */}
      {hasSummary && (
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border-b border-blue-200 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500 p-2.5 rounded-xl shadow-md">
                <LightBulbIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  Diagnóstico General
                  <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    OVERVIEW
                  </span>
                </h2>
                <p className="text-sm text-gray-600">Vista general del rendimiento de tu tienda</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
              <p className="text-gray-800 leading-relaxed text-base whitespace-pre-line">
                {cleanText(aiData.aiSummary)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCTOS ESTRELLA */}
      {hasTopProducts && (
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-5 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-full">
                  <FireIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Productos Estrella</h2>
                  <p className="text-sm text-green-100">Tus mejores vendedores - Aprovéchalos al máximo</p>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="font-bold text-sm">{aiData.topProducts.length} productos</span>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {aiData.topProducts.map((product, idx) => (
                <div key={product.id} className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border-2 border-green-300 hover:border-green-500 transition-all hover:shadow-lg relative overflow-hidden group">
                  <div className="absolute top-2 right-2">
                    <div className="flex items-center gap-1 bg-amber-400 px-3 py-1 rounded-full shadow-md">
                      <StarIcon className="w-3 h-3 text-amber-900" />
                      <span className="text-xs font-bold text-amber-900">#{idx + 1}</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md mb-3">
                      <TrophyIcon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">{product.name}</h3>
                    <p className="text-xs text-gray-500">Product ID: {product.id}</p>
                  </div>

                  <div className="bg-white rounded-xl p-4 border-2 border-green-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-600 font-semibold">Ventas Totales</span>
                      <ShoppingCartIcon className="w-4 h-4 text-green-600" />
                    </div>
                    <p className="text-3xl font-bold text-green-600">{product.total_sold}</p>
                    <p className="text-xs text-gray-500 mt-1">unidades vendidas</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ANÁLISIS PRODUCTOS ESTRELLA */}
      {hasTopAnalysis && (
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 border-b border-green-200 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="bg-green-500 p-2.5 rounded-xl shadow-md">
                <CheckCircleIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  {hasTopProducts ? 'Análisis de Éxito' : 'Factores de Éxito'}
                  <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {topAnalysisLines.length}
                  </span>
                </h2>
                <p className="text-sm text-gray-600">
                  {hasTopProducts ? 'Factores clave que impulsan tus ventas' : 'Marco teórico para productos exitosos'}
                </p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="grid gap-4">
              {topAnalysisLines.map((line, idx) => (
                <div key={idx} className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 border-2 border-green-200 hover:border-green-400 hover:shadow-md transition-all group">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-xl flex items-center justify-center text-lg font-bold shadow-md group-hover:scale-110 transition-transform">
                        {idx + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800 leading-relaxed">{line}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* OPORTUNIDADES DE MEJORA */}
      {hasLowProducts && (
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-5 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-full">
                  <RocketLaunchIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Oportunidades de Crecimiento</h2>
                  <p className="text-sm text-orange-100">Productos con potencial para mejorar</p>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="font-bold text-sm">{aiData.lowProducts.length} productos</span>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {aiData.lowProducts.map((product, idx) => (
                <div key={product.id} className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-5 border-2 border-orange-300 hover:border-orange-500 transition-all hover:shadow-lg relative overflow-hidden group">
                  <div className="absolute top-2 right-2">
                    <div className="bg-orange-500 px-3 py-1 rounded-full shadow-md">
                      <span className="text-xs font-bold text-white">MEJORAR</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-md mb-3">
                      <ExclamationTriangleIcon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">{product.name}</h3>
                    <p className="text-xs text-gray-500">Product ID: {product.id}</p>
                  </div>

                  <div className="bg-white rounded-xl p-4 border-2 border-orange-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-600 font-semibold">Ventas Totales</span>
                      <ShoppingCartIcon className="w-4 h-4 text-orange-600" />
                    </div>
                    <p className="text-3xl font-bold text-orange-600">{product.total_sold}</p>
                    <p className="text-xs text-gray-500 mt-1">unidades vendidas</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ANÁLISIS BAJO RENDIMIENTO */}
      {hasLowAnalysis && (
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-50 via-red-50 to-orange-50 border-b border-orange-200 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="bg-orange-500 p-2.5 rounded-xl shadow-md">
                <ArrowRightIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  {hasLowProducts ? 'Plan de Acción' : 'Diagnóstico Común'}
                  <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {lowAnalysisLines.length}
                  </span>
                </h2>
                <p className="text-sm text-gray-600">
                  {hasLowProducts ? 'Estrategias para impulsar el rendimiento' : 'Causas comunes de bajo rendimiento'}
                </p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="grid gap-4">
              {lowAnalysisLines.map((line, idx) => (
                <div key={idx} className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-5 border-2 border-orange-200 hover:border-orange-400 hover:shadow-md transition-all group">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-xl flex items-center justify-center text-lg font-bold shadow-md group-hover:scale-110 transition-transform">
                        {idx + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800 leading-relaxed">{line}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default StoreRecommendationsPage;