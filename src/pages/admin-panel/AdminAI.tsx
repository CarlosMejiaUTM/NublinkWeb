// FileName: AdminAI.tsx
// Path: src/pages/admin-panel/AdminAI.tsx
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/common/Card";

const AdminAIPage = () => (
    <DashboardLayout pageTitle="Global AI Insights" pageDescription="Platform-wide trends and recommendations.">
        <Card title="Consumption Trends">
             <p className="text-text-muted">AI insights placeholder...</p>
             {/* Aquí irían los análisis de tendencias */}
        </Card>
    </DashboardLayout>
);
export default AdminAIPage;