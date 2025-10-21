// FileName: StoreReports.tsx
// Path: src/pages/store-panel/StoreReports.tsx

import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";

const StoreReportsPage = () => {
    return (
        <DashboardLayout
            pageTitle="Reports"
            pageDescription="Detailed statistics about your store's performance."
        >
            <div className="flex justify-end mb-6">
                <Button variant="secondary">Export Data (PDF/Excel)</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Reporte 1: Ventas por Periodo */}
                <Card title="Sales Over Time">
                    {/* Placeholder para filtros de fecha */}
                    <div className="mb-4 text-sm text-text-muted">Filters: [Last 7 Days] [Last 30 Days] [Custom Range]</div>
                    <div className="h-64 bg-secondary rounded-lg border border-line-light flex items-center justify-center">
                        <p className="text-text-muted text-sm">[ Sales Chart Placeholder ]</p>
                    </div>
                </Card>

                {/* Reporte 2: Ranking de Productos */}
                <Card title="Top Performing Products">
                     <p className="text-text-muted text-sm mb-4">Based on sales volume or scans.</p>
                     <ul className="space-y-2 text-sm">
                        <li>1. Taladro Inalámbrico 20V - 50 units sold</li>
                        <li>2. Juego de Desarmadores - 120 units sold</li>
                        <li>3. Sierra Circular Eléctrica - 35 units sold</li>
                     </ul>
                </Card>

                 {/* Reporte 3: Comparativa Ventas vs Apartados */}
                 <Card title="Sales vs. Reservations">
                     <div className="h-64 bg-secondary rounded-lg border border-line-light flex items-center justify-center">
                        <p className="text-text-muted text-sm">[ Comparison Chart Placeholder ]</p>
                    </div>
                 </Card>
            </div>
        </DashboardLayout>
    );
};

export default StoreReportsPage;