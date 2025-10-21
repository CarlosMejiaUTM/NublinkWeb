// FileName: AdminUsers.tsx
// Path: src/pages/admin-panel/AdminUsers.tsx
import DashboardLayout from "../../layouts/DashboardLayout"; // Reutiliza el layout principal por ahora
import Card from "../../components/common/Card";

const AdminUsersPage = () => (
    <DashboardLayout pageTitle="Manage Users" pageDescription="View and manage user accounts.">
        <Card title="User List">
            <p className="text-text-muted">User table placeholder...</p>
            {/* Aquí iría la tabla de usuarios */}
        </Card>
    </DashboardLayout>
);
export default AdminUsersPage;