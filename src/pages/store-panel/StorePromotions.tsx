// FileName: StorePromotionsPage.tsx
// Path: src/pages/store-panel/StorePromotionsPage.tsx

import { useEffect, useState } from "react";
import {
  SparklesIcon,
  FireIcon,
  ShoppingBagIcon,
  TagIcon,
  TrophyIcon,
  ExclamationTriangleIcon,
  BoltIcon,
  GiftIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  CheckCircleIcon,
  LightBulbIcon,
} from "@heroicons/react/20/solid";
import { fetchRawReportData, type RawData } from "../../services/api";

interface Promotion {
  id: string;
  type: 'impulse' | 'combo' | 'volume' | 'liquidation' | 'bundle' | 'clearance' | 'premium';
  title: string;
  description: string;
  discount: string;
  products: string[];
  duration: string;
  badge: string;
  icon: any;
  color: string;
  recommendation: string;
}

const StorePromotionsPage = () => {
  const [rawData, setRawData] = useState<RawData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [promotions, setPromotions] = useState<Promotion[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchRawReportData();
        console.log('✅ Datos cargados para promociones:', data);
        setRawData(data);
        generatePromotions(data);
      } catch (err: any) {
        console.error("Error al cargar datos:", err);
        setError(err.message || "Error al cargar datos");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const generatePromotions = (data: RawData) => {
    const promos: Promotion[] = [];

    // 1. PROMOCIONES PARA PRODUCTOS ESTRELLA (top_products)
    if (data.top_products && data.top_products.length > 0) {
      const topProduct = data.top_products[0];
      
      // Impulso de Ventas - Descuento ligero
      promos.push({
        id: 'impulse-1',
        type: 'impulse',
        title: 'Impulso de Ventas',
        description: `Aplica un descuento ligero a tu producto más vendido para mantener el momentum`,
        discount: '-10%',
        products: [topProduct.productName],
        duration: '7 días',
        badge: 'MÁS VENDIDO',
        icon: FireIcon,
        color: 'from-red-500 to-orange-500',
        recommendation: 'Este producto ya tiene alta rotación. Un descuento del 10% puede aumentar aún más las ventas sin afectar mucho tu margen.'
      });

      // Combo de productos estrella
      if (data.top_products.length >= 2) {
        const product1 = data.top_products[0];
        const product2 = data.top_products[1];
        
        promos.push({
          id: 'combo-1',
          type: 'combo',
          title: 'Paquete Estrella',
          description: `Combina tus dos productos más exitosos para crear valor agregado`,
          discount: '-20%',
          products: [product1.productName, product2.productName],
          duration: '14 días',
          badge: 'COMBO',
          icon: GiftIcon,
          color: 'from-blue-500 to-cyan-500',
          recommendation: 'Los clientes que compran uno de estos productos suelen estar interesados en el otro. Un combo con descuento incentiva la compra múltiple.'
        });
      }

      // Promoción de volumen
      if (data.top_products.length >= 1) {
        promos.push({
          id: 'volume-1',
          type: 'volume',
          title: 'Compra Más, Ahorra Más',
          description: `Incentiva la compra en volumen de tu producto estrella`,
          discount: '3x2',
          products: [topProduct.productName],
          duration: '10 días',
          badge: 'OFERTA ESPECIAL',
          icon: BoltIcon,
          color: 'from-purple-500 to-pink-500',
          recommendation: 'Perfecto para productos con alta demanda. Aumenta el ticket promedio y acelera la rotación de inventario.'
        });
      }
    }

    // 2. PROMOCIONES PARA PRODUCTOS DE BAJA ROTACIÓN (low_products)
    if (data.low_products && data.low_products.length > 0) {
      const lowProduct = data.low_products[0];
      
      // Liquidación agresiva
      promos.push({
        id: 'liquidation-1',
        type: 'liquidation',
        title: 'Liquidación de Inventario',
        description: `Reduce el stock de productos con baja rotación antes de que pierdan valor`,
        discount: '-25%',
        products: [lowProduct.productName],
        duration: '5 días',
        badge: 'LIQUIDACIÓN',
        icon: ExclamationTriangleIcon,
        color: 'from-orange-500 to-red-500',
        recommendation: 'Un descuento agresivo ayuda a liberar espacio y recuperar capital invertido. Es mejor vender con menor margen que mantener inventario estancado.'
      });

      // 2x1 en productos fríos
      if (data.low_products.length >= 2) {
        const product = data.low_products[1];
        promos.push({
          id: 'clearance-1',
          type: 'clearance',
          title: 'Llévate Más por Menos',
          description: `Promoción agresiva para productos que necesitan salir rápido`,
          discount: '2x1',
          products: [product.productName],
          duration: '3 días',
          badge: 'ÚLTIMA OPORTUNIDAD',
          icon: ClockIcon,
          color: 'from-amber-500 to-yellow-500',
          recommendation: 'El 2x1 crea urgencia y atrae clientes. Aunque el margen baja, es efectivo para mover inventario lento rápidamente.'
        });
      }

      // Bundle de productos de baja rotación
      if (data.low_products.length >= 2) {
        promos.push({
          id: 'bundle-1',
          type: 'bundle',
          title: 'Pack Especial',
          description: `Agrupa productos de baja rotación para hacerlos más atractivos`,
          discount: '-30%',
          products: data.low_products.slice(0, 2).map(p => p.productName),
          duration: '7 días',
          badge: 'PACK',
          icon: ShoppingBagIcon,
          color: 'from-teal-500 to-green-500',
          recommendation: 'Crear packs con productos complementarios puede darles una segunda oportunidad. El descuento en conjunto los hace más atractivos.'
        });
      }
    }

    // 3. PROMOCIÓN INTELIGENTE POR RENTABILIDAD
    const allProducts = [...(data.top_products || []), ...(data.low_products || [])];
    if (allProducts.length > 0) {
      const productsWithMargin = allProducts.map(p => ({
        ...p,
        unitRevenue: p.totalRevenue / p.totalQty
      }));
      const mostProfitable = productsWithMargin.sort((a, b) => b.unitRevenue - a.unitRevenue)[0];
      
      if (mostProfitable.unitRevenue > 300) {
        promos.push({
          id: 'premium-1',
          type: 'premium',
          title: 'Promoción Premium',
          description: `Descuento moderado en productos de alta calidad y buen margen`,
          discount: '-12%',
          products: [mostProfitable.productName],
          duration: '14 días',
          badge: 'PREMIUM',
          icon: TrophyIcon,
          color: 'from-indigo-500 to-purple-500',
          recommendation: 'Este producto tiene excelente rentabilidad por unidad. Un descuento pequeño puede atraer más compradores sin sacrificar mucho margen.'
        });
      }
    }

    setPromotions(promos);
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
          Analizando tus Productos...
        </p>
        <p className="text-gray-500 text-sm mt-2">
          Generando recomendaciones de promociones
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
          <TagIcon className="w-14 h-14 text-gray-400 mx-auto mb-4" />
          <h3 className="text-gray-700 font-semibold text-lg mb-2 text-center">Sin datos disponibles</h3>
          <p className="text-gray-500 text-center">No hay suficientes datos para generar recomendaciones</p>
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
        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
              <LightBulbIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">Recomendaciones de Promociones</h1>
              <p className="text-blue-100">Estrategias personalizadas basadas en el desempeño de tus productos</p>
            </div>
          </div>
        </div>
      </div>

      {/* ESTADÍSTICAS RÁPIDAS */}
      {rawData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-full bg-green-100">
                <TrophyIcon className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xs font-bold text-text-muted uppercase tracking-wide">Para Impulsar</span>
            </div>
            <p className="text-3xl font-bold text-text-main mt-1">{rawData.top_products?.length || 0}</p>
            <div className="flex items-center gap-2">
              <div className="h-1.5 flex-1 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full" style={{ width: '100%' }}></div>
              </div>
              <span className="text-xs text-gray-500">100%</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-full bg-orange-100">
                <ExclamationTriangleIcon className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xs font-bold text-text-muted uppercase tracking-wide">Para Liquidar</span>
            </div>
            <p className="text-3xl font-bold text-text-main mt-1">{rawData.low_products?.length || 0}</p>
            <div className="flex items-center gap-2">
              <div className="h-1.5 flex-1 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full" style={{ width: '85%' }}></div>
              </div>
              <span className="text-xs text-gray-500">85%</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-full bg-purple-100">
                <SparklesIcon className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xs font-bold text-text-muted uppercase tracking-wide">Estrategias IA</span>
            </div>
            <p className="text-3xl font-bold text-text-main mt-1">{promotions.length}</p>
            <div className="flex items-center gap-2">
              <div className="h-1.5 flex-1 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-400 to-pink-500 rounded-full" style={{ width: '95%' }}></div>
              </div>
              <span className="text-xs text-gray-500">95%</span>
            </div>
          </div>
        </div>
      )}

      {/* RECOMENDACIONES DE PROMOCIONES */}
      {promotions.length > 0 && (
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
          <div className="border-b border-gray-200 px-6 py-5 bg-gradient-to-r from-indigo-50 to-purple-50">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-100 p-2.5 rounded-full">
                <SparklesIcon className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Estrategias de Promoción Recomendadas</h2>
                <p className="text-sm text-gray-600">Basadas en el análisis de ventas y rentabilidad de tus productos</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-6">
              {promotions.map((promo, idx) => {
                const IconComponent = promo.icon;
                
                return (
                  <div key={promo.id} className="group">
                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border-2 border-gray-200 hover:border-indigo-300 transition-all hover:shadow-lg">
                      
                      {/* Header de la promoción */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4 flex-1">
                          <div className={`bg-gradient-to-br ${promo.color} p-3 rounded-xl shadow-md group-hover:scale-110 transition-transform`}>
                            <IconComponent className="w-7 h-7 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 text-xl mb-1">{promo.title}</h3>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">
                                {promo.badge}
                              </span>
                              <span className="flex items-center gap-1 text-xs text-gray-500">
                                <ClockIcon className="w-3 h-3" />
                                Duración sugerida: {promo.duration}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className={`bg-gradient-to-br ${promo.color} px-5 py-3 rounded-xl shadow-md flex-shrink-0`}>
                          <span className="text-white font-black text-2xl">{promo.discount}</span>
                        </div>
                      </div>

                      {/* Descripción */}
                      <p className="text-gray-700 mb-4 leading-relaxed text-base">
                        {promo.description}
                      </p>

                      {/* Productos incluidos */}
                      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 mb-4 border border-indigo-100">
                        <div className="flex items-center gap-2 mb-3">
                          <ShoppingBagIcon className="w-5 h-5 text-indigo-600" />
                          <p className="text-sm font-bold text-indigo-800">PRODUCTOS INCLUIDOS</p>
                        </div>
                        <div className="space-y-2">
                          {promo.products.map((product, pIdx) => (
                            <div key={pIdx} className="flex items-center gap-2">
                              <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0" />
                              <p className="text-sm text-gray-800 font-medium">{product}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Recomendación de por qué aplicar esto */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                        <div className="flex items-start gap-3">
                          <LightBulbIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-bold text-blue-800 uppercase mb-1">¿Por qué aplicar esta promoción?</p>
                            <p className="text-sm text-gray-700 leading-relaxed">{promo.recommendation}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ANÁLISIS DE PRODUCTOS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* PRODUCTOS PARA IMPULSAR */}
        {rawData.top_products && rawData.top_products.length > 0 && (
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="border-b border-gray-200 px-6 py-5 bg-gradient-to-r from-green-50 to-emerald-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2.5 rounded-full">
                    <ArrowTrendingUpIcon className="w-6 h-6 text-green-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Productos de Alto Desempeño</h2>
                </div>
                <div className="bg-green-100 px-3 py-1.5 rounded-full">
                  <span className="text-green-700 font-bold text-sm">{rawData.top_products.length}</span>
                </div>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              {rawData.top_products.map((product, idx) => (
                <div key={idx} className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200 hover:border-green-400 transition-all hover:shadow-md">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-md">
                      <span className="text-white font-bold">{idx + 1}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 flex-1">{product.productName}</h3>
                    <div className="flex items-center gap-1 bg-green-100 px-2.5 py-1 rounded-full border border-green-300">
                      <TrophyIcon className="w-4 h-4 text-green-600" />
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
        )}

        {/* PRODUCTOS PARA LIQUIDAR */}
        {rawData.low_products && rawData.low_products.length > 0 && (
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="border-b border-gray-200 px-6 py-5 bg-gradient-to-r from-orange-50 to-red-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 p-2.5 rounded-full">
                    <ExclamationTriangleIcon className="w-6 h-6 text-orange-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Productos de Baja Rotación</h2>
                </div>
                <div className="bg-orange-100 px-3 py-1.5 rounded-full">
                  <span className="text-orange-700 font-bold text-sm">{rawData.low_products.length}</span>
                </div>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              {rawData.low_products.map((product, idx) => (
                <div key={idx} className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 border-2 border-orange-200 hover:border-orange-400 transition-all hover:shadow-md">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-md">
                      <ExclamationTriangleIcon className="w-6 h-6 text-white" />
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
                    <ExclamationTriangleIcon className="w-4 h-4 text-orange-600 flex-shrink-0" />
                    <span className="font-medium">Requiere promoción agresiva</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StorePromotionsPage;