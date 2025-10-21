// FileName: App.tsx
// Path: src/App.tsx

import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importación de Páginas Públicas
import LandingPage from './pages/Landing';
import LoginPage from './pages/auth/Login';
import StoreRegistrationPage from './pages/auth/StoreRegistration';

// Importación de Páginas del Panel de Tienda
import StoreDashboardPage from './pages/store-panel/StoreDashboard';
import StoreProductsPage from './pages/store-panel/StoreProducts';
import StoreOrdersPage from './pages/store-panel/StoreOrders';
import StoreRecommendationsPage from './pages/store-panel/StoreRecommendations';
import StoreReportsPage from './pages/store-panel/StoreReports';
import StorePromotionsPage from './pages/store-panel/StorePromotions';
import StoreSettingsPage from './pages/store-panel/StoreSettings';

// Placeholders para el Panel de Admin
import AdminDashboardPage from './pages/admin-panel/AdminDashboard';
import AdminStoresPage from './pages/admin-panel/AdminStores';
import AdminUsersPage from './pages/admin-panel/AdminUsers';
import AdminGlobalProductsPage from './pages/admin-panel/AdminGlobalProducts';
import AdminAIPage from './pages/admin-panel/AdminAI';
import AdminPaymentsPage from './pages/admin-panel/AdminPayments';
import AdminSupportPage from './pages/admin-panel/AdminSupport';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* === Rutas Públicas === */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro-tienda" element={<StoreRegistrationPage />} />

        {/* === Rutas del Panel de Comercio (Tienda) === */}
        <Route path="/tienda/dashboard" element={<StoreDashboardPage />} />
        <Route path="/tienda/productos" element={<StoreProductsPage />} />
        <Route path="/tienda/pedidos" element={<StoreOrdersPage />} />
        <Route path="/tienda/recomendaciones" element={<StoreRecommendationsPage />} />
        <Route path="/tienda/reportes" element={<StoreReportsPage />} />
        <Route path="/tienda/promociones" element={<StorePromotionsPage />} />
        <Route path="/tienda/configuracion" element={<StoreSettingsPage />} />

        {/* === Rutas del Panel de Administrador General === */}
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/tiendas" element={<AdminStoresPage />} />
        <Route path="/admin/usuarios" element={<AdminUsersPage />} />
        <Route path="/admin/productos-globales" element={<AdminGlobalProductsPage />} />
        <Route path="/admin/ia-global" element={<AdminAIPage />} />
        <Route path="/admin/pagos" element={<AdminPaymentsPage />} />
        <Route path="/admin/soporte" element={<AdminSupportPage />} />

        {/* === Ruta Catch-all (404 Not Found - Opcional) === */}
        {/* <Route path="*" element={<NotFoundPage />} /> */}

      </Routes>
    </BrowserRouter>
  );
}

export default App;