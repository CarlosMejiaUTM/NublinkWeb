// FileName: App.tsx
// Path: src/App.tsx

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/common/ProtectedRoute';

// Layouts
import DashboardLayout from './layouts/DashboardLayout'; // Layout de Tienda
import AdminDashboardLayout from './layouts/AdminDashboardLayout'; // <-- ¡NUEVO LAYOUT!

// Páginas Públicas
import LandingPage from './pages/Landing';
import LoginPage from './pages/auth/Login';
import StoreRegistrationPage from './pages/auth/StoreRegistration';

// Páginas Panel de Tienda
import StoreDashboardPage from './pages/store-panel/StoreDashboard';
import StoreProductsPage from './pages/store-panel/StoreProducts';
import StoreOrdersPage from './pages/store-panel/StoreOrders';
import StoreRecommendationsPage from './pages/store-panel/StoreRecommendations';
import StoreReportsPage from './pages/store-panel/StoreReports';
import StorePromotionsPage from './pages/store-panel/StorePromotions';
import StoreSettingsPage from './pages/store-panel/StoreSettings';

// Páginas Panel de Admin
import AdminDashboardPage from './pages/admin-panel/AdminDashboard';
import AdminStoresPage from './pages/admin-panel/AdminStores';
import AdminUsersPage from './pages/admin-panel/AdminUsers';
import AdminGlobalProductsPage from './pages/admin-panel/AdminGlobalProducts';
import AdminAIPage from './pages/admin-panel/AdminAI';
import AdminPaymentsPage from './pages/admin-panel/AdminPayments';
import AdminSupportPage from './pages/admin-panel/AdminSupport';

// --- (Componente Helper para envolver rutas de Tienda) ---
const StoreLayoutWrapper = ({ children, pageTitle, pageDescription }: { children: React.ReactNode, pageTitle: string, pageDescription?: string }) => (
    <ProtectedRoute allowedRoles={['store']}>
        <DashboardLayout pageTitle={pageTitle} pageDescription={pageDescription}>
            {children}
        </DashboardLayout>
    </ProtectedRoute>
);

// --- (Componente Helper para envolver rutas de Admin) ---
const AdminLayoutWrapper = ({ children, pageTitle, pageDescription }: { children: React.ReactNode, pageTitle: string, pageDescription?: string }) => (
    <ProtectedRoute allowedRoles={['superadmin']}> {/* Usa 'superadmin' de tu API */}
        <AdminDashboardLayout pageTitle={pageTitle} pageDescription={pageDescription}>
            {children}
        </AdminDashboardLayout>
    </ProtectedRoute>
);


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* === Rutas Públicas === */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro-tienda" element={<StoreRegistrationPage />} />

        {/* === Rutas del Panel de Comercio (con Layout de Tienda) === */}
        <Route path="/tienda/dashboard" element={<StoreLayoutWrapper pageTitle="Inicio" pageDescription="Resumen del rendimiento de tu tienda."><StoreDashboardPage /></StoreLayoutWrapper>} />
        <Route path="/tienda/productos" element={<StoreLayoutWrapper pageTitle="Productos" pageDescription="Administra el inventario de tu tienda."><StoreProductsPage /></StoreLayoutWrapper>} />
        <Route path="/tienda/pedidos" element={<StoreLayoutWrapper pageTitle="Pedidos y Apartados" pageDescription="Gestiona las reservas y compras."><StoreOrdersPage /></StoreLayoutWrapper>} />
        <Route path="/tienda/recomendaciones" element={<StoreLayoutWrapper pageTitle="Recomendaciones IA" pageDescription="Optimiza precios, promociones y stock."><StoreRecommendationsPage /></StoreLayoutWrapper>} />
        <Route path="/tienda/reportes" element={<StoreLayoutWrapper pageTitle="Reportes" pageDescription="Estadísticas detalladas de rendimiento."><StoreReportsPage /></StoreLayoutWrapper>} />
        <Route path="/tienda/promociones" element={<StoreLayoutWrapper pageTitle="Promociones" pageDescription="Crea y gestiona descuentos."><StorePromotionsPage /></StoreLayoutWrapper>} />
        <Route path="/tienda/configuracion" element={<StoreLayoutWrapper pageTitle="Configuración" pageDescription="Administra el perfil de tu tienda y cuenta."><StoreSettingsPage /></StoreLayoutWrapper>} />
        
        {/* === Rutas del Panel de Admin (con Layout de Admin) === */}
        <Route path="/admin/dashboard" element={<AdminLayoutWrapper pageTitle="Dashboard de Administrador" pageDescription="Resumen global de la plataforma."><AdminDashboardPage /></AdminLayoutWrapper>} />
        <Route path="/admin/tiendas" element={<AdminLayoutWrapper pageTitle="Gestionar Tiendas" pageDescription="Aprobar o rechazar nuevas tiendas."><AdminStoresPage /></AdminLayoutWrapper>} />
        <Route path="/admin/usuarios" element={<AdminLayoutWrapper pageTitle="Gestionar Usuarios" pageDescription="Ver todos los usuarios de la plataforma."><AdminUsersPage /></AdminLayoutWrapper>} />
        <Route path="/admin/productos-globales" element={<AdminLayoutWrapper pageTitle="Productos Globales" pageDescription="Catálogo maestro de productos."><AdminGlobalProductsPage /></AdminLayoutWrapper>} />
        <Route path="/admin/ia-global" element={<AdminLayoutWrapper pageTitle="Módulo IA Global" pageDescription="Insights de tendencias de consumo."><AdminAIPage /></AdminLayoutWrapper>} />
        <Route path="/admin/pagos" element={<AdminLayoutWrapper pageTitle="Pagos y Comisiones" pageDescription="Monitor de transacciones y finanzas."><AdminPaymentsPage /></AdminLayoutWrapper>} />
        <Route path="/admin/soporte" element={<AdminLayoutWrapper pageTitle="Soporte y Contenido" pageDescription="Gestionar tickets y FAQs."><AdminSupportPage /></AdminLayoutWrapper>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;