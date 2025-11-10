// File: src/services/api/admin.ts

import { fetchWithAuth } from './helpers';
import type {
  AdminDashboardSummary,
  GetStoresResponse,
  GetUsersResponse,
  GetProductsResponse,
  StoreStatsData,
  Store,
  User,
  Product
} from '../../types';

/**
 * 📊 Dashboard general del SuperAdmin
 */
export const getAdminDashboardData = async (): Promise<AdminDashboardSummary> => {
  const STATS_ENDPOINT = '/web/superadmin/admin/stats';
  const response = await fetchWithAuth(STATS_ENDPOINT, { method: 'GET' });
  if (response && response.data) return response.data as AdminDashboardSummary;
  throw new Error("La respuesta no contiene 'data'.");
};

/**
 * 🏬 Obtener todas las tiendas
 */
export const getAdminAllStores = async (): Promise<Store[]> => {
  const data: GetStoresResponse = await fetchWithAuth('/web/stores', { method: 'GET' });
  return data.data || [];
};

/**
 * 🛒 Obtener todos los productos
 */
export const getAdminAllProducts = async (): Promise<Product[]> => {
  const data: GetProductsResponse = await fetchWithAuth('/products', { method: 'GET' });
  return data.data || [];
};

/**
 * 🕓 Tiendas pendientes
 */
export const getAdminPendingStores = async (): Promise<Store[]> => {
  const data: GetStoresResponse = await fetchWithAuth('/web/superadmin/pending', { method: 'GET' });
  return data.data || [];
};

/**
 * ✅ Tiendas aprobadas
 */
export const getAdminApprovedStores = async (): Promise<Store[]> => {
  const data: GetStoresResponse = await fetchWithAuth('/web/superadmin/approved', { method: 'GET' });
  return data.data || [];
};

/**
 * ❌ Tiendas rechazadas
 */
export const getAdminRejectedStores = async (): Promise<Store[]> => {
  const data: GetStoresResponse = await fetchWithAuth('/web/superadmin/rejected', { method: 'GET' });
  return data.data || [];
};

/**
 * 🟢 Aprobar una tienda
 */
export const approveStore = async (storeId: number | string): Promise<any> => {
  return await fetchWithAuth(`/web/superadmin/${storeId}/approve`, { method: 'PATCH' });
};

/**
 * 🔴 Rechazar una tienda
 */
export const rejectStore = async (storeId: number | string): Promise<any> => {
  return await fetchWithAuth(`/web/superadmin/${storeId}/reject`, { method: 'PATCH' });
};

/**
 * 👤 Obtener todos los usuarios
 */
export const getAdminUsers = async (): Promise<User[]> => {
  const data: GetUsersResponse = await fetchWithAuth('/users', { method: 'GET' });
  return data.data || [];
};

/**
 * 🧩 Obtener detalle completo de una tienda (SuperAdmin)
 * Combina información del store + usuario propietario.
 */
export const getAdminStoreById = async (storeId: string): Promise<Store & { user?: User }> => {
  const response = await fetchWithAuth(`/web/superadmin/store/${storeId}`, { method: 'GET' });
  if (!response || !response.data) throw new Error("La respuesta no contiene 'data'.");

  // Aseguramos compatibilidad: algunos endpoints devuelven { store, user }
  const store = response.data.store || response.data;
  const user = response.data.user || response.data.owner || null;

  return {
    ...store,
    user: user
      ? {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        }
      : undefined,
  };
};

/**
 * 📈 Obtener estadísticas simuladas de una tienda por ID
 * (Hasta que el backend tenga endpoint real)
 */
export const getAdminStoreStatsById = async (storeId: string): Promise<StoreStatsData> => {
  await new Promise((res) => setTimeout(res, 500)); // Simulamos delay

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
