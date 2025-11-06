// FileName: api.ts
// Path: src/services/api.ts

import type { 
    DashboardStats, KeyMetrics, AdminDashboardSummary, StoreRegistrationData,
    LoginResponse, MeResponse, User, GetUsersResponse,
    GetProductsResponse, Product,
    GetStoresResponse, Store, Category,
    GetStoreStatsResponse, StoreStatsData
} from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// --- FUNCIÓN HELPER (fetchWithAuth) ---
const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    window.location.href = '/login?sessionExpired=true';
    throw new Error("No estás autenticado.");
  }
  const headers = new Headers(options.headers || {});
  headers.append('Authorization', `Bearer ${token}`);
  headers.append('Content-Type', 'application/json');
  const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
  if (!response.ok) {
    if (response.status === 401) { 
      localStorage.clear();
      window.location.href = '/login?sessionExpired=true'; 
      throw new Error("Tu sesión ha expirado. Por favor, inicia sesión de nuevo.");
    }
    try {
      const errorData = await response.json();
      const errorMessage = Array.isArray(errorData.message) 
          ? errorData.message.join(', ') 
          : (errorData.message || `Error HTTP: ${response.status}`);
      throw new Error(errorMessage);
    } catch (e) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
  }
  if (response.status === 204) { return null; }
  return response.json();
};

// --- FUNCIONES DE AUTH (REALES) ---
export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  const LOGIN_ENDPOINT = '/auth/login';
  try {
    const response = await fetch(`${API_BASE_URL}${LOGIN_ENDPOINT}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }), });
    const data = await response.json();
    if (!response.ok) { const errorMessage = data?.message || `Error HTTP: ${response.status}`; throw new Error(errorMessage); }
    if (!data.access_token) { throw new Error("Respuesta inválida de la API: no se encontró 'access_token'."); }
    return data as LoginResponse;
  } catch (error) {
    console.error("Fallo en la llamada a la API de login:", error);
    if (error instanceof Error) throw new Error(error.message || "Ocurrió un error desconocido.");
    throw new Error("Ocurrió un error desconocido.");
  }
};
export const getMe = async (): Promise<MeResponse> => {
  const ME_ENDPOINT = '/auth/me';
  try {
    const data = await fetchWithAuth(ME_ENDPOINT, { method: 'GET', });
    if (!data.id || !data.role) { throw new Error("Respuesta inválida de /auth/me."); }
    // No mapeamos el rol, dejamos 'superadmin' tal como viene
    return data as MeResponse;
  } catch (error) {
    console.error("Fallo al obtener datos de /auth/me:", error);
    localStorage.clear();
    if (error instanceof Error) throw new Error(error.message);
    throw new Error("No se pudieron cargar los datos del usuario.");
  }
};


// --- FUNCIÓN REGISTRAR TIENDA (REAL) ---
export const registerStore = async (data: StoreRegistrationData): Promise<any> => {
  const REGISTER_ENDPOINT = '/web/stores/create-account'; 
  console.log("--- registerStore() REAL ---");
  console.log(`Llamando a: POST ${REGISTER_ENDPOINT}`);
  console.log("Datos que SE ENVIARÁN al backend:", data);

  try {
    // Esta llamada es pública, NO usa fetchWithAuth
    const response = await fetch(`${API_BASE_URL}${REGISTER_ENDPOINT}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data), 
    });
    const responseData = await response.json();
    if (!response.ok) {
      const errorMessage = Array.isArray(responseData.message) 
          ? responseData.message.join(', ') 
          : (responseData.message || `Error HTTP: ${response.status}`);
      throw new Error(errorMessage);
    }
    return responseData; 
  } catch (error) {
    console.error("Fallo en la llamada a la API de registro:", error);
    if (error instanceof Error) throw new Error(error.message || "Ocurrió un error desconocido.");
    throw new Error("Ocurrió un error desconocido.");
  }
};


// --- FUNCIÓN OBTENER CATEGORÍAS (REAL) ---
export const getCategories = async (): Promise<Category[]> => {
  const CATEGORIES_ENDPOINT = '/categories';
  try {
    // Es una llamada pública, no necesita token
    const response = await fetch(`${API_BASE_URL}${CATEGORIES_ENDPOINT}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
    }
    const data = await response.json();
    return data as Category[];
  } catch (error) {
    console.error("Fallo al obtener categorías:", error);
    if (error instanceof Error) throw new Error(error.message);
    throw new Error("No se pudieron cargar las categorías.");
  }
};


// --- FUNCIONES DEL PANEL DE TIENDA (¡AHORA REALES!) ---

// ¡¡REAL!!
export const getStoreDashboardData = async (): Promise<StoreStatsData> => {
  const STATS_ENDPOINT = '/web/stores/mine/stats'; // <-- Endpoint REAL
  console.log("--- getStoreDashboardData() REAL ---");
  try {
    // La API devuelve { ok: true, data: {...} }
    const response: GetStoreStatsResponse = await fetchWithAuth(STATS_ENDPOINT, { method: 'GET' });
    if (!response.data) {
        throw new Error("La respuesta de la API no contiene el objeto 'data' esperado.");
    }
    return response.data; // Devuelve solo el objeto 'data'
  } catch (error) {
    console.error("Fallo al obtener datos del dashboard de tienda:", error);
    if (error instanceof Error) throw new Error(error.message);
    throw new Error("No se pudieron cargar los datos del dashboard.");
  }
};

// ¡¡REAL!! (Endpoint actualizado)
export const getStoreProducts = async (): Promise<Product[]> => {
  const PRODUCTS_ENDPOINT = '/web/stores/mine/products'; // <-- Endpoint REAL y FILTRADO
  try {
    const response: GetProductsResponse = await fetchWithAuth(PRODUCTS_ENDPOINT, { method: 'GET' });
    return response.data || [];
  } catch (error) {
    console.error("Fallo al obtener productos de la tienda:", error);
    if (error instanceof Error) throw new Error(error.message);
    throw new Error("No se pudieron cargar los productos.");
  }
};

// ¡¡REAL!! (Endpoint actualizado)
export const getStoreProfile = async (): Promise<User> => { // Devuelve el objeto User completo
  const PROFILE_ENDPOINT = '/web/stores/mine/profile-with-store'; // <-- Endpoint REAL
  try {
    const user: User = await fetchWithAuth(PROFILE_ENDPOINT, { method: 'GET' });
    
    // --- ¡CAMBIO IMPORTANTE! ---
    // Ya NO lanzamos un error aquí. Simplemente devolvemos el usuario.
    // ProtectedRoute se encargará de decidir qué hacer si (user.store) es null.
    /*
    if (!user.store) {
      throw new Error("Este usuario no tiene una tienda asociada.");
    }
    */
    
    return user; // Devuelve el usuario (tenga o no tienda)
  } catch (error) {
    console.error("Fallo al obtener perfil de tienda:", error);
    if (error instanceof Error) throw new Error(error.message);
    throw new Error("No se pudo cargar el perfil de la tienda.");
  }
};

// ¡¡REAL!! (Endpoint actualizado)
export const updateStoreProfile = async (data: Partial<Store & User>): Promise<User> => { // Acepta y devuelve User
  const UPDATE_ENDPOINT = `/web/stores/mine/profile-with-store`; // <-- Endpoint REAL
  console.log("Actualizando perfil de tienda:", data);
  try {
    const updatedUser: User = await fetchWithAuth(UPDATE_ENDPOINT, {
      method: 'PATCH', // <-- CAMBIO A PATCH (como en tu API)
      body: JSON.stringify(data) // Envía los campos a actualizar
    });
    return updatedUser;
  } catch (error) {
    console.error("Fallo al actualizar perfil de tienda:", error);
    if (error instanceof Error) throw new Error(error.message);
    throw new Error("No se pudo actualizar el perfil.");
  }
};

// ¡¡REAL!!
export const getStoreSubscription = async (): Promise<any> => {
  const SUBSCRIPTION_ENDPOINT = '/web/stores/mine/subscription';
  try {
    const data = await fetchWithAuth(SUBSCRIPTION_ENDPOINT, { method: 'GET' });
    return data;
  } catch (error) {
    console.error("Fallo al obtener datos de suscripción:", error);
    if (error instanceof Error) throw new Error(error.message);
    throw new Error("No se pudo cargar la suscripción.");
  }
};


// --- FUNCIONES DEL PANEL DE ADMIN (¡¡REALES!!) ---

// ¡¡REAL!!
export const getAdminDashboardData = async (): Promise<AdminDashboardSummary> => {
    const STATS_ENDPOINT = '/web/superadmin/admin/stats';
    console.log("--- getAdminDashboardData() REAL ---");
    try {
      // Tu API devuelve { "statusCode": 200, "message": "...", "data": { ... } }
      const response = await fetchWithAuth(STATS_ENDPOINT, { method: 'GET' });
      
      // Extraemos el objeto 'data' de la respuesta.
      if (response && response.data) {
          return response.data as AdminDashboardSummary;
      }
      
      // Si 'data' no existe, lanzamos un error
      throw new Error("La respuesta de la API no contiene el objeto 'data' esperado.");

    } catch (error) {
       console.error("Fallo al obtener datos del dashboard de admin:", error);
       if (error instanceof Error) throw new Error(error.message);
       throw new Error("No se pudieron cargar las estadísticas de admin.");
    }
};

// ¡¡NUEVA FUNCIÓN REAL!! (Para cruzar datos de productos)
export const getAdminAllStores = async (): Promise<Store[]> => {
  const STORES_ENDPOINT = '/web/stores'; // Endpoint que lista todas las tiendas
  try {
    // Asumimos que la respuesta es { data: [...] }
    const data: GetStoresResponse = await fetchWithAuth(STORES_ENDPOINT, { method: 'GET' });
    return data.data || [];
  } catch (error) {
    console.error("Fallo al obtener todas las tiendas:", error);
    if (error instanceof Error) throw new Error(error.message);
    throw new Error("No se pudieron cargar todas las tiendas.");
  }
};

// ¡¡NUEVA FUNCIÓN REAL!! (Para el catálogo global)
export const getAdminAllProducts = async (): Promise<Product[]> => {
  const PRODUCTS_ENDPOINT = '/products'; // Endpoint que lista TODOS los productos
  try {
    const data: GetProductsResponse = await fetchWithAuth(PRODUCTS_ENDPOINT, { method: 'GET' });
    return data.data || [];
  } catch (error) {
    console.error("Fallo al obtener todos los productos:", error);
    if (error instanceof Error) throw new Error(error.message);
    throw new Error("No se pudieron cargar todos los productos.");
  }
};

// ¡¡REAL!!
export const getAdminPendingStores = async (): Promise<Store[]> => {
  const PENDING_STORES_ENDPOINT = '/web/superadmin/pending';
  try {
    const data: GetStoresResponse = await fetchWithAuth(PENDING_STORES_ENDPOINT, { method: 'GET' });
    return data.data || [];
  } catch (error) {
    console.error("Fallo al obtener tiendas pendientes:", error);
    if (error instanceof Error) throw new Error(error.message);
    throw new Error("No se pudieron cargar las tiendas pendientes.");
  }
};

// ¡¡REAL!!
export const getAdminApprovedStores = async (): Promise<Store[]> => {
  const ENDPOINT = '/web/superadmin/approved';
  try {
    const data: GetStoresResponse = await fetchWithAuth(ENDPOINT, { method: 'GET' });
    return data.data || [];
  } catch (error) {
    console.error("Fallo al obtener tiendas aprobadas:", error);
    if (error instanceof Error) throw new Error(error.message);
    throw new Error("No se pudieron cargar las tiendas aprobadas.");
  }
};

// ¡¡REAL!!
export const getAdminRejectedStores = async (): Promise<Store[]> => {
  const ENDPOINT = '/web/superadmin/rejected';
  try {
    const data: GetStoresResponse = await fetchWithAuth(ENDPOINT, { method: 'GET' });
    return data.data || [];
  } catch (error) {
    console.error("Fallo al obtener tiendas rechazadas:", error);
    if (error instanceof Error) throw new Error(error.message);
    throw new Error("No se pudieron cargar las tiendas rechazadas.");
  }
};

// ¡¡REAL!!
export const approveStore = async (storeId: number | string): Promise<any> => {
  const APPROVE_ENDPOINT = `/web/superadmin/${storeId}/approve`;
  try {
    const data = await fetchWithAuth(APPROVE_ENDPOINT, { method: 'PATCH' });
    return data;
  } catch (error) {
    console.error(`Fallo al aprobar tienda ${storeId}:`, error);
   if (error instanceof Error) throw new Error(error.message);
    throw new Error("No se pudo aprobar la tienda.");
  }
};

// ¡¡REAL!!
export const rejectStore = async (storeId: number | string): Promise<any> => {
  const REJECT_ENDPOINT = `/web/superadmin/${storeId}/reject`;
  try {
    const data = await fetchWithAuth(REJECT_ENDPOINT, { method: 'PATCH' });
    return data;
  } catch (error) {
    console.error(`Fallo al rechazar tienda ${storeId}:`, error);
    if (error instanceof Error) throw new Error(error.message);
    throw new Error("No se pudo rechazar la tienda.");
  }
};

// ¡¡REAL!!
export const getAdminUsers = async (): Promise<User[]> => {
  const USERS_ENDPOINT = '/users';
  try {
    const data: GetUsersResponse = await fetchWithAuth(USERS_ENDPOINT, { method: 'GET' });
    return data.data || [];
  } catch (error) {
    console.error("Fallo al obtener usuarios:", error);
    if (error instanceof Error) throw new Error(error.message);
    throw new Error("No se pudieron cargar los usuarios.");
  }
};

// ¡¡REAL!!
export const getAdminStoreById = async (storeId: string): Promise<Store> => {
  const STORE_ENDPOINT = `/web/superadmin/store/${storeId}`;
  try {
    // Tu API devuelve { statusCode, message, data: Store }
    const response = await fetchWithAuth(STORE_ENDPOINT, { method: 'GET' });
    if (!response.data) {
        throw new Error("La respuesta de la API no contiene el objeto 'data'.");
    }
    return response.data as Store;
  } catch (error) {
    console.error("Fallo al obtener detalles de la tienda:", error);
    if (error instanceof Error) throw new Error(error.message);
    throw new Error("No se pudieron cargar los detalles de la tienda.");
  }
};

// --- ¡¡NUEVA FUNCIÓN SIMULADA!! ---
// (Tu API no tiene un endpoint de stats por ID de tienda)
export const getAdminStoreStatsById = async (storeId: string): Promise<StoreStatsData> => {
  console.warn(`--- getAdminStoreStatsById(${storeId}) es SIMULADA ---`);
  console.log("Endpoint real (ej. /web/superadmin/store/{id}/stats) necesita ser creado.");
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Devuelve datos mock (los mismos que el dashboard de tienda)
  return {
    total_sales: 88,
    total_revenue: 73906.92,
    average_ticket: 839.85,
    total_products: 1539,
    low_stock: 0,
    highest_selling_product: { productId: 1006, productName: "Unbranded Cotton Shoes", units_sold: 34, revenue: "10201.90" },
    lowest_selling_product: { productId: 1007, productName: "Awesome Concrete Car", units_sold: 1, revenue: "462.79" },
    best_stocked_product: { productId: 1014, productName: "Ergonomic Silk Tuna", quantity: 184 },
    worst_stocked_product: { productId: 1007, productName: "Awesome Concrete Car", quantity: 11 },
    last_sales: [ { productName: "Electronic Steel Bike", total: "41.78", quantity: 2, createdAt: "2025-11-02T20:13:30.877Z" } ]
  };
};