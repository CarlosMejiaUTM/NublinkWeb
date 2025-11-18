// File: src/pages/store-panel/UpgradePlanPage.tsx

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  SparklesIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  ExclamationTriangleIcon,
  CalendarIcon,
  CreditCardIcon,
  ClockIcon,
  BanknotesIcon
} from '@heroicons/react/20/solid';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import ConfirmModal from '@/components/common/ConfirmModal';
import { getStoreSubscription, switchSubscriptionPlan, type Subscription } from '@/services/api/subscription';

type ModalState = 'confirm' | 'loading' | 'success' | 'error' | 'closed';

const LoadingScreen = () => {
  console.log('🔄 LoadingScreen renderizado');
  return (
    <div className="flex flex-col justify-center items-center min-h-[500px]">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary mb-4"></div>
      <p className="text-text-muted text-sm animate-pulse">Cargando información de tu plan...</p>
    </div>
  );
};

const ErrorScreen = ({ message, onRetry }: { message: string; onRetry: () => void }) => {
  console.log('❌ ErrorScreen renderizado:', message);
  return (
    <div className="max-w-2xl mx-auto text-center py-12">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-6">
        <ExclamationTriangleIcon className="w-10 h-10 text-red-600" />
      </div>
      <h2 className="text-2xl font-bold text-text-main mb-4">Error al cargar información</h2>
      <p className="text-text-muted mb-6">{message}</p>
      <Button onClick={onRetry}>Reintentar</Button>
    </div>
  );
};

const UpgradePlanPage = () => {
  console.log('🚀 UpgradePlanPage - Componente montado');
  
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [modalState, setModalState] = useState<ModalState>('closed');
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  const loadSubscription = async () => {
    try {
      console.log('📡 Iniciando carga de suscripción...');
      setIsLoading(true);
      setError(null);
      
      const data = await getStoreSubscription();
      console.log('✅ Datos de suscripción recibidos:', data);
      
      if (!data || typeof data !== 'object') {
        console.error('❌ Datos inválidos recibidos:', data);
        throw new Error('Datos de suscripción inválidos');
      }
      
      setSubscription(data);
      console.log('✅ Estado de suscripción actualizado');
    } catch (err) {
      console.error('❌ Error al cargar suscripción:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al cargar la suscripción';
      console.log('❌ Mensaje de error:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      console.log('🏁 Carga de suscripción finalizada - isLoading ahora es false');
    }
  };

  useEffect(() => {
    console.log('⚡ useEffect ejecutado - loadSubscription');
    loadSubscription();
  }, []);

  const handleUpgradePlan = async () => {
    console.log('🔄 Iniciando actualización de plan...');
    setModalState('loading');
    setModalTitle('Actualizando plan...');
    setModalMessage('Por favor espera mientras procesamos tu actualización.');

    try {
      const result = await switchSubscriptionPlan('premium');
      console.log('📦 Resultado de actualización:', result);

      if (!result || !result.ok) {
        throw new Error(result?.message || 'Error al actualizar el plan');
      }

      setModalState('success');
      setModalTitle('¡Plan actualizado!');
      setModalMessage('Tu plan ha sido actualizado exitosamente a Premium. Los cambios se verán reflejados de inmediato.');

      setTimeout(() => {
        loadSubscription();
        setModalState('closed');
        navigate('/tienda/recomendaciones');
      }, 3000);

    } catch (err) {
      console.error('❌ Error al actualizar plan:', err);
      setModalState('error');
      setModalTitle('Error al actualizar');
      setModalMessage(err instanceof Error ? err.message : 'No se pudo actualizar el plan. Por favor intenta de nuevo.');
      
      setTimeout(() => {
        setModalState('closed');
      }, 5000);
    }
  };

  const handleConfirmUpgrade = () => {
    console.log('✋ Usuario solicitó confirmar actualización');
    setModalState('confirm');
    setModalTitle('Confirmar actualización de plan');
    setModalMessage('¿Estás seguro de que deseas actualizar tu plan a Premium? Se aplicará un cargo prorrateado por el resto del período de facturación actual.');
  };

  console.log('🎨 Render - isLoading:', isLoading, 'error:', error, 'subscription:', subscription);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    console.log('🚨 Mostrando ErrorScreen por error:', error);
    return <ErrorScreen message={error} onRetry={loadSubscription} />;
  }

  if (!subscription) {
    console.log('🚨 Mostrando ErrorScreen por falta de subscription');
    return <ErrorScreen message="No se pudo cargar la información de suscripción" onRetry={loadSubscription} />;
  }

  const isPremium = subscription.plan.toLowerCase().includes('premium') || 
                    subscription.plan.toLowerCase().includes('ia');

  console.log('🔍 isPremium:', isPremium);

  if (isPremium) {
    console.log('✅ Usuario ya tiene premium - mostrando mensaje');
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-purple-100 mb-6">
          <SparklesIcon className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-3xl font-bold text-text-main mb-4">Ya tienes el Plan Premium</h2>
        <p className="text-text-muted mb-6">
          Estás disfrutando de todas las funciones premium de Nublink.
        </p>
        <Button onClick={() => navigate('/tienda/recomendaciones')}>
          <SparklesIcon className="w-5 h-5 mr-2" />
          Ir a Recomendaciones IA
        </Button>
      </div>
    );
  }

  const periodStart = new Date(subscription.current_period_start);
  const periodEnd = new Date(subscription.current_period_end);
  const today = new Date();
  const daysRemaining = Math.ceil((periodEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  // Cálculo aproximado del cargo prorrateado
  const dailyRate = 300 / 30; // $300 adicionales divididos entre 30 días
  const proratedCharge = Math.ceil(dailyRate * daysRemaining);

  console.log('🎯 Renderizando página de upgrade completa');

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Volver
        </Button>
        <h1 className="text-3xl font-bold text-text-main mb-2">
          Confirmar Actualización a Premium
        </h1>
        <p className="text-text-muted">
          Revisa los detalles de tu cambio de plan antes de confirmar
        </p>
      </div>

      {/* Plan Actual */}
      <Card className="mb-6 border-l-4 border-l-gray-400">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-text-muted mb-1">Plan Actual</p>
              <h3 className="text-xl font-bold text-text-main">Plan Básico</h3>
            </div>
            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-semibold">
              $200 MXN/mes
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-text-muted">
              <CalendarIcon className="w-4 h-4" />
              <span>Período: {periodStart.toLocaleDateString('es-MX')} - {periodEnd.toLocaleDateString('es-MX')}</span>
            </div>
            <div className="flex items-center gap-2 text-text-muted">
              <ClockIcon className="w-4 h-4" />
              <span>{daysRemaining} días restantes en el período actual</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Nuevo Plan */}
      <Card className="mb-6 border-l-4 border-l-primary">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-primary font-semibold mb-1">Nuevo Plan</p>
              <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
                <SparklesIcon className="w-6 h-6 text-primary" />
                Plan IA Premium
              </h3>
            </div>
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">
              $500 MXN/mes
            </span>
          </div>

          <div className="bg-primary/5 rounded-lg p-4">
            <p className="text-sm text-gray-700 mb-2">
              <span className="font-semibold">Incluye:</span> Todo del plan básico + funciones premium
            </p>
            <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="w-4 h-4 text-green-500" />
                <span>Recomendaciones IA</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="w-4 h-4 text-green-500" />
                <span>Análisis predictivo</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="w-4 h-4 text-green-500" />
                <span>Productos destacados</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="w-4 h-4 text-green-500" />
                <span>Soporte prioritario</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Resumen de Cargos */}
      <Card className="mb-6 bg-blue-50 border-blue-200">
        <div className="p-6">
          <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BanknotesIcon className="w-5 h-5 text-primary" />
            Resumen de Cargos
          </h4>

          <div className="space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-blue-200">
              <div>
                <p className="text-sm font-medium text-gray-900">Cargo prorrateado (hoy)</p>
                <p className="text-xs text-gray-600">Por los {daysRemaining} días restantes del período actual</p>
              </div>
              <p className="text-lg font-bold text-primary">~${proratedCharge} MXN</p>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-900">Próxima renovación</p>
                <p className="text-xs text-gray-600">{periodEnd.toLocaleDateString('es-MX')}</p>
              </div>
              <p className="text-lg font-bold text-gray-900">$500 MXN/mes</p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-blue-200">
            <p className="text-xs text-gray-600 flex items-start gap-2">
              <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
              <span>El cargo prorrateado se aplicará de inmediato. A partir del {periodEnd.toLocaleDateString('es-MX')}, se te cobrará $500 MXN cada mes.</span>
            </p>
          </div>
        </div>
      </Card>

      {/* Información Importante */}
      <Card className="mb-6">
        <div className="p-6">
          <h4 className="font-bold text-gray-900 mb-4">Información Importante</h4>
          <ul className="space-y-3 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Acceso inmediato:</span> Tendrás acceso a todas las funciones premium al instante
              </div>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Método de pago:</span> Se usará el método de pago registrado en tu cuenta
              </div>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Sin compromiso:</span> Puedes cancelar o cambiar tu plan en cualquier momento
              </div>
            </li>
          </ul>
        </div>
      </Card>

      {/* Botones de Acción */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          variant="outline"
          size="lg" 
          onClick={() => navigate(-1)}
        >
          Cancelar
        </Button>
        <Button 
          size="lg" 
          className="flex-1 bg-gradient-to-r from-primary to-purple-600 text-white"
          onClick={handleConfirmUpgrade}
          disabled={modalState === 'loading'}
        >
          <span className="flex items-center justify-center gap-2">
            <CreditCardIcon className="w-5 h-5" />
            {modalState === 'loading' ? 'Procesando...' : 'Confirmar y Actualizar'}
            <ArrowRightIcon className="w-5 h-5" />
          </span>
        </Button>
      </div>

      {/* Modal de Confirmación */}
      <ConfirmModal
        isOpen={modalState !== 'closed'}
        title={modalTitle}
        message={modalMessage}
        confirmText="Confirmar Actualización"
        cancelText="Cancelar"
        type={modalState === 'closed' ? 'confirm' : modalState}
        onConfirm={handleUpgradePlan}
        onCancel={() => setModalState('closed')}
      />
    </div>
  );
};

export default UpgradePlanPage;