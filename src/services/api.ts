// FileName: api.ts
// Path: src/services/api.ts

import type {
  DashboardStats,
  KeyMetrics,
  AdminDashboardSummary,
  StoreRegistrationData,
  LoginResponse,
  MeResponse,
  User,
  GetUsersResponse,
  GetProductsResponse,
  Product,
  GetStoresResponse,
  Store,
  Category,
  GetStoreStatsResponse,
  StoreStatsData,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/* ============================================================
 🤖 TIPOS DE ANÁLISIS IA (NUEVO)
 ============================================================ */
export interface AIRecommendation {
  top_products: {
    productname: string;
    totalqty: number;
    totalrevenue: number;
    reason_1: string;
    reason_2: string;
  }[];
  low_products: {
    productname: string;
    totalqty: number;
    totalrevenue: number;
    action_1: string;
    action_2: string;
  }[];
  executive_summary: {
    title: string;
    summary: string;
  }[];
}

/* ============================================================
 🔧 HELPER: fetchWithAuth
 ============================================================ */
const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    window.location.href = '/login?sessionExpired=true';
    throw new Error('No estás autenticado.');
  }

  const headers = new Headers(options.headers || {});
  headers.append('Authorization', `Bearer ${token}`);
  if (!headers.has('Content-Type'))
    headers.append('Content-Type', 'application/json');

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.clear();
      window.location.href = '/login?sessionExpired=true';
      throw new Error('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.');
    }
    try {
      const errorData = await response.json();
      const errorMessage = Array.isArray(errorData.message)
        ? errorData.message.join(', ')
        : errorData.message || `Error HTTP: ${response.status}`;
      throw new Error(errorMessage);
    } catch {
      throw new Error(`Error HTTP: ${response.status}`);
    }
  }

  if (response.status === 204) return null;

  try {
    return await response.json();
  } catch {
    throw new Error('Respuesta del servidor no es JSON válido.');
  }
};

/* ============================================================
 🔧 HELPER: fetchWithoutAuth
 ============================================================ */
const fetchWithoutAuth = async (endpoint: string, options: RequestInit = {}) => {
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type'))
    headers.append('Content-Type', 'application/json');

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    try {
      const err = await response.json();
      const msg = Array.isArray(err.message)
        ? err.message.join(', ')
        : err.message || `Error HTTP: ${response.status}`;
      throw new Error(msg);
    } catch {
      throw new Error(`Error HTTP: ${response.status}`);
    }
  }

  if (response.status === 204) return null;

  try {
    return await response.json();
  } catch {
    throw new Error('Respuesta del servidor no es JSON válido.');
  }
};

/* ============================================================
 🧍 AUTENTICACIÓN
 ============================================================ */
export const loginUser = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const LOGIN_ENDPOINT = '/auth/login';
  try {
    const response = await fetch(`${API_BASE_URL}${LOGIN_ENDPOINT}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      const errorMessage = data?.message || `Error HTTP: ${response.status}`;
      throw new Error(errorMessage);
    }

    if (!data.access_token && !data.token) {
      throw new Error(
        "Respuesta inválida de la API: no se encontró 'access_token' o 'token'."
      );
    }

    return data as LoginResponse;
  } catch (error) {
    console.error('Fallo en la llamada a la API de login:', error);
    if (error instanceof Error) throw new Error(error.message);
    throw new Error('Ocurrió un error desconocido.');
  }
};

export const getMe = async (): Promise<MeResponse> => {
  const ME_ENDPOINT = '/auth/me';
  try {
    const data = await fetchWithAuth(ME_ENDPOINT, { method: 'GET' });
    if (!data || (!data.id && !data.user_id))
      throw new Error('Respuesta inválida de /auth/me.');
    return data as MeResponse;
  } catch (error) {
    console.error('Fallo al obtener datos de /auth/me:', error);
    localStorage.clear();
    if (error instanceof Error) throw new Error(error.message);
    throw new Error('No se pudieron cargar los datos del usuario.');
  }
};

/* ============================================================
 🏪 TIENDAS - STORE
 ============================================================ */
export const registerStore = async (
  data: StoreRegistrationData
): Promise<any> => {
  const REGISTER_ENDPOINT = '/web/stores/create-account';
  console.log('--- registerStore() REAL ---');
  console.log(`Llamando a: POST ${REGISTER_ENDPOINT}`);
  console.log('Datos que SE ENVIARÁN al backend:', data);

  try {
    const response = await fetch(`${API_BASE_URL}${REGISTER_ENDPOINT}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();
    if (!response.ok) {
      const errorMessage = Array.isArray(responseData.message)
        ? responseData.message.join(', ')
        : responseData.message || `Error HTTP: ${response.status}`;
      throw new Error(errorMessage);
    }

    return responseData;
  } catch (error) {
    console.error('Fallo en la llamada a la API de registro:', error);
    if (error instanceof Error) throw new Error(error.message);
    throw new Error('Ocurrió un error desconocido.');
  }
};

export const getStoreDashboardData = async (): Promise<StoreStatsData> => {
  const STATS_ENDPOINT = '/web/stores/mine/stats';
  console.log('--- getStoreDashboardData() REAL ---');
  try {
    const response: GetStoreStatsResponse = await fetchWithAuth(STATS_ENDPOINT, {
      method: 'GET',
    });
    if (!response || !response.data) {
      throw new Error(
        "La respuesta de la API no contiene el objeto 'data' esperado."
      );
    }
    return response.data;
  } catch (error) {
    console.error('Fallo al obtener datos del dashboard de tienda:', error);
    if (error instanceof Error) throw new Error(error.message);
    throw new Error('No se pudieron cargar los datos del dashboard.');
  }
};

export const getStoreProducts = async (): Promise<Product[]> => {
  const PRODUCTS_ENDPOINT = '/web/stores/mine/products';
  try {
    const response: GetProductsResponse = await fetchWithAuth(
      PRODUCTS_ENDPOINT,
      { method: 'GET' }
    );
    return response?.data || [];
  } catch (error) {
    console.error('Fallo al obtener productos de la tienda:', error);
    if (error instanceof Error) throw new Error(error.message);
    throw new Error('No se pudieron cargar los productos.');
  }
};

/**
 * ✅ getStoreProfile (CORREGIDO y MEJORADO)
 * Devuelve el objeto completo del usuario con su tienda (si aplica).
 * Si el token pertenece a un superadmin, usa /auth/me automáticamente.
 */
export const getStoreProfile = async (): Promise<User> => {
  const PROFILE_ENDPOINT = '/web/stores/mine/profile-with-store';
  const FALLBACK_ENDPOINT = '/auth/me';

  try {
    console.log('🧩 getStoreProfile(): obteniendo perfil de tienda...');
    const apiResponse: any = await fetchWithAuth(PROFILE_ENDPOINT, {
      method: 'GET',
    });

    console.log('🧩 Respuesta cruda de /profile-with-store:', apiResponse);

    // Si el backend devuelve { ok: false, error: 'Unauthorized...' }, probamos como superadmin
    if (
      apiResponse?.ok === false &&
      apiResponse?.error?.toLowerCase().includes('unauthorized')
    ) {
      console.warn(
        '⚠️ Token no válido para perfil de tienda. Intentando /auth/me (superadmin)...'
      );

      const meData: any = await fetchWithAuth(FALLBACK_ENDPOINT, {
        method: 'GET',
      });
      console.log('🧩 Perfil obtenido desde /auth/me:', meData);

      const normalizedSuperadmin: User = {
        ...meData,
        role: meData.role || 'superadmin',
        store: null,
      };

      console.log('✅ Usuario normalizado (superadmin):', normalizedSuperadmin);
      return normalizedSuperadmin;
    }

    // Si viene envuelto en { ok, data }, extraemos el objeto real
    const userRaw = apiResponse?.data || apiResponse;
    if (!userRaw)
      throw new Error("La respuesta no contiene 'data' con el usuario.");

    const normalizedRole =
      userRaw.role || userRaw.rol || userRaw.userType || userRaw.type || 'store';

    const normalizedUser: User = {
      ...userRaw,
      role: normalizedRole,
      store: userRaw.store || null,
    };

    console.log('✅ Usuario normalizado (tienda):', normalizedUser);
    return normalizedUser;
  } catch (error) {
    console.error('❌ Fallo al obtener perfil de tienda o usuario:', error);
    if (error instanceof Error) throw new Error(error.message);
    throw new Error('No se pudo cargar el perfil del usuario.');
  }
};

export const updateStoreProfile = async (
  data: Partial<Store & User>
): Promise<User> => {
  const UPDATE_ENDPOINT = `/web/stores/mine/profile-with-store`;

  const cleanData: any = {
    ...(data.name && { name: data.name }),
    ...(data.phone && { phone: data.phone }),
    ...(data.business_name && { business_name: data.business_name }),
    ...(data.owner_name && { owner_name: data.owner_name }),
    ...(data.address && { address: data.address }),
    ...(data.description !== undefined && { description: data.description }),
    ...(data.latitude !== undefined && { latitude: data.latitude }),
    ...(data.longitude !== undefined && { longitude: data.longitude }),
  };

  try {
    const response = await fetchWithAuth(UPDATE_ENDPOINT, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cleanData),
    });

    if (!response) throw new Error('El servidor no devolvió datos');
    return response as User;
  } catch (error) {
    console.error('❌ [API] Error completo en updateStoreProfile:', error);
    if (error instanceof Error) throw error;
    throw new Error('No se pudo actualizar el perfil.');
  }
};

export const getStoreSubscription = async (): Promise<any> => {
  const SUBSCRIPTION_ENDPOINT = '/web/stores/mine/subscription';
  try {
    const data = await fetchWithAuth(SUBSCRIPTION_ENDPOINT, { method: 'GET' });
    return data;
  } catch (error) {
    console.error('Fallo al obtener datos de suscripción:', error);
    if (error instanceof Error) throw new Error(error.message);
    throw new Error('No se pudo cargar la suscripción.');
  }
};

/* ============================================================
 🤖 ANÁLISIS IA (NUEVO)
 ============================================================ */

// --- Obtener el análisis IA ---
export const getStoreAnalysis = async (
  storeId: number
): Promise<AIRecommendation> => {
  // Esta es una API externa, por eso no usa fetchWithAuth
  const endpoint = `https://lookappapi.onrender.com/analyze/${storeId}/stats`;

  const res = await fetch(endpoint);

  if (!res.ok) {
    throw new Error(`Error al obtener análisis: HTTP ${res.status}`);
  }

  const json = await res.json();

  if (!json.ai) {
    throw new Error("La respuesta no contiene el campo 'ai'");
  }

  // Extraer JSON del texto markdown
  const match = json.ai.match(/```json\s*([\s\S]*?)\s*```/);

  if (!match) {
    throw new Error('No se pudo extraer el JSON del análisis');
  }

  const parsed = JSON.parse(match[1]);

  // Normalizar los datos al formato esperado
  const normalized: AIRecommendation = {
    top_products: (parsed.top_products || []).map((p: any) => ({
      productname: p.name,
      totalqty: p.quantity_sold,
      totalrevenue: p.revenue,
      reason_1: p.reason_1,
      reason_2: p.reason_2,
    })),
    low_products: (parsed.low_products || []).map((p: any) => ({
      productname: p.name,
      totalqty: p.quantity_sold,
      totalrevenue: p.revenue,
      action_1: p.action_1,
      action_2: p.action_2,
    })),
    executive_summary: parsed.executive_summary || [],
  };

  return normalized;
};

// --- Función principal ---
export const fetchAIRecommendations = async (): Promise<AIRecommendation> => {
  // Usamos la función getStoreProfile existente para obtener el ID
  const user = await getStoreProfile();
  if (!user.store?.id) {
    throw new Error('No se pudo obtener el ID de la tienda para el análisis.');
  }
  
  const storeId = user.store.id;
  const analysis = await getStoreAnalysis(storeId);
  return analysis;
};

/* ============================================================
 🛒 CATEGORÍAS
 ============================================================ */
export const getCategories = async (): Promise<Category[]> => {
  const CATEGORIES_ENDPOINT = '/categories';
  try {
    const response = await fetch(`${API_BASE_URL}${CATEGORIES_ENDPOINT}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
    const data = await response.json();
    return data as Category[];
  } catch (error) {
    console.error('Fallo al obtener categorías:', error);
    if (error instanceof Error) throw new Error(error.message);
    throw new Error('No se pudieron cargar las categorías.');
  }
};

/* ============================================================
 💳 PAGOS
 ============================================================ */
export const createCheckoutSession = async (cartItems: any[]) => {
  try {
    const response = await fetchWithAuth(
      '/web/payments/create-checkout-session',
      {
        method: 'POST',
        body: JSON.stringify({ items: cartItems }),
      }
    );
    return response;
  } catch (error) {
    console.error('Fallo al crear sesión de checkout:', error);
    if (error instanceof Error) throw new Error(error.message);
    throw new Error('No se pudo crear la sesión de pago.');
  }
};

/* ============================================================
 🛠️ PANEL DE ADMIN
 ============================================================ */
export const getAdminDashboardData = async (): Promise<AdminDashboardSummary> => {
  const STATS_ENDPOINT = '/web/superadmin/admin/stats';
  console.log('--- getAdminDashboardData() REAL ---');
  try {
    const response = await fetchWithAuth(STATS_ENDPOINT, { method: 'GET' });
    if (response && response.data) return response.data as AdminDashboardSummary;
    throw new Error(
      "La respuesta de la API no contiene el objeto 'data' esperado."
    );
  } catch (error) {
    console.error('Fallo al obtener datos del dashboard de admin:', error);
    if (error instanceof Error) throw new Error(error.message);
    throw new Error('No se pudieron cargar las estadísticas de admin.');
  }
};

export const getAdminAllStores = async (): Promise<Store[]> => {
  const STORES_ENDPOINT = '/web/stores';
  try {
    const data: GetStoresResponse = await fetchWithAuth(STORES_ENDPOINT, {
      method: 'GET',
    });
    return data.data || [];
  } catch (error) {
    console.error('Fallo al obtener todas las tiendas:', error);
    if (error instanceof Error) throw new Error(error.message);
    throw new Error('No se pudieron cargar todas las tiendas.');
  }
};

export const getAdminAllProducts = async (): Promise<Product[]> => {
  const PRODUCTS_ENDPOINT = '/products';
  try {
    const data: GetProductsResponse = await fetchWithAuth(PRODUCTS_ENDPOINT, {
      method: 'GET',
    });
    return data.data || [];
  } catch (error) {
    console.error('Fallo al obtener todos los productos:', error);
    if (error instanceof Error) throw new Error(error.message);
    throw new Error('No se pudieron cargar todos los productos.');
  }
};

export const getAdminPendingStores = async (): Promise<Store[]> => {
  const ENDPOINT = '/web/superadmin/pending';
  try {
    const data: GetStoresResponse = await fetchWithAuth(ENDPOINT, {
      method: 'GET',
    });
    return data.data || [];
  } catch (error) {
    console.error('Fallo al obtener tiendas pendientes:', error);
    if (error instanceof Error) throw new Error(error.message);
    throw new Error('No se pudieron cargar las tiendas pendientes.');
  }
};

export const getAdminApprovedStores = async (): Promise<Store[]> => {
  const ENDPOINT = '/web/superadmin/approved';
  try {
    const data: GetStoresResponse = await fetchWithAuth(ENDPOINT, {
      method: 'GET',
    });
    return data.data || [];
  } catch (error) {
    console.error('Fallo al obtener tiendas aprobadas:', error);
    if (error instanceof Error) throw new Error(error.message);
    throw new Error('No se pudieron cargar las tiendas aprobadas.');
  }
};

export const getAdminRejectedStores = async (): Promise<Store[]> => {
  const ENDPOINT = '/web/superadmin/rejected';
  try {
    const data: GetStoresResponse = await fetchWithAuth(ENDPOINT, {
      method: 'GET',
    });
    return data.data || [];
  } catch (error) {
    console.error('Fallo al obtener tiendas rechazadas:', error);
    if (error instanceof Error) throw new Error(error.message);
    throw new Error('No se pudieron cargar las tiendas rechazadas.');
  }
};

export const approveStore = async (storeId: number | string): Promise<any> => {
  const ENDPOINT = `/web/superadmin/${storeId}/approve`;
  try {
    return await fetchWithAuth(ENDPOINT, { method: 'PATCH' });
  } catch (error) {
    console.error(`Fallo al aprobar tienda ${storeId}:`, error);
    if (error instanceof Error) throw new Error(error.message);
    throw new Error('No se pudo aprobar la tienda.');
  }
};

export const rejectStore = async (storeId: number | string): Promise<any> => {
  const ENDPOINT = `/web/superadmin/${storeId}/reject`;
  try {
    return await fetchWithAuth(ENDPOINT, { method: 'PATCH' });
  } catch (error) {
    console.error(`Fallo al rechazar tienda ${storeId}:`, error);
    if (error instanceof Error) throw new Error(error.message);
    throw new Error('No se pudo rechazar la tienda.');
  }
};

export const getAdminUsers = async (): Promise<User[]> => {
  const USERS_ENDPOINT = '/users';
  try {
    const data: GetUsersResponse = await fetchWithAuth(USERS_ENDPOINT, {
      method: 'GET',
    });
    return data.data || [];
  } catch (error) {
    console.error('Fallo al obtener usuarios:', error);
    if (error instanceof Error) throw new Error(error.message);
    throw new Error('No se pudieron cargar los usuarios.');
  }
};

export const getAdminStoreById = async (storeId: string): Promise<Store> => {
  const ENDPOINT = `/web/superadmin/store/${storeId}`;
  try {
    const response = await fetchWithAuth(ENDPOINT, { method: 'GET' });
    if (!response || !response.data)
      throw new Error("La respuesta no contiene 'data'.");
    return response.data as Store;
  } catch (error) {
    console.error('Fallo al obtener detalles de la tienda:', error);
    if (error instanceof Error) throw new Error(error.message);
    throw new Error('No se pudieron cargar los detalles de la tienda.');
  }
};

export const getAdminStoreStatsById = async (
  storeId: string
): Promise<StoreStatsData> => {
  console.warn(`--- getAdminStoreStatsById(${storeId}) es SIMULADA ---`);
  await new Promise((res) => setTimeout(res, 500));
  return {
    total_sales: 88,
    total_revenue: 73906.92,
    average_ticket: 839.85,
    total_products: 1539,
    low_stock: 0,
    highest_selling_product: {
      productId: 1006,
      productName: 'Unbranded Cotton Shoes',
      units_sold: 34,
      revenue: '10201.90',
    },
    lowest_selling_product: {
      productId: 1007,
      productName: 'Awesome Concrete Car',
      units_sold: 1,
      revenue: '462.79',
    },
    best_stocked_product: {
      productId: 1014,
      productName: 'Ergonomic Silk Tuna',
      quantity: 184,
    },
    worst_stocked_product: {
      productId: 1007,
      productName: 'Awesome Concrete Car',
      quantity: 11,
    },
    last_sales: [
      {
        productName: 'Electronic Steel Bike',
        total: '41.78',
        quantity: 2,
        createdAt: '2025-11-02T20:13:30.877Z',
      },
    ],
  } as StoreStatsData;
};

/* ============================================================
 🔚 FIN DEL ARCHIVO
 ============================================================ */