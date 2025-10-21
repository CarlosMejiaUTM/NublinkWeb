// FileName: StoreProducts.tsx
// Path: src/pages/store-panel/StoreProducts.tsx

import DashboardLayout from "../../layouts/DashboardLayout";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Card from "../../components/common/Card"; // Usa Card para la tabla
import { Product } from "../../types";

// Iconos Placeholder
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const ThreeDotsVerticalIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>;

// Datos Mock
const mockProducts: Product[] = [
    { id: '1', imageUrl: 'https://placehold.co/40x40/EAEFFB/4B43B3?text=P1', name: 'Taladro Inalámbrico 20V', price: 1899.99, stock: 15, status: 'Activo' },
    { id: '2', imageUrl: 'https://placehold.co/40x40/EAEFFB/4B43B3?text=P2', name: 'Juego de Desarmadores Precisión', price: 349.50, stock: 45, status: 'Activo' },
    { id: '3', imageUrl: 'https://placehold.co/40x40/EAEFFB/4B43B3?text=P3', name: 'Martillo de Uña 16oz', price: 250.00, stock: 0, status: 'Inactivo' },
    { id: '4', imageUrl: 'https://placehold.co/40x40/EAEFFB/4B43B3?text=P4', name: 'Sierra Circular Eléctrica', price: 2500.00, stock: 20, status: 'Activo' },
    { id: '5', imageUrl: 'https://placehold.co/40x40/EAEFFB/4B43B3?text=P5', name: 'Caja de Herramientas Grande', price: 780.00, stock: 10, status: 'Activo' },
];

const StoreProductsPage = () => {
    return (
        <DashboardLayout
            pageTitle="Products"
            pageDescription="Manage your store's inventory."
        >
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <div className="relative w-full sm:w-64">
                    {/* Input de búsqueda estilizado */}
                    <input
                        id="searchProducts"
                        type="text"
                        placeholder="Search products..."
                        className="w-full pl-10 pr-4 py-2 border border-line-light bg-secondary rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary text-sm placeholder-text-muted/60"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon />
                    </div>
                </div>
                <Button>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  Add New Product
                </Button>
            </div>

            {/* Tabla dentro de una Card */}
            <Card className="overflow-hidden p-0"> {/* Padding 0 para que la tabla ocupe todo */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-secondary text-text-main">
                            <tr>
                                <th className="p-4 font-semibold">Product</th>
                                <th className="p-4 font-semibold">Price</th>
                                <th className="p-4 font-semibold">Stock</th>
                                <th className="p-4 font-semibold">Status</th>
                                <th className="p-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockProducts.map((product) => (
                                <tr key={product.id} className="border-t border-line-light hover:bg-secondary-light transition-colors">
                                    <td className="p-4 flex items-center gap-3 whitespace-nowrap">
                                        <img src={product.imageUrl} alt={product.name} className="w-10 h-10 rounded-lg object-cover border border-line-light flex-shrink-0" />
                                        <span className="font-medium text-text-main">{product.name}</span>
                                    </td>
                                    <td className="p-4 text-text-muted">${product.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    <td className="p-4 font-medium text-text-main text-center">{product.stock}</td>
                                    <td className="p-4">
                                        <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full ${
                                            product.status === 'Activo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                            {product.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <Button variant="ghost" size="sm" className="px-2"> {/* Botón más pequeño */}
                                            <ThreeDotsVerticalIcon />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Footer de la tabla con Paginación */}
                <div className="p-4 border-t border-line-light flex justify-between items-center text-xs text-text-muted">
                    <span>Showing 1-5 of {mockProducts.length} products</span>
                    <div className="flex gap-1">
                        <Button variant="secondary" size="sm" className="px-2" disabled>
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        </Button>
                        <Button variant="secondary" size="sm" className="px-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </Button>
                    </div>
                </div>
            </Card>

        </DashboardLayout>
    );
};

export default StoreProductsPage;