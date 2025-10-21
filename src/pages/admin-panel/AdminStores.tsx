// FileName: AdminStores.tsx
// Path: src/pages/admin-panel/AdminStores.tsx
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import { Store } from "../../types"; // Importa tipo Store

// Mock Data
const mockAdminStores: Store[] = [
    { id: 's1', name: 'Ferretería Don Pepe', ownerName: 'Pepe G.', email: 'pepe@...', status: 'Activa', registrationDate: '2025-10-15' },
    { id: 's2', name: 'Modas Anita', ownerName: 'Ana M.', email: 'ana@...', status: 'Pendiente', registrationDate: '2025-10-19' },
    { id: 's3', name: 'Electrónicos Rápidos', ownerName: 'Luis C.', email: 'luis@...', status: 'Suspendida', registrationDate: '2025-09-01' },
];

const statusStyles: { [key in Store['status']]: string } = {
    'Activa': 'bg-green-100 text-green-700',
    'Pendiente': 'bg-yellow-100 text-yellow-800',
    'Suspendida': 'bg-red-100 text-red-700',
};

const AdminStoresPage = () => (
    <DashboardLayout pageTitle="Manage Stores" pageDescription="Approve, suspend, or view store details.">
         <Card className="overflow-hidden p-0">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-secondary text-text-main">
                        <tr>
                            <th className="p-4 font-semibold">Store Name</th>
                            <th className="p-4 font-semibold">Owner</th>
                            <th className="p-4 font-semibold">Registered</th>
                            <th className="p-4 font-semibold">Status</th>
                            <th className="p-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockAdminStores.map((store) => (
                            <tr key={store.id} className="border-t border-line-light hover:bg-secondary-light">
                                <td className="p-4 font-medium text-text-main">{store.name}</td>
                                <td className="p-4 text-text-muted">{store.ownerName} ({store.email})</td>
                                <td className="p-4 text-text-muted">{store.registrationDate}</td>
                                <td className="p-4">
                                    <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full ${statusStyles[store.status]}`}>
                                        {store.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right space-x-2">
                                    {store.status === 'Pendiente' && <Button size="sm">✅ Approve</Button>}
                                    {store.status !== 'Pendiente' && <Button variant="secondary" size="sm">📝 Edit</Button>}
                                    {store.status !== 'Suspendida' && <Button variant="danger" size="sm">🚫 Suspend</Button>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
         </Card>
    </DashboardLayout>
);
export default AdminStoresPage;