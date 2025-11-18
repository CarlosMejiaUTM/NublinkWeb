import React, { useEffect, useState } from "react";
import Card from "../../components/common/Card";

import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  LightBulbIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/20/solid";
import { fetchAIRecommendations, type AIRecommendation } from "../../services/api";

const StoreRecommendationsPage = () => {
  const [aiData, setAiData] = useState<AIRecommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchAIRecommendations();
        setAiData(data);
      } catch (err: any) {
        setError(err.message || "Error al obtener recomendaciones");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary mb-4"></div>
        <p className="text-gray-600 text-lg">Cargando recomendaciones de la IA...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-4">
        <Card className="text-center p-10 border-red-300 bg-red-50 max-w-lg">
          <ExclamationCircleIcon className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h3 className="text-red-600 font-bold text-xl mb-2">Error al cargar recomendaciones</h3>
          <p className="text-red-500 text-sm mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Intentar de nuevo
          </button>
        </Card>
      </div>
    );
  }

  if (!aiData) return null;

  return (
    <div className="space-y-6 p-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
        <h1 className="text-4xl font-bold mb-3">🤖 Recomendaciones de IA</h1>
        <p className="text-lg opacity-90">
          Análisis inteligente basado en tus datos de ventas reales
        </p>
      </div>

      {/* Grid de Productos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PRODUCTOS DESTACADOS */}
        <div>
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-4">
            <h2 className="text-2xl font-bold text-green-700 flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
              🌟 Productos Destacados
            </h2>
            <p className="text-green-600 text-sm mt-1">
              {aiData.top_products.length} productos con mejor rendimiento
            </p>
          </div>

          <div className="space-y-4">
            {aiData.top_products.map((product, idx) => (
              <Card
                key={idx}
                className="border-l-4 border-green-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 p-3 rounded-full flex-shrink-0">
                    <ArrowTrendingUpIcon className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-800 mb-2">
                      {product.productname}
                    </h3>
                    <div className="bg-green-50 rounded-lg p-3 mb-3">
                      <p className="text-green-700 font-semibold">
                        📦 {product.totalqty} unidades • 💰 ${Number(product.totalrevenue).toFixed(2)}
                      </p>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <p className="leading-relaxed">{product.reason_1}</p>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <p className="leading-relaxed">{product.reason_2}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* PRODUCTOS CON OPORTUNIDADES */}
        <div>
          <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 mb-4">
            <h2 className="text-2xl font-bold text-amber-700 flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse"></div>
              💡 Oportunidades de Mejora
            </h2>
            <p className="text-amber-600 text-sm mt-1">
              {aiData.low_products.length} productos con potencial de crecimiento
            </p>
          </div>

          <div className="space-y-4">
            {aiData.low_products.map((product, idx) => (
              <Card
                key={idx}
                className="border-l-4 border-amber-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-amber-100 p-3 rounded-full flex-shrink-0">
                    <ArrowTrendingDownIcon className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-800 mb-2">
                      {product.productname}
                    </h3>
                    <div className="bg-amber-50 rounded-lg p-3 mb-3">
                      <p className="text-amber-700 font-semibold">
                        📦 {product.totalqty} unidades • 💰 ${Number(product.totalrevenue).toFixed(2)}
                      </p>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex gap-2">
                        <span className="text-amber-600 font-bold">→</span>
                        <p className="leading-relaxed font-medium">{product.action_1}</p>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-amber-600 font-bold">→</span>
                        <p className="leading-relaxed font-medium">{product.action_2}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* RESUMEN EJECUTIVO */}
      {aiData.executive_summary.length > 0 && (
        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50 shadow-xl">
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 p-3 rounded-full flex-shrink-0">
              <LightBulbIcon className="w-8 h-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-blue-900 mb-4">
                📊 Resumen Ejecutivo
              </h2>
              <div className="space-y-5">
                {aiData.executive_summary.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-xl p-5 shadow-md border border-blue-100"
                  >
                    <h3 className="font-bold text-lg text-blue-800 mb-3 flex items-center gap-2">
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                        {idx + 1}
                      </span>
                      {item.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {item.summary}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default StoreRecommendationsPage;