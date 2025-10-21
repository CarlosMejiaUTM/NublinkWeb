// FileName: StoreRecommendations.tsx
// Path: src/pages/store-panel/StoreRecommendations.tsx

import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";

const StoreRecommendationsPage = () => {
    return (
        <DashboardLayout
            pageTitle="AI Recommendations"
            pageDescription="Optimize prices, promotions, and stock based on data insights."
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* Card 1: Sugerencias de Precios */}
                <Card title="Price Suggestions">
                    <ul className="space-y-3 text-sm">
                        <li className="flex justify-between items-center">
                            <span>Increase 5% on Hammers <span className="text-xs text-green-500">(High Demand)</span></span>
                            <Button size="sm">Apply</Button>
                        </li>
                        <li className="flex justify-between items-center">
                            <span>Decrease 3% on Drills <span className="text-xs text-red-500">(Low Demand)</span></span>
                            <Button size="sm">Apply</Button>
                        </li>
                    </ul>
                    <p className="mt-4 text-xs text-text-muted">Suggestions based on current market trends and competitor pricing.</p>
                </Card>

                {/* Card 2: Predicción de Demanda */}
                <Card title="Demand Forecast">
                    <p className="text-text-muted text-sm mb-4">Expected sales for the upcoming week.</p>
                    <div className="h-40 bg-secondary rounded-lg flex items-center justify-center border border-line-light">
                        <p className="text-text-muted text-sm">[ Weekly Demand Chart Placeholder ]</p>
                    </div>
                </Card>

                {/* Card 3: Productos con Baja Rotación */}
                <Card title="Slow-Moving Products">
                     <p className="text-text-muted text-sm mb-4">Consider promoting these items.</p>
                     <ul className="space-y-2 text-sm">
                        <li>Old Model Screwdriver Set - Suggest: 10% Discount</li>
                        <li>Generic Paint Roller - Suggest: Bundle with Paint</li>
                     </ul>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default StoreRecommendationsPage;