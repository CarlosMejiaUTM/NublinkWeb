// FileName: index.ts
// Path: src/types/index.ts

// Tipos base
export interface Store {
  id: string;
  name: string;
  ownerName: string; // Propietario
  email: string;
  status: 'Activa' | 'Pendiente' | 'Suspendida';
  registrationDate: string;
  // Añadir más detalles si es necesario (tipo de negocio, RFC, etc.)
}

export interface Product {
  id: string;
  imageUrl?: string; // Opcional si no siempre hay imagen
  name: string;
  description?: string;
  category?: string;
  price: number;
  stock: number;
  status: 'Activo' | 'Inactivo' | 'Borrador'; // Estado 'Borrador' añadido
  barcode?: string; // Código de barras
  discount?: number; // Descuento porcentual o fijo
}

export interface Order {
    id: string; // ej: ORD-001
    clientName: string;
    productName: string;
    date: string; // ej: '2025-10-20'
    status: 'Pendiente' | 'Confirmado' | 'Pagado' | 'Entregado' | 'Cancelado'; // Estado 'Cancelado'
    // Añadir más detalles (cantidad, total, método pago, etc.)
}

export interface Promotion {
    id: string;
    name: string;
    type: 'Descuento %' | 'Precio Fijo' | 'Combo' | '2x1';
    productIds: string[]; // Productos a los que aplica
    startDate: string;
    endDate: string;
    status: 'Activa' | 'Inactiva' | 'Programada';
    discountValue?: number; // Porcentaje o monto fijo
}

// Tipos para Dashboards
export interface DashboardStats {
    todaySales: { value: number; change: number };
    monthSales: { value: number; change: number };
    pendingOrders: { value: number; change: number };
    lowStockItems: { value: number; change: number };
}

export interface KeyMetrics {
    salesTrend: {
        percentChange: number;
        // Data para gráfico (ej: ventas por semana)
        data: { label: string; value: number }[];
    };
    topScannedProducts: {
        totalScans: number;
        change: number;
        // Productos y su % de contribución a los escaneos
        products: { id: string; name: string; percentage: number }[];
    };
}

export interface AdminDashboardSummary {
    totalUsers: number;
    activeStores: number;
    pendingStores: number;
    totalProducts: number;
    totalTransactions: number;
    // Añadir datos para gráficos globales
}

// Tipos para Paneles de Admin
export interface User {
    id: string;
    name: string;
    email: string;
    registrationDate: string;
    totalScans: number;
    status: 'Activo' | 'Inactivo';
}

export interface Transaction {
    id: string;
    storeName: string;
    amount: number;
    commission: number;
    date: string;
    status: 'Pagado' | 'Pendiente' | 'Fallido';
}

export interface SupportTicket {
    id: string;
    subject: string;
    userName: string; // O storeName
    date: string;
    status: 'Abierto' | 'En Progreso' | 'Resuelto' | 'Cerrado';
    priority: 'Baja' | 'Media' | 'Alta';
}