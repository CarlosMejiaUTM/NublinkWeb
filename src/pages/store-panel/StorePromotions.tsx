// FileName: StorePromotions.tsx
// Path: src/pages/store-panel/StorePromotions.tsx

import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import { Promotion } from "../../types"; // Importa el tipo

// Datos Mock
const mockPromotions: Promotion[] = [
    { id: 'promo1', name: 'Weekend Drill Discount', type: 'Descuento %', productIds: ['1'], startDate: '2025-10-24', endDate: '2025-10-26', status: 'Activa', discountValue: 15 },
    { id: 'promo2', name: 'Hammer Special', type: 'Precio Fijo', productIds: ['3'], startDate: '2025-10-20', endDate: '2025-10-31', status: 'Activa', discountValue: 200 },
];

const statusStyles: { [key in Promotion['status']]: string } = {
    'Activa': 'bg-green-100 text-green-700',
    'Inactiva': 'bg-gray-100 text-gray-700',
    'Programada': 'bg-blue-100 text-blue-700',
};

const StorePromotionsPage = () => {
    return (
        <DashboardLayout
            pageTitle="Promotions"
            pageDescription="Create and manage discounts for your products."
        >
            <div className="flex justify-end mb-6">
                <Button>+ Create New Promotion</Button>
            </div>

            <Card className="overflow-hidden p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-secondary text-text-main">
                            <tr>
                                <th className="p-4 font-semibold">Promotion Name</th>
                                <th className="p-4 font-semibold">Type</th>
                                <th className="p-4 font-semibold">Duration</th>
                                <th className="p-4 font-semibold">Status</th>
                                <th className="p-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockPromotions.map((promo) => (
                                <tr key={promo.id} className="border-t border-line-light hover:bg-secondary-light">
                                    <td className="p-4 font-medium text-text-main">{promo.name}</td>
                                    <td className="p-4 text-text-muted">{promo.type} {promo.discountValue ? `(${promo.type === 'Descuento %' ? `${promo.discountValue}%` : `$${promo.discountValue}`})` : ''}</td>
                                    <td className="p-4 text-text-muted">{promo.startDate} - {promo.endDate}</td>
                                    <td className="p-4">
                                        <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full ${statusStyles[promo.status]}`}>
                                            {promo.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right space-x-2">
                                        <Button variant="secondary" size="sm">Edit</Button>
                                        <Button variant="danger" size="sm">Delete</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </DashboardLayout>
    );
};

export default StorePromotionsPage;