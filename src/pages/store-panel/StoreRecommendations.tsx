// FileName: StoreRecommendationsPage.tsx
// Path: src/pages/store-panel/StoreRecommendationsPage.tsx

import { useEffect, useState } from "react";

import {
  SparklesIcon,
  FireIcon,
  RocketLaunchIcon,
  LightBulbIcon,
  TrophyIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ChartBarIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
  StarIcon,
} from "@heroicons/react/20/solid";
import { fetchAIRecommendations, type AIRecommendation } from "../../services/api";

const StoreRecommendationsPage = () => {
  const [aiData, setAiData] = useState<AIRecommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchAIRecommendations();
        setAiData(data);
      } catch (err: any) {
        console.error("Error al cargar recomendaciones:", err);
        setError(err.message || "Error al obtener recomendaciones");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const getProductName = (product: any) => product.productname || product.product_name || 'Sin nombre';
  const getQty = (product: any) => product.totalqty || product.total_quantity_sold || 0;
  const getRevenue = (product: any) => product.totalrevenue || product.total_revenue || 0;

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
          Analizando tus Recomendaciones...
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

  if (!aiData || (!aiData.top_products?.length && !aiData.low_products?.length)) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="bg-white border border-gray-200 rounded-xl p-8 max-w-md shadow-sm">
          <LightBulbIcon className="w-14 h-14 text-gray-400 mx-auto mb-4" />
          <h3 className="text-gray-700 font-semibold text-lg mb-2 text-center">Sin datos disponibles</h3>
          <p className="text-gray-500 text-center">Necesitas más ventas para generar recomendaciones</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      
      {/* HEADER */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-lg p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
        <div className="relative flex items-center gap-4">
          <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
            <SparklesIcon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Recomendaciones Inteligentes</h1>
            <p className="text-purple-100">Insights personalizados para maximizar tus ventas</p>
          </div>
        </div>
      </div>

      {/* RESUMEN EJECUTIVO */}
      {aiData.executive_summary && aiData.executive_summary.trim().length > 0 && (
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
          <div className="border-b border-gray-200 px-6 py-5 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2.5 rounded-full">
                <LightBulbIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Resumen Ejecutivo</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/50 rounded-xl p-5 border border-blue-100">
              <p className="text-gray-700 leading-relaxed text-base">
                {aiData.executive_summary}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCTOS ESTRELLA */}
      {aiData.top_products && aiData.top_products.length > 0 && (
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
          <div className="border-b border-gray-200 px-6 py-5 bg-gradient-to-r from-green-50 to-emerald-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2.5 rounded-full">
                  <TrophyIcon className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Productos Estrella</h2>
                  <p className="text-sm text-gray-600">Tus mejores aliados en ventas</p>
                </div>
              </div>
              <div className="bg-green-100 px-4 py-2 rounded-full">
                <span className="text-green-700 font-bold text-sm">{aiData.top_products.length} productos</span>
              </div>
            </div>
          </div>
          
          <div className="p-6 space-y-5">
            {aiData.top_products.map((product, idx) => (
              <div key={idx} className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border-2 border-green-200 hover:border-green-400 transition-all hover:shadow-md">
                
                {/* Header del producto */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-md">
                    <span className="text-white font-bold">{idx + 1}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 flex-1 text-lg">{getProductName(product)}</h3>
                  <div className="flex items-center gap-1 bg-gradient-to-r from-amber-100 to-yellow-100 px-3 py-1.5 rounded-full border border-amber-200">
                    <StarIcon className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-bold text-amber-700">TOP {idx + 1}</span>
                  </div>
                </div>

                {/* Métricas clave */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-2">
                      <ShoppingCartIcon className="w-4 h-4 text-green-600" />
                      <p className="text-xs text-gray-500 font-semibold">Unidades</p>
                    </div>
                    <p className="text-xl font-bold text-gray-900">{getQty(product)}</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-2">
                      <CurrencyDollarIcon className="w-4 h-4 text-green-600" />
                      <p className="text-xs text-gray-500 font-semibold">Ingresos</p>
                    </div>
                    <p className="text-xl font-bold text-gray-900">${Number(getRevenue(product)).toFixed(2)}</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-2">
                      <ChartBarIcon className="w-4 h-4 text-green-600" />
                      <p className="text-xs text-gray-500 font-semibold">Precio Prom.</p>
                    </div>
                    <p className="text-xl font-bold text-gray-900">
                      ${(Number(getRevenue(product)) / Number(getQty(product))).toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Comparación vs Global */}
                {(product.comparison_with_global_avg || product.comparison_vs_global) && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-xl p-4 mb-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <ChartBarIcon className="w-5 h-5 text-blue-600" />
                      <p className="text-xs font-bold text-blue-800 uppercase tracking-wide">Comparación Global</p>
                    </div>
                    <p className="text-sm text-blue-800 font-medium">
                      {product.comparison_with_global_avg || product.comparison_vs_global}
                    </p>
                  </div>
                )}

                {/* Por qué funciona */}
                {(product.possible_reasons || product.reason_1) && (
                  <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="bg-green-100 p-1.5 rounded-lg">
                        <CheckCircleIcon className="w-5 h-5 text-green-600" />
                      </div>
                      <p className="text-sm font-bold text-gray-800">Por qué funciona este producto</p>
                    </div>
                    <div className="space-y-2.5">
                      {product.possible_reasons && Array.isArray(product.possible_reasons) ? (
                        product.possible_reasons.map((reason, i) => (
                          <div key={i} className="flex gap-3 items-start bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3.5 border border-green-200">
                            <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-gray-800 leading-relaxed">{reason}</p>
                          </div>
                        ))
                      ) : (
                        <>
                          {product.reason_1 && (
                            <div className="flex gap-3 items-start bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3.5 border border-green-200">
                              <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                              <p className="text-sm text-gray-800 leading-relaxed">{product.reason_1}</p>
                            </div>
                          )}
                          {product.reason_2 && (
                            <div className="flex gap-3 items-start bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3.5 border border-green-200">
                              <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                              <p className="text-sm text-gray-800 leading-relaxed">{product.reason_2}</p>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* OPORTUNIDADES DE MEJORA */}
      {aiData.low_products && aiData.low_products.length > 0 && (
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
          <div className="border-b border-gray-200 px-6 py-5 bg-gradient-to-r from-orange-50 to-amber-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-orange-100 p-2.5 rounded-full">
                  <RocketLaunchIcon className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Oportunidades de Mejora</h2>
                  <p className="text-sm text-gray-600">Productos con potencial de crecimiento</p>
                </div>
              </div>
              <div className="bg-orange-100 px-4 py-2 rounded-full">
                <span className="text-orange-700 font-bold text-sm">{aiData.low_products.length} productos</span>
              </div>
            </div>
          </div>
          
          <div className="p-6 space-y-5">
            {aiData.low_products.map((product, idx) => (
              <div key={idx} className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-5 border-2 border-orange-200 hover:border-orange-400 transition-all hover:shadow-md">
                
                {/* Header del producto */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-md">
                    <ExclamationTriangleIcon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 flex-1 text-lg">{getProductName(product)}</h3>
                  <div className="bg-gradient-to-r from-orange-100 to-red-100 px-3 py-1.5 rounded-full border border-orange-200">
                    <span className="text-xs font-bold text-orange-700">ATENCIÓN</span>
                  </div>
                </div>

                {/* Métricas actuales */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-2">
                      <ShoppingCartIcon className="w-4 h-4 text-orange-600" />
                      <p className="text-xs text-gray-500 font-semibold">Unidades</p>
                    </div>
                    <p className="text-xl font-bold text-gray-900">{getQty(product)}</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-2">
                      <CurrencyDollarIcon className="w-4 h-4 text-orange-600" />
                      <p className="text-xs text-gray-500 font-semibold">Ingresos</p>
                    </div>
                    <p className="text-xl font-bold text-gray-900">${Number(getRevenue(product)).toFixed(2)}</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-2">
                      <ChartBarIcon className="w-4 h-4 text-orange-600" />
                      <p className="text-xs text-gray-500 font-semibold">Precio Prom.</p>
                    </div>
                    <p className="text-xl font-bold text-gray-900">
                      ${(Number(getRevenue(product)) / Number(getQty(product))).toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Situación actual */}
                {(product.comparison_with_global_avg || product.comparison_vs_global) && (
                  <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 rounded-xl p-4 mb-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
                      <p className="text-xs font-bold text-red-800 uppercase tracking-wide">Situación Actual</p>
                    </div>
                    <p className="text-sm text-red-800 font-medium">
                      {product.comparison_with_global_avg || product.comparison_vs_global}
                    </p>
                  </div>
                )}

                {/* Plan de acción */}
                {(product.recommended_actions || product.recommended_action_1 || product.action_1) && (
                  <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="bg-orange-100 p-1.5 rounded-lg">
                        <ArrowRightIcon className="w-5 h-5 text-orange-600" />
                      </div>
                      <p className="text-sm font-bold text-gray-800">Plan de Acción Recomendado</p>
                    </div>
                    <div className="space-y-2.5">
                      {product.recommended_actions && Array.isArray(product.recommended_actions) ? (
                        product.recommended_actions.map((action, i) => (
                          <div key={i} className="flex gap-3 items-start bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-3.5 border border-orange-200">
                            <ArrowRightIcon className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-gray-800 font-medium leading-relaxed">{action}</p>
                          </div>
                        ))
                      ) : (
                        <>
                          {(product.recommended_action_1 || product.action_1) && (
                            <div className="flex gap-3 items-start bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-3.5 border border-orange-200">
                              <ArrowRightIcon className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                              <p className="text-sm text-gray-800 font-medium leading-relaxed">
                                {product.recommended_action_1 || product.action_1}
                              </p>
                            </div>
                          )}
                          {(product.recommended_action_2 || product.action_2) && (
                            <div className="flex gap-3 items-start bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-3.5 border border-orange-200">
                              <ArrowRightIcon className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                              <p className="text-sm text-gray-800 font-medium leading-relaxed">
                                {product.recommended_action_2 || product.action_2}
                              </p>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RECOMENDACIONES GENERALES */}
      {aiData.recommendations && aiData.recommendations.trim().length > 0 && (
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
          <div className="border-b border-gray-200 px-6 py-5 bg-gradient-to-r from-indigo-50 to-purple-50">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-100 p-2.5 rounded-full">
                <LightBulbIcon className="w-6 h-6 text-indigo-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Recomendaciones Generales</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="bg-gradient-to-br from-indigo-50/50 to-purple-50/50 rounded-xl p-5 border border-indigo-100">
              <p className="text-gray-700 leading-relaxed text-base">
                {aiData.recommendations}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default StoreRecommendationsPage;