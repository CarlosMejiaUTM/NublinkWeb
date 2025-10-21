// FileName: AdminGlobalProducts.tsx
// Path: src/pages/admin-panel/AdminGlobalProducts.tsx
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/common/Card";

const AdminGlobalProductsPage = () => (
    <DashboardLayout pageTitle="Global Product Management" pageDescription="Verify and manage products across all stores.">
        <Card title="All Products">
             <p className="text-text-muted">Global product table placeholder...</p>
             {/* Aquí iría la tabla global de productos */}
        </Card>
    </DashboardLayout>
);
export default AdminGlobalProductsPage;