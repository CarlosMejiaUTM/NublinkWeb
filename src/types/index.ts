// FileName: index.ts
// Path: src/types/index.ts

// --- TIPOS BASADOS EN TU RESPUESTA DE API ---

// ¡NUEVO TIPO! Basado en GET /web/stores/mine/stats
interface ProductStat {
  productId: number;
  productName: string;
  units_sold?: number; // Para más vendidos
  revenue?: string;
  quantity?: number; // Para stock
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
// Respuesta completa de GET /web/stores/mine/stats
export interface GetStoreStatsResponse {
  ok: boolean;
  data: StoreStatsData;
}
// --- FIN NUEVOS TIPOS DE STATS ---


// ¡TIPO ACTUALIZADO! Basado en GET /web/superadmin/admin/stats
export interface AdminDashboardSummary {
  usuarios: {
    total: number;
  };
  tiendas: {
    total: number;
    activas: number;
    pendientes: number;
  };
  stripe: {
    suscripciones_activas: number;
  };
}


export interface Store {
  id: number;
  business_name: string;
  owner_name: string;
  address: string;
  map_url: string | null;
  longitude: number | null;
  latitude: number | null;
  description: string | null;
  status: 'pending' | 'active' | 'rejected' | string;
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
}
export interface Category {
  id: number;
  name: string;
  description: string;
}
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

// --- Tipos de la App ---
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
}
export interface Order {
    id: string;
    clientName: string;
    productName: string;
    date: string;
    status: 'Pendiente' | 'Confirmado' | 'Pagado' | 'Entregado' | 'Cancelado';
}
export interface Promotion { /* ... */ }

// --- Tipos de Dashboard (Usados por partes SIMULADAS) ---
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


// --- TIPO DE REGISTRO DE TIENDA (AJUSTADO A TU API REAL) ---
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
  password: string,
  phone: string | null;
  username: string | null;
  role: "store";
  
  plan_id: string;
  payment_method_id: string;
}