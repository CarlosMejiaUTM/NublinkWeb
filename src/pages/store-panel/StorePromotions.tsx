import { useEffect, useState } from "react";
import {
  SparklesIcon,
  ExclamationTriangleIcon,
  LightBulbIcon,
  TagIcon,
  CurrencyDollarIcon,
  EyeIcon,
  ShoppingBagIcon,
  FireIcon,
  TrophyIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/20/solid";
import { fetchPromotionsData, type PromotionsData } from "../../services/api";

const StorePromotionsPage = () => {
  const [promotionsData, setPromotionsData] = useState<PromotionsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchPromotionsData();
        setPromotionsData(data);
      } catch (err: any) {
        console.error('❌ Error loading promotions:', err);
        setError(err.message || "Error al cargar promociones");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const hasProducts = promotionsData?.products && promotionsData.products.length > 0;
  const hasPromotions = promotionsData?.promotionRecommendations && promotionsData.promotionRecommendations.length > 0;
  const hasPricing = promotionsData?.pricingSuggestions && promotionsData.pricingSuggestions.length > 0;
  const hasVisibility = promotionsData?.visibilityTips && promotionsData.visibilityTips.length > 0;

  // Calcular productos únicos y totales
  const uniqueProducts = hasProducts 
    ? Array.from(new Set(promotionsData!.products.map(p => p.product.name))).length 
    : 0;
  
  const totalRecommendations = (promotionsData?.promotionRecommendations.length || 0) +
                               (promotionsData?.pricingSuggestions.length || 0) +
                               (promotionsData?.visibilityTips.length || 0);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[500px]">
        <div className="relative flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
          <SparklesIcon className="w-8 h-8 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="text-gray-800 text-2xl font-bold mt-6">
          Generando Estrategias de Promoción...
        </p>
        <p className="text-gray-500 text-sm mt-2">
          Analizando tus productos y creando recomendaciones personalizadas
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="bg-white border border-red-200 rounded-xl p-8 max-w-md shadow-sm">
          <ExclamationTriangleIcon className="w-14 h-14 text-red-500 mx-auto mb-4" />
          <h3 className="text-red-700 font-semibold text-lg mb-2 text-center">Error al cargar promociones</h3>
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

  if (!promotionsData) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="bg-white border border-gray-200 rounded-xl p-8 max-w-md shadow-sm">
          <TagIcon className="w-14 h-14 text-gray-400 mx-auto mb-4" />
          <h3 className="text-gray-700 font-semibold text-lg mb-2 text-center">Sin promociones disponibles</h3>
          <p className="text-gray-500 text-center">No hay información para mostrar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      
      {/* HEADER - Promotional Style */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 rounded-2xl shadow-lg p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full -ml-32 -mb-32"></div>
        <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-white opacity-5 rounded-full"></div>
        
        <div className="relative">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                <FireIcon className="w-10 h-10 text-white animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
                    ¡OFERTAS INTELIGENTES!
                  </span>
                </div>
                <h1 className="text-4xl font-bold text-white mb-2">Estrategias de Promoción</h1>
                <p className="text-purple-100 text-lg">Impulsa tus ventas con recomendaciones personalizadas</p>
              </div>
            </div>
            <div className="hidden md:flex flex-col items-end gap-2">
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                <p className="text-white text-sm font-medium">Recomendaciones Generadas</p>
                <p className="text-white text-3xl font-bold">{totalRecommendations}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats - Promotional Focus */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10">
            <TagIcon className="w-32 h-32" />
          </div>
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <TagIcon className="w-8 h-8" />
              <span className="text-xs font-bold uppercase tracking-wide">Estrategias</span>
            </div>
            <p className="text-4xl font-bold mb-1">{promotionsData.promotionRecommendations.length}</p>
            <p className="text-purple-100 text-sm">Ideas de promoción</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10">
            <CurrencyDollarIcon className="w-32 h-32" />
          </div>
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <CurrencyDollarIcon className="w-8 h-8" />
              <span className="text-xs font-bold uppercase tracking-wide">Precios</span>
            </div>
            <p className="text-4xl font-bold mb-1">{promotionsData.pricingSuggestions.length}</p>
            <p className="text-green-100 text-sm">Optimizaciones de precio</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10">
            <EyeIcon className="w-32 h-32" />
          </div>
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <EyeIcon className="w-8 h-8" />
              <span className="text-xs font-bold uppercase tracking-wide">Marketing</span>
            </div>
            <p className="text-4xl font-bold mb-1">{promotionsData.visibilityTips.length}</p>
            <p className="text-blue-100 text-sm">Tips de visibilidad</p>
          </div>
        </div>
      </div>

      {/* Productos en Promoción Destacados */}
      {hasProducts && (
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-5 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-full">
                  <TrophyIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Productos para Promocionar</h2>
                  <p className="text-sm text-amber-100">Artículos ideales para ofertas especiales</p>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="font-bold text-sm">{uniqueProducts} productos únicos</span>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Agrupar productos únicos */}
              {Array.from(new Set(promotionsData.products.map(p => p.product.name))).map((productName, idx) => {
                const productItems = promotionsData.products.filter(p => p.product.name === productName);
                const firstItem = productItems[0];
                const totalQuantity = productItems.reduce((sum, item) => sum + item.quantity, 0);
                const totalPrice = productItems.reduce((sum, item) => sum + parseFloat(item.total_price), 0);
                
                return (
                  <div key={idx} className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5 border-2 border-amber-300 hover:border-amber-500 transition-all hover:shadow-lg relative overflow-hidden group">
                    <div className="absolute top-2 right-2">
                      <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                        HOT
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-md">
                        <ShoppingBagIcon className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-lg leading-tight">{productName}</h3>
                        <p className="text-xs text-gray-500">ID: {firstItem.product.id}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm">
                        <span className="text-xs text-gray-600 font-semibold">Stock Disponible</span>
                        <span className={`font-bold text-sm px-2 py-1 rounded ${
                          firstItem.product.stock > 50 ? 'bg-green-100 text-green-800' :
                          firstItem.product.stock > 20 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {firstItem.product.stock} unidades
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm">
                        <span className="text-xs text-gray-600 font-semibold">Ventas Totales</span>
                        <span className="font-bold text-purple-600">{totalQuantity} unidades</span>
                      </div>
                      
                      <div className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm">
                        <span className="text-xs text-gray-600 font-semibold">Precio Unitario</span>
                        <span className="font-bold text-gray-900">${parseFloat(firstItem.unit_price).toFixed(2)}</span>
                      </div>
                      
                      <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg p-3 shadow-md">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-white font-semibold">Ingresos Generados</span>
                          <ArrowTrendingUpIcon className="w-4 h-4 text-white" />
                        </div>
                        <p className="text-2xl font-bold text-white mt-1">${totalPrice.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Recomendaciones de Promociones */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 border-b border-purple-200 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="bg-purple-500 p-2.5 rounded-xl shadow-md">
              <TagIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                Estrategias de Promoción
                <span className="bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {promotionsData.promotionRecommendations.length}
                </span>
              </h2>
              <p className="text-sm text-gray-600">Aumenta tus ventas con estas tácticas probadas</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          {hasPromotions ? (
            <div className="grid gap-4">
              {promotionsData.promotionRecommendations.map((recommendation, idx) => (
                <div key={idx} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-5 border-2 border-purple-200 hover:border-purple-400 hover:shadow-md transition-all group">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl flex items-center justify-center text-lg font-bold shadow-md group-hover:scale-110 transition-transform">
                        {idx + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800 leading-relaxed">{recommendation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <TagIcon className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500 text-center">No hay estrategias de promoción disponibles</p>
            </div>
          )}
        </div>
      </div>

      {/* Sugerencias de Precios */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 border-b border-green-200 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="bg-green-500 p-2.5 rounded-xl shadow-md">
              <CurrencyDollarIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                Optimización de Precios
                <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {promotionsData.pricingSuggestions.length}
                </span>
              </h2>
              <p className="text-sm text-gray-600">Maximiza tus ganancias con pricing inteligente</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          {hasPricing ? (
            <div className="grid gap-4">
              {promotionsData.pricingSuggestions.map((suggestion, idx) => (
                <div key={idx} className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 border-2 border-green-200 hover:border-green-400 hover:shadow-md transition-all group">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-xl flex items-center justify-center text-lg font-bold shadow-md group-hover:scale-110 transition-transform">
                        {idx + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800 leading-relaxed">{suggestion}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <CurrencyDollarIcon className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500 text-center">No hay sugerencias de precios disponibles</p>
            </div>
          )}
        </div>
      </div>

      {/* Consejos de Visibilidad */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border-b border-blue-200 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500 p-2.5 rounded-xl shadow-md">
              <EyeIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                Marketing & Visibilidad
                <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {promotionsData.visibilityTips.length}
                </span>
              </h2>
              <p className="text-sm text-gray-600">Destaca tus productos y atrae más clientes</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          {hasVisibility ? (
            <div className="grid gap-4">
              {promotionsData.visibilityTips.map((tip, idx) => (
                <div key={idx} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border-2 border-blue-200 hover:border-blue-400 hover:shadow-md transition-all group">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 text-white rounded-xl flex items-center justify-center text-lg font-bold shadow-md group-hover:scale-110 transition-transform">
                        {idx + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800 leading-relaxed">{tip}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <EyeIcon className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500 text-center">No hay consejos de visibilidad disponibles</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default StorePromotionsPage;