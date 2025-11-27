// FileName: App.tsx
// Path: src/App.tsx

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/common/ProtectedRoute';
import './styles/theme.css';

// Layouts
import AdminDashboardLayout from './layouts/AdminDashboardLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRecommendationsRoute from './layouts/ProtectedRecommendationsRoute';

// Páginas Públicas
import LandingPage from './pages/Landing';
import LoginPage from './pages/auth/Login';
import StoreRegistrationPage from './pages/auth/StoreRegistration';

// *** NUEVAS PANTALLAS RECOVERY ***
import RecoveryRequestPage from './pages/auth/RecoveryRequestPage';
import RecoveryVerifyPage from './pages/auth/RecoveryVerifyPage';
import AdminResetPasswordPage from './pages/admin-panel/AdminResetPasswordPage';

// Páginas Tienda
import PendingStore from './pages/store-panel/PendingStore';
import RejectedStore from './pages/store-panel/RejectedStore';
import StoreDashboardPage from './pages/store-panel/StoreDashboard';
import StoreOrdersPage from './pages/store-panel/StoreOrders';
import StorePromotionsPage from './pages/store-panel/StorePromotions';
import StoreRecommendationsPage from './pages/store-panel/StoreRecommendations';
import StoreReportsPage from './pages/store-panel/StoreReports';
import StoreSettingsPage from './pages/store-panel/StoreSettings';
import StoreProductsPage from './pages/store-panel/products/StoreProducts';

// Páginas Admin
import UpgradePlanPage from './layouts/UpgradePlanPage';
import AdminAIPage from './pages/admin-panel/AdminAI';
import AdminDashboardPage from './pages/admin-panel/AdminDashboard';
import AdminGlobalProductsPage from './pages/admin-panel/AdminGlobalProducts';
import AdminPaymentsPage from './pages/admin-panel/AdminPayments';
import AdminStoreDetailPage from './pages/admin-panel/AdminStoreDetail';
import AdminStoresPage from './pages/admin-panel/AdminStores';
import AdminSupportPage from './pages/admin-panel/AdminSupport';
import AdminUsersPage from './pages/admin-panel/AdminUsers';
import ProtectedReportRoute from './layouts/ProtectedReportRoute';
import ProtectedPromotionsRoute from './layouts/ProtectedPromotionRoute';

// === Helpers para Layouts ===
const StoreLayoutWrapper = ({ children, pageTitle, pageDescription }: { children: React.ReactNode; pageTitle: string; pageDescription?: string }) => (
  <ProtectedRoute allowedRoles={['store']}>
    <DashboardLayout pageTitle={pageTitle} pageDescription={pageDescription}>
      {children}
    </DashboardLayout>
  </ProtectedRoute>
);

const AdminLayoutWrapper = ({ children, pageTitle, pageDescription }: { children: React.ReactNode; pageTitle: string; pageDescription?: string }) => (
  <ProtectedRoute allowedRoles={['superadmin']}>
    <AdminDashboardLayout pageTitle={pageTitle} pageDescription={pageDescription}>
      {children}
    </AdminDashboardLayout>
  </ProtectedRoute>
);

function App() {
  console.log('🚀 App.tsx cargado correctamente');
  
  return (
    <BrowserRouter>
      <Routes>

        {/*  PÚBLICAS */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro-tienda" element={<StoreRegistrationPage />} />

        {/* ⭐ NUEVAS RUTAS RECOVERY ⭐ */}
        <Route path="/recuperar" element={<RecoveryRequestPage />} />
        <Route path="/recuperar/verificar" element={<RecoveryVerifyPage />} />

        {/* PANEL TIENDA */}
        <Route
          path="/tienda/dashboard"
          element={<StoreLayoutWrapper pageTitle="Inicio" pageDescription="Resumen del rendimiento de tu tienda."><StoreDashboardPage /></StoreLayoutWrapper>}
        />
        <Route
          path="/tienda/productos"
          element={<StoreLayoutWrapper pageTitle="Productos" pageDescription="Administra el inventario de tu tienda."><StoreProductsPage /></StoreLayoutWrapper>}
        />
        <Route
          path="/tienda/pedidos"
          element={<StoreLayoutWrapper pageTitle="Pedidos y Apartados" pageDescription="Gestiona las reservas y compras."><StoreOrdersPage /></StoreLayoutWrapper>}
        />
        <Route
          path="/tienda/reportes"
          element={
            <StoreLayoutWrapper pageTitle="Reportes IA" pageDescription="Dale un seguimiento a tus productos y visualiza datos reales.">
              <ProtectedReportRoute>
                <StoreReportsPage />
              </ProtectedReportRoute>
            </StoreLayoutWrapper>
          }
        />
        <Route
          path="/tienda/reportes"
          element={<StoreLayoutWrapper pageTitle="Reportes" pageDescription="Estadísticas detalladas de rendimiento."><StoreReportsPage /></StoreLayoutWrapper>}
        />
        <Route
          path="/tienda/promociones"
          element={
            <StoreLayoutWrapper pageTitle="Promociones IA" pageDescription="Crea y gestiona descuentos.">
              <ProtectedPromotionsRoute>
                <StorePromotionsPage />
              </ProtectedPromotionsRoute>
            </StoreLayoutWrapper>
          }
        />
        <Route
          path="/tienda/configuracion"
          element={<StoreLayoutWrapper pageTitle="Configuración" pageDescription="Administra el perfil de tu tienda y cuenta."><StoreSettingsPage /></StoreLayoutWrapper>}
        />

        {/* Mejorar plan */}
        <Route
          path="/tienda/mejorar-plan"
          element={
            <ProtectedRoute allowedRoles={['store']}>
              <DashboardLayout pageTitle="Mejorar Plan" pageDescription="Actualiza tu suscripción a Premium.">
                <UpgradePlanPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Recomendaciones IA */}
        <Route
          path="/tienda/recomendaciones"
          element={
            <StoreLayoutWrapper pageTitle="Recomendaciones IA" pageDescription="Optimiza precios, promociones y stock.">
              <ProtectedRecommendationsRoute>
                <StoreRecommendationsPage />
              </ProtectedRecommendationsRoute>
            </StoreLayoutWrapper>
          }
        />

        {/* Estados tienda */}
        <Route path="/tienda/pendiente" element={<ProtectedRoute allowedRoles={['store']}><PendingStore /></ProtectedRoute>} />
        <Route path="/tienda/rechazada" element={<ProtectedRoute allowedRoles={['store']}><RejectedStore /></ProtectedRoute>} />

        {/* PANEL ADMIN */}
        <Route
          path="/admin/dashboard"
          element={<AdminLayoutWrapper pageTitle="Dashboard de Administrador" pageDescription="Resumen global de la plataforma."><AdminDashboardPage /></AdminLayoutWrapper>}
        />
        <Route
          path="/admin/tiendas"
          element={<AdminLayoutWrapper pageTitle="Gestionar Tiendas" pageDescription="Aprobar o rechazar nuevas tiendas."><AdminStoresPage /></AdminLayoutWrapper>}
        />
        <Route
          path="/admin/usuarios"
          element={<AdminLayoutWrapper pageTitle="Gestionar Usuarios" pageDescription="Ver todos los usuarios de la plataforma."><AdminUsersPage /></AdminLayoutWrapper>}
        />
        <Route
          path="/admin/productos-globales"
          element={<AdminLayoutWrapper pageTitle="Productos Globales" pageDescription="Catálogo maestro de productos."><AdminGlobalProductsPage /></AdminLayoutWrapper>}
        />
        <Route
          path="/admin/ia-global"
          element={<AdminLayoutWrapper pageTitle="Módulo IA Global" pageDescription="Insights de tendencias de consumo."><AdminAIPage /></AdminLayoutWrapper>}
        />
        <Route
          path="/admin/pagos"
          element={<AdminLayoutWrapper pageTitle="Pagos y Comisiones" pageDescription="Monitor de transacciones y finanzas."><AdminPaymentsPage /></AdminLayoutWrapper>}
        />
        <Route
          path="/admin/soporte"
          element={<AdminLayoutWrapper pageTitle="Soporte y Contenido" pageDescription="Gestionar tickets y FAQs."><AdminSupportPage /></AdminLayoutWrapper>}
        />
        <Route
          path="/admin/tienda/:id"
          element={<AdminLayoutWrapper pageTitle="Detalle de Tienda" pageDescription="Información y estadísticas de la tienda seleccionada."><AdminStoreDetailPage /></AdminLayoutWrapper>}
        />

        {/* ⭐ NUEVA RUTA ADMIN RESET PASSWORD ⭐ */}
        <Route
          path="/admin/reset-password/:id"
          element={
            <AdminLayoutWrapper pageTitle="Resetear Contraseña" pageDescription="Restablece la contraseña de un usuario.">
              <AdminResetPasswordPage />
            </AdminLayoutWrapper>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
