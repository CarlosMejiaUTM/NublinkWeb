// FileName: AdminGlobalProducts.tsx
// Path: src/pages/admin-panel/AdminGlobalProducts.tsx

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import { getAdminAllProducts, getAdminAllStores } from '../../services/api';
import type { Product, Store } from '../../types';
import toast, { Toaster } from 'react-hot-toast';

// --- Iconos ---
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" /></svg>;
const CheckBadgeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-green-500"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>;
const ExclamationCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-yellow-500"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.94 6.94a.75.75 0 11-1.06-1.061l-1.5 1.5a.75.75 0 001.06 1.06l1.5-1.5zm.024 4.502a.75.75 0 011.06-1.061l3.5-3.5a.75.75 0 111.06 1.06L9 11.06a.75.75 0 01-1.061 0zM10 12.25a.75.75 0 00-1.06 1.061l1.5 1.5a.75.75 0 001.06-1.06l-1.5-1.5z" clipRule="evenodd" /></svg>;

// --- Componentes ---
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
  </div>
);

const ErrorMessage = ({ message, onRetry }: { message: string, onRetry?: () => void }) => (
  <Card className="bg-red-50 border-red-200">
    <p className="text-center font-semibold text-red-700">Error al Cargar Datos</p>
    <p className="text-center text-sm text-red-600 mt-2">{message}</p>
    {onRetry && <Button onClick={onRetry} variant="secondary" size="sm" className="mt-4 mx-auto">Reintentar</Button>}
  </Card>
);

// --- Tipos ---
type MergedProduct = Product & { storeName: string; isVerified: boolean };

const AdminGlobalProductsPage = () => {
  const [products, setProducts] = useState<MergedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStore, setSelectedStore] = useState<string>('all');

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [productsResult, storesResult] = await Promise.allSettled([
        getAdminAllProducts(),
        getAdminAllStores()
      ]);

      if (productsResult.status === 'rejected') throw productsResult.reason;
      if (storesResult.status === 'rejected') throw storesResult.reason;

      const allProducts = productsResult.value;
      const allStores = storesResult.value;
      setStores(allStores);

      const storeMap = new Map(allStores.map(store => [store.id, store.business_name]));

      const mergedProducts: MergedProduct[] = allProducts.map(product => ({
        ...product,
        storeName: storeMap.get(product.store_id as number) || 'Tienda Desconocida',
        isVerified: product.id % 3 === 0,
      }));

      setProducts(mergedProducts);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido al cargar datos.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  // --- Acciones ---
  const handleVerify = useCallback((productId: number) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, isVerified: true } : p));
    toast.success('Producto verificado ✅');
  }, []);

  // --- Filtro ---
  const filteredProducts = useMemo(() => {
    return products
      .filter(p => activeTab === 'verified' ? p.isVerified : activeTab === 'pending' ? !p.isVerified : true)
      .filter(p => selectedStore === 'all' ? true : p.storeName === selectedStore)
      .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.storeName.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [products, activeTab, searchQuery, selectedStore]);

  // --- Paginación ---
  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // --- UI ---
  const getTabClass = (tabName: string) =>
    `px-3 py-2 font-medium text-sm rounded-md ${activeTab === tabName ? 'bg-primary text-white shadow-sm' : 'text-text-muted hover:bg-secondary hover:text-text-main'}`;

  const renderContent = () => {
    if (isLoading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} onRetry={loadData} />;

    return (
      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary text-text-main">
              <tr>
                <th className="p-4 font-semibold">Producto</th>
                <th className="p-4 font-semibold">Tienda</th>
                <th className="p-4 font-semibold">Precio</th>
                <th className="p-4 font-semibold">Stock</th>
                <th className="p-4 font-semibold">Estado</th>
                <th className="p-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map(product => (
                <tr key={product.id} className="border-t border-line-light hover:bg-secondary-light">
                  <td className="p-4 flex items-center gap-3 whitespace-nowrap">
                    <img src={product.imageUrl || `https://placehold.co/40x40/EAEFFB/4B43B3?text=${product.name.charAt(0)}`} alt={product.name} className="w-10 h-10 rounded-lg object-cover border border-line-light flex-shrink-0" />
                    <div>
                      <span className="font-medium text-text-main">{product.name}</span>
                      <p className="text-xs text-text-muted">ID: {product.id}</p>
                    </div>
                  </td>
                  <td className="p-4 text-text-muted font-medium">{product.storeName}</td>
                  <td className="p-4 text-text-muted">${product.price.toLocaleString('es-MX')}</td>
                  <td className={`p-4 font-medium text-text-main text-center ${product.stock < 5 ? 'text-red-500' : 'text-green-700'}`}>{product.stock}</td>
                  <td className="p-4">
                    {product.isVerified ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                        <CheckBadgeIcon className="w-4 h-4" /> Verificado
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                        <ExclamationCircleIcon className="w-4 h-4" /> Pendiente
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    {!product.isVerified && (
                      <Button size="sm" variant="secondary" onClick={() => handleVerify(product.id)}>
                        ✅ Verificar
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" className="text-blue-600" disabled>
                      Unificar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-line-light flex justify-between items-center text-xs text-text-muted">
          <span>Mostrando {indexOfFirst + 1}-{Math.min(indexOfLast, filteredProducts.length)} de {filteredProducts.length} productos</span>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Anterior</Button>
            <Button size="sm" variant="secondary" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Siguiente</Button>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        {/* Pestañas */}
        <div className="flex items-center gap-2 bg-secondary p-1 rounded-lg">
          <button onClick={() => setActiveTab('all')} className={getTabClass('all')}>
            Todos ({products.length})
          </button>
          <button onClick={() => setActiveTab('pending')} className={getTabClass('pending')}>
            Pendientes ({products.filter(p => !p.isVerified).length})
          </button>
          <button onClick={() => setActiveTab('verified')} className={getTabClass('verified')}>
            Verificados ({products.filter(p => p.isVerified).length})
          </button>
        </div>

        {/* Filtros */}
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <input
              id="searchProducts"
              type="text"
              placeholder="Buscar por producto o tienda..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-line-light bg-surface rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary text-sm placeholder-text-muted/60"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon />
            </div>
          </div>
          <select
            value={selectedStore}
            onChange={(e) => setSelectedStore(e.target.value)}
            className="border border-line-light bg-surface rounded-lg px-2 py-2 text-sm"
          >
            <option value="all">Todas las tiendas</option>
            {stores.map(store => (
              <option key={store.id} value={store.business_name}>{store.business_name}</option>
            ))}
          </select>
        </div>
      </div>

      {renderContent()}
    </>
  );
};

export default AdminGlobalProductsPage;
