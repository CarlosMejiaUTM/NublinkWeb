// File: src/services/api/store.ts

import { fetchWithAuth, API_BASE_URL } from './helpers';
import type {
  StoreRegistrationData,
  Product,
  StoreStatsData,
  GetStoreStatsResponse,
  GetProductsResponse,
  Store,
  User
} from '../../types';

/* ============================================================
 🏪 TIENDAS
 ============================================================ */

/**
 * Registrar tienda con plan y método de pago
 */
export const registerStore = async (data: StoreRegistrationData): Promise<any> => {
  const REGISTER_ENDPOINT = '/web/stores/create-account';
  const response = await fetch(`${API_BASE_URL}${REGISTER_ENDPOINT}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const responseData = await response.json();
  if (!response.ok) {
    const msg = Array.isArray(responseData.message)
      ? responseData.message.join(', ')
      : responseData.message || `Error HTTP: ${response.status}`;
    throw new Error(msg);
  }

  return responseData;
};

/**
 * 📊 Estadísticas de la tienda del usuario actual
 */
export const getStoreDashboardData = async (): Promise<StoreStatsData> => {
  const STATS_ENDPOINT = '/web/stores/mine/stats';
  const response: GetStoreStatsResponse = await fetchWithAuth(STATS_ENDPOINT, { method: 'GET' });

  if (!response || !response.data) {
    throw new Error("La respuesta de la API no contiene 'data'.");
  }

  return response.data;
};

/**
 * 🛍️ Productos de la tienda del usuario actual
 */
export const getStoreProducts = async (): Promise<Product[]> => {
  const PRODUCTS_ENDPOINT = '/web/stores/mine/products';
  const response: GetProductsResponse = await fetchWithAuth(PRODUCTS_ENDPOINT, { method: 'GET' });
  return response?.data || [];
};

/**
 * ✅ Perfil del usuario (con fallback a /auth/me)
 */
export const getStoreProfile = async (): Promise<User> => {
  const PROFILE_ENDPOINT = '/web/stores/mine/profile-with-store';
  const FALLBACK_ENDPOINT = '/auth/me';

  try {
    const apiResponse: any = await fetchWithAuth(PROFILE_ENDPOINT, { method: 'GET' });

    // Si la respuesta es no autorizada → intentar con /auth/me
    if (apiResponse?.ok === false && apiResponse?.error?.toLowerCase().includes('unauthorized')) {
      const meData: any = await fetchWithAuth(FALLBACK_ENDPOINT, { method: 'GET' });
      return { ...meData, role: meData.role || 'superadmin', store: null };
    }

    const userRaw = apiResponse?.data || apiResponse;
    if (!userRaw) throw new Error("La respuesta no contiene 'data' con el usuario.");

    return {
      ...userRaw,
      role: userRaw.role || userRaw.rol || 'store',
      store: userRaw.store || null,
    };

  } catch (error) {
    if (error instanceof Error) throw new Error(error.message);
    throw new Error('No se pudo cargar el perfil del usuario.');
  }
};

/**
 * ✏️ Actualizar perfil de usuario + tienda
 */
export const updateStoreProfile = async (data: Partial<Store & User>): Promise<User> => {
  const UPDATE_ENDPOINT = `/web/stores/mine/profile-with-store`;

  // Separar datos de usuario y tienda según el formato esperado por la API
  const payload: any = {};

  // userData - solo incluir si hay cambios en campos de usuario
  const userData: any = {};
  if (data.name !== undefined) userData.name = data.name;
  if (data.phone !== undefined) userData.phone = data.phone;
  if (data.username !== undefined) userData.username = data.username;
  
  if (Object.keys(userData).length > 0) {
    payload.userData = userData;
  }

  // storeData - solo incluir si hay cambios en campos de tienda
  const storeData: any = {};
  if (data.business_name !== undefined) storeData.business_name = data.business_name;
  if (data.owner_name !== undefined) storeData.owner_name = data.owner_name;
  if (data.address !== undefined) storeData.address = data.address;
  if (data.description !== undefined) storeData.description = data.description;
  if (data.latitude !== undefined) storeData.latitude = String(data.latitude);
  if (data.longitude !== undefined) storeData.longitude = String(data.longitude);
  if (data.category_id !== undefined) storeData.category_id = data.category_id;
  if (data.map_url !== undefined) storeData.map_url = data.map_url;
  
  if (Object.keys(storeData).length > 0) {
    payload.storeData = storeData;
  }

  const response = await fetchWithAuth(UPDATE_ENDPOINT, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response) throw new Error('El servidor no devolvió datos');
  
  // La API devuelve { ok: true, data: { user con store anidado } }
  return response.data || response;
};

/**
 * 📦 Obtener la suscripción activa de la tienda
 */
export const getStoreSubscription = async (): Promise<any> => {
  const SUBSCRIPTION_ENDPOINT = '/web/stores/mine/subscription';
  return await fetchWithAuth(SUBSCRIPTION_ENDPOINT, { method: 'GET' });
};

/**
 * 🚫 Dar de baja la cuenta de la tienda (rechazar tienda)
 */
export const cancelStoreAccount = async (storeId: number, comment?: string): Promise<any> => {
  const REJECT_ENDPOINT = `/web/superadmin/${storeId}/reject`;
  
  const response = await fetchWithAuth(REJECT_ENDPOINT, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      comment: comment || 'Cancelación solicitada por el usuario desde el panel de configuración'
    }),
  });

  if (!response) {
    throw new Error('Error al dar de baja la cuenta');
  }

  return response;
};

/* ============================================================
 🧠 FUNCIÓN UNIFICADA (SuperAdmin o Tienda)
 ============================================================ */

/**
 * 🔄 Devuelve las estadísticas del dashboard
 * - Si el usuario es SuperAdmin → pide por ID de tienda
 * - Si el usuario es una tienda → pide las suyas propias
 */
export const getDashboardData = async (user: User, storeId?: string): Promise<StoreStatsData> => {
  try {
    if (user.role === 'superadmin') {
      if (!storeId) {
        throw new Error("Falta el storeId para ver estadísticas de una tienda específica.");
      }

      // ⚙️ Endpoint correcto del SuperAdmin
      const ENDPOINT = `/web/superadmin/store/${storeId}`;
      const response = await fetchWithAuth(ENDPOINT, { method: 'GET' });

      if (!response || !response.data) {
        throw new Error("No se pudieron obtener las estadísticas de la tienda seleccionada.");
      }

      return response.data;
    }

    // 🏪 Si no es superadmin, obtiene las estadísticas propias
    return await getStoreDashboardData();

  } catch (error) {
    console.error('❌ Error al obtener el dashboard:', error);
    throw new Error('No se pudieron cargar las estadísticas del dashboard.');
  }
};