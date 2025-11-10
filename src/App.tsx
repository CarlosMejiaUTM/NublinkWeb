// FileName: App.tsx
// Path: src/App.tsx

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/common/ProtectedRoute';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';
import AdminDashboardLayout from './layouts/AdminDashboardLayout';

// Páginas Públicas
import LandingPage from './pages/Landing';
import LoginPage from './pages/auth/Login';
import StoreRegistrationPage from './pages/auth/StoreRegistration';

// Páginas Tienda
import StoreDashboardPage from './pages/store-panel/StoreDashboard';
import StoreProductsPage from './pages/store-panel/StoreProducts';
import StoreOrdersPage from './pages/store-panel/StoreOrders';
import StoreRecommendationsPage from './pages/store-panel/StoreRecommendations';
import StoreReportsPage from './pages/store-panel/StoreReports';
import StorePromotionsPage from './pages/store-panel/StorePromotions';
import StoreSettingsPage from './pages/store-panel/StoreSettings';
import PendingStore from './pages/store-panel/PendingStore';
import RejectedStore from './pages/store-panel/RejectedStore';

// Páginas Admin
import AdminDashboardPage from './pages/admin-panel/AdminDashboard';
import AdminStoresPage from './pages/admin-panel/AdminStores';
import AdminUsersPage from './pages/admin-panel/AdminUsers';
import AdminGlobalProductsPage from './pages/admin-panel/AdminGlobalProducts';
import AdminAIPage from './pages/admin-panel/AdminAI';
import AdminPaymentsPage from './pages/admin-panel/AdminPayments';
import AdminSupportPage from './pages/admin-panel/AdminSupport';
import AdminStoreDetailPage from './pages/admin-panel/AdminStoreDetail'; // ✅ nueva página

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
  return (
    <BrowserRouter>
      <Routes>
        {/*  PÚBLICAS */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro-tienda" element={<StoreRegistrationPage />} />

        {/*  PANEL TIENDA */}
        {[
          { path: 'dashboard', el: <StoreDashboardPage />, t: 'Inicio', d: 'Resumen del rendimiento de tu tienda.' },
          { path: 'productos', el: <StoreProductsPage />, t: 'Productos', d: 'Administra el inventario de tu tienda.' },
          { path: 'pedidos', el: <StoreOrdersPage />, t: 'Pedidos y Apartados', d: 'Gestiona las reservas y compras.' },
          { path: 'recomendaciones', el: <StoreRecommendationsPage />, t: 'Recomendaciones IA', d: 'Optimiza precios, promociones y stock.' },
          { path: 'reportes', el: <StoreReportsPage />, t: 'Reportes', d: 'Estadísticas detalladas de rendimiento.' },
          { path: 'promociones', el: <StorePromotionsPage />, t: 'Promociones', d: 'Crea y gestiona descuentos.' },
          { path: 'configuracion', el: <StoreSettingsPage />, t: 'Configuración', d: 'Administra el perfil de tu tienda y cuenta.' },
        ].map(({ path, el, t, d }) => (
          <Route
            key={path}
            path={`/tienda/${path}`}
            element={<StoreLayoutWrapper pageTitle={t} pageDescription={d}>{el}</StoreLayoutWrapper>}
          />
        ))}

        {/* Estados de tienda */}
        <Route path="/tienda/pendiente" element={<ProtectedRoute allowedRoles={['store']}><PendingStore /></ProtectedRoute>} />
        <Route path="/tienda/rechazada" element={<ProtectedRoute allowedRoles={['store']}><RejectedStore /></ProtectedRoute>} />

        {/* PANEL ADMIN */}
        {[
          { path: 'dashboard', el: <AdminDashboardPage />, t: 'Dashboard de Administrador', d: 'Resumen global de la plataforma.' },
          { path: 'tiendas', el: <AdminStoresPage />, t: 'Gestionar Tiendas', d: 'Aprobar o rechazar nuevas tiendas.' },
          { path: 'usuarios', el: <AdminUsersPage />, t: 'Gestionar Usuarios', d: 'Ver todos los usuarios de la plataforma.' },
          { path: 'productos-globales', el: <AdminGlobalProductsPage />, t: 'Productos Globales', d: 'Catálogo maestro de productos.' },
          { path: 'ia-global', el: <AdminAIPage />, t: 'Módulo IA Global', d: 'Insights de tendencias de consumo.' },
          { path: 'pagos', el: <AdminPaymentsPage />, t: 'Pagos y Comisiones', d: 'Monitor de transacciones y finanzas.' },
          { path: 'soporte', el: <AdminSupportPage />, t: 'Soporte y Contenido', d: 'Gestionar tickets y FAQs.' },
        ].map(({ path, el, t, d }) => (
          <Route
            key={path}
            path={`/admin/${path}`}
            element={<AdminLayoutWrapper pageTitle={t} pageDescription={d}>{el}</AdminLayoutWrapper>}
          />
        ))}

        {/* Nueva ruta: Detalle de tienda */}
        <Route
          path="/admin/tienda/:id"
          element={
            <AdminLayoutWrapper pageTitle="Detalle de Tienda" pageDescription="Información y estadísticas de la tienda seleccionada.">
              <AdminStoreDetailPage />
            </AdminLayoutWrapper>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
