// FileName: index.ts
// Path: src/types/index.ts

import type { RawData } from "@/services/api";

/* ============================================================
   📦 TIPOS BASADOS EN RESPUESTAS REALES DE TU API
   ============================================================ */

// --- TIPOS DE ESTADÍSTICAS DE TIENDA ---
interface ProductStat {
  productId: number;
  productName: string;
  units_sold?: number;
  revenue?: string;
  quantity?: number;
}

interface SaleStat {
  productName: string;
  total: string;
  quantity: number;
  createdAt: string;
}

export interface StoreStatsData {
  total_sales: number;
  total_revenue: number;
  average_ticket: number;
  total_products: number;
  low_stock: number;
  highest_selling_product: ProductStat;
  lowest_selling_product: ProductStat;
  best_stocked_product: ProductStat;
  worst_stocked_product: ProductStat;
  last_sales: SaleStat[];
}

export interface GetStoreStatsResponse {
  ok: boolean;
  data: StoreStatsData;
}

/* ============================================================
   👑 DASHBOARD ADMIN
   ============================================================ */
export interface AdminDashboardSummary {
  usuarios: { total: number };
  tiendas: { total: number; activas: number; pendientes: number };
  stripe: { suscripciones_activas: number };
}

/* ============================================================
   🏪 TIENDAS Y USUARIOS
   ============================================================ */
export interface Store {
  id: number;
  business_name: string;
  owner_name: string;
  address: string;
  map_url?: string | null;
  longitude?: number | string | null;
  latitude?: number | string | null;
  longitud?: number | string | null;  // ✅ AGREGAR para compatibilidad API
  latitud?: number | string | null;   // ✅ AGREGAR para compatibilidad API
  description?: string | null;
  category?: string | null;
  category_id?: number | null;
  status: 'pending' | 'approved' | 'active' | 'rejected' | string;
  is_verified: boolean;
  schedule?: string;
  phone?: string;
  logo_url?: string;
  cover_image_url?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  username: string | null;
  role: 'store' | 'superadmin' | 'client';
  created_at: string;
  store: Store | null;
  detail?: any;
}

/* ============================================================
   🏷️ CATEGORÍAS
   ============================================================ */
export interface Category {
  id: number;
  name: string;
  description: string;
}

/* ============================================================
   🔢 RESPUESTAS GENERALES
   ============================================================ */
export interface GetUsersResponse {
  statusCode: number;
  message: string;
  total: number;
  data: User[];
}

export interface GetProductsResponse {
  statusCode: number;
  message: string;
  total: number;
  data: Product[];
}

export interface GetStoresResponse {
  statusCode: number;
  message: string;
  total: number;
  data: Store[];
}

/* ============================================================
   🛒 PRODUCTOS, PEDIDOS Y MÁS
   ============================================================ */
export interface Product {
  id: string | number;
  name: string;
  description?: string;
  category_id?: number;
  store_id?: number;
  price: number;
  stock: number;
  imageUrl?: string;
  status?: 'Activo' | 'Inactivo' | 'Borrador' | string;
  barcode?: string;

  category?: Category;
}

export interface Order {
  id: string;
  clientName: string;
  productName: string;
  date: string;
  status: 'Pendiente' | 'Confirmado' | 'Pagado' | 'Entregado' | 'Cancelado';
}

export interface Promotion { /* ... */ }

/* ============================================================
   📊 DASHBOARD SIMULADO (DEMO)
   ============================================================ */
export interface DashboardStats {
  todaySales: { value: number; change: number };
  monthSales: { value: number; change: number };
  pendingOrders: { value: number; change: number };
  lowStockItems: { value: number; change: number };
}

export interface KeyMetrics {
  salesTrend: {
    percentChange: number;
    data: { label: string; value: number }[];
  };
  topScannedProducts: {
    totalScans: number;
    change: number;
    products: { id: string; name: string; percentage: number }[];
  };
}

export interface Transaction { /* ... */ }
export interface SupportTicket { /* ... */ }

/* ============================================================
   🧾 REGISTRO DE TIENDA
   ============================================================ */
export interface StoreRegistrationData {
  business_name: string;
  owner_name: string;
  address: string;
  map_url: string;
  longitude: string;
  latitude: string;
  description: string;
  category_id: number;
  status: "pending";

  user_name: string;
  user_email: string;
  password: string;
  phone: string | null;
  username: string | null;
  role: "store";

  plan_id: string;
  payment_method_id: string;
}

/* ============================================================
   🔚 FIN DEL ARCHIVO
   ============================================================ */
export interface AIRecommendation {
  top_products: any[];
  low_products: any[];
  executive_summary: string[];
}
export interface FullAPIResponse {
  data: RawData;
  ai_parsed: AIRecommendation;
}
