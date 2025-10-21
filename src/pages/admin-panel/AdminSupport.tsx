// FileName: AdminSupport.tsx
// Path: src/pages/admin-panel/AdminSupport.tsx
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/common/Card";

const AdminSupportPage = () => (
    <DashboardLayout pageTitle="Support & Content" pageDescription="Manage support tickets and platform content.">
        <Card title="Support Tickets">
             <p className="text-text-muted">Support tickets placeholder...</p>
             {/* Aquí iría la gestión de tickets */}
        </Card>
    </DashboardLayout>
);
export default AdminSupportPage;