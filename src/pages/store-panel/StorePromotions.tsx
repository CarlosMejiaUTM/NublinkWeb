// FileName: StorePromotions.tsx
// Path: src/pages/store-panel/StorePromotions.tsx
import React from 'react';
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";

const StorePromotionsPage = () => {
    return (
        <>
            <div className="flex justify-end mb-6">
                <Button disabled>+ Crear Nueva Promoción</Button>
            </div>
            <Card title="Promociones (Simulado)">
                 <div className="h-64 bg-secondary rounded-lg border border-line-light flex items-center justify-center">
                    <p className="text-text-muted text-sm">Página en Construcción. La API para `GET /promotions` aún no está conectada.</p>
                </div>
            </Card>
        </>
    );
};
export default StorePromotionsPage;