// FileName: AdminPayments.tsx
// Path: src/pages/admin-panel/AdminPayments.tsx
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/common/Card";

const AdminPaymentsPage = () => (
    <DashboardLayout pageTitle="Payments & Commissions" pageDescription="Monitor transactions and manage finances.">
        <Card title="Transaction History">
             <p className="text-text-muted">Payments table placeholder...</p>
             {/* Aquí iría la tabla de transacciones */}
        </Card>
    </DashboardLayout>
);
export default AdminPaymentsPage;