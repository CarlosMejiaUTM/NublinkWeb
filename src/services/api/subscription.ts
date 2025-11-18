// File: src/services/api/subscription.ts
// AGREGAR ESTE ARCHIVO NUEVO

import { fetchWithAuth } from './helpers';

// ============= TIPOS =============
export interface Subscription {
  plan: string;
  price_id: string;
  stripe_subscription_id: string;
  stripe_customer_id: string;
  status: string;
  current_period_start: string;
  current_period_end: string;
  created_at: string;
}

interface SwitchPlanResponse {
  ok: boolean;
  message: string;
  data?: Subscription;
}

// ============= FUNCIONES API =============

/**
 * Obtener suscripción actual de la tienda
 */
export const getStoreSubscription = async (): Promise<Subscription> => {
  try {
    console.log('🔍 Llamando a /web/stores/mine/subscription');
    
    const result = await fetchWithAuth('/web/stores/mine/subscription', {
      method: 'GET'
    });

    console.log('📦 Respuesta completa getStoreSubscription:', result);

    if (!result || !result.ok || !result.data) {
      throw new Error(result?.message || 'Error al obtener la suscripción');
    }

    return result.data;
  } catch (error) {
    console.error('❌ Error en getStoreSubscription:', error);
    throw error;
  }
};

/**
 * Cambiar plan de suscripción
 */
export const switchSubscriptionPlan = async (newPlanId: 'premium' | 'basico'): Promise<SwitchPlanResponse> => {
  try {
    const result = await fetchWithAuth('/web/stores/mine/subscription/switch', {
      method: 'PATCH',
      body: JSON.stringify({ new_plan_id: newPlanId })
    });

    if (!result || !result.ok) {
      throw new Error(result?.message || 'Error al cambiar el plan');
    }

    return result;
  } catch (error) {
    console.error('❌ Error al cambiar plan:', error);
    throw error;
  }
};

/**
 * Cancelar suscripción actual
 */
export const cancelSubscription = async (): Promise<{ ok: boolean; message: string }> => {
  try {
    const result = await fetchWithAuth('/web/stores/mine/subscription/cancel', {
      method: 'POST'
    });

    if (!result || !result.ok) {
      throw new Error(result?.message || 'Error al cancelar la suscripción');
    }

    return result;
  } catch (error) {
    console.error('❌ Error al cancelar suscripción:', error);
    throw error;
  }
};