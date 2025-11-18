// FileName: ProtectedPromotionsRoute.tsx
// Path: src/components/routes/ProtectedPromotionsRoute.tsx

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LockClosedIcon, 
  SparklesIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  TagIcon,
  GiftIcon,
  BoltIcon,
  ShoppingBagIcon
} from '@heroicons/react/20/solid';
import Button from '@/components/common/Button';

interface ProtectedPromotionsRouteProps {
  children: React.ReactNode;
}

const LoadingScreen = () => (
  <div className="flex flex-col justify-center items-center min-h-[500px]">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary mb-4"></div>
    <p className="text-text-muted text-sm animate-pulse">Verificando permisos...</p>
  </div>
);

const UpgradePlanScreen = () => {
  const navigate = useNavigate();
  
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-purple-100 mb-6 relative">
          <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping"></div>
          <LockClosedIcon className="w-12 h-12 text-primary relative z-10" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-text-main mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Promociones AI Premium
        </h1>
        <p className="text-text-muted text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          Desbloquea estrategias de marketing personalizadas generadas por IA para maximizar tus ventas
        </p>
      </div>

      {/* Beneficios Premium */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-8 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
            <SparklesIcon className="w-6 h-6 text-primary" />
          </div>
          <h4 className="text-2xl font-bold text-gray-900">
            ¿Qué obtendrás con Promociones AI Premium?
          </h4>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur rounded-xl p-5 border border-blue-100 hover:border-primary transition-colors">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <TagIcon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-bold text-gray-900 mb-1">Estrategias de Descuento Inteligentes</p>
                <p className="text-sm text-gray-600">
                  Recibe recomendaciones personalizadas de descuentos para productos estrella y de baja rotación
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur rounded-xl p-5 border border-blue-100 hover:border-primary transition-colors">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <GiftIcon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-bold text-gray-900 mb-1">Combos y Paquetes Optimizados</p>
                <p className="text-sm text-gray-600">
                  La IA sugiere combinaciones de productos que maximizan el ticket promedio y la satisfacción del cliente
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur rounded-xl p-5 border border-blue-100 hover:border-primary transition-colors">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <BoltIcon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-bold text-gray-900 mb-1">Promociones por Volumen</p>
                <p className="text-sm text-gray-600">
                  Genera ofertas 2x1, 3x2 y descuentos por cantidad que aceleran la rotación de inventario
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur rounded-xl p-5 border border-blue-100 hover:border-primary transition-colors">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <ShoppingBagIcon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-bold text-gray-900 mb-1">Estrategias de Liquidación</p>
                <p className="text-sm text-gray-600">
                  Recomendaciones basadas en rentabilidad para liquidar productos de baja rotación sin afectar márgenes
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de características premium */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <p className="text-sm font-semibold text-gray-700 mb-4">Con el Plan Premium también obtienes:</p>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-sm text-gray-700">Análisis de productos alto/bajo desempeño</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-sm text-gray-700">Duración óptima de promociones</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-sm text-gray-700">Insights sobre rentabilidad por producto</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-sm text-gray-700">Recomendaciones de paquetes premium</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-sm text-gray-700">Estrategias de impulso de ventas</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-sm text-gray-700">Explicaciones de por qué aplicar cada estrategia</span>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Principal */}
      <div className="bg-gradient-to-br from-primary/5 via-purple-50 to-indigo-50 rounded-2xl p-8 border-2 border-primary text-center">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Actualiza a Premium por solo <span className="text-primary">$500 MXN/mes</span>
          </h3>
          <p className="text-gray-600 mb-6">
            Solo <span className="font-semibold">+$300 adicionales</span> a tu plan básico actual
          </p>
         <div className="flex justify-center mt-6">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-primary to-purple-600 text-white hover:shadow-xl transform hover:scale-[1.02] transition-all px-10 py-3 rounded-xl flex items-center gap-2"
              onClick={() => navigate('/tienda/mejorar-plan')}
            >
              <SparklesIcon className="w-5 h-5" />
              Ver Detalles y Mejorar Plan
              <ArrowRightIcon className="w-5 h-5" />
            </Button>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            Sin compromiso • Cancela cuando quieras • Acceso inmediato
          </p>
        </div>
      </div>
    </div>
  );
};

const ProtectedPromotionsRoute = ({ children }: ProtectedPromotionsRouteProps) => {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        console.log('🚀 Verificando acceso a Promociones AI desde API...');
        
        const { fetchWithAuth } = await import('@/services/api/helpers');
        
        const result = await fetchWithAuth('/web/stores/mine/subscription', {
          method: 'GET'
        });
        
        console.log('📦 Respuesta de suscripción (Promociones):', result);
        
        if (!result?.data) {
          console.warn('⚠️ No hay datos de suscripción');
          setHasAccess(false);
          setIsLoading(false);
          return;
        }
        
        const subscription = result.data;
        const plan = subscription.plan || subscription.plan_name || '';
        const status = subscription.status || '';
        
        console.log('📋 Plan (Promociones):', plan);
        console.log('📋 Status (Promociones):', status);
        
        const planLower = plan.toLowerCase();
        const isPremium = planLower === 'premium' || 
                         planLower.includes('premium') || 
                         planLower.includes('ia');
        
        const isActive = status.toLowerCase() === 'active' || 
                        status.toLowerCase() === 'activo';
        
        const hasAccess = isPremium && isActive;
        
        console.log('✅ isPremium (Promociones):', isPremium);
        console.log('✅ isActive (Promociones):', isActive);
        console.log('🎯 ACCESO FINAL A PROMOCIONES AI:', hasAccess);
        
        setHasAccess(hasAccess);
        
      } catch (error) {
        console.error('❌ Error al verificar acceso a Promociones AI:', error);
        setHasAccess(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAccess();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!hasAccess) {
    return <UpgradePlanScreen />;
  }

  return <>{children}</>;
};

export default ProtectedPromotionsRoute;