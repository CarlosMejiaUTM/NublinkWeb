import React, { useState, useEffect, useMemo } from 'react';
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import type { Product } from "../../types";
import { getStoreProducts } from '../../services/api';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  CubeIcon,
  CheckCircleIcon,
  XCircleIcon,
  Squares2X2Icon,
  TagIcon,
  ArchiveBoxIcon,
  InboxIcon
  
} from '@heroicons/react/20/solid';

// --- Spinner y Error ---
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-48">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);
const ErrorMessage = ({ message }: { message: string }) => (
  <div className="p-4 text-center text-red-600 bg-red-100 rounded-lg">{message}</div>
);

// --- Avatar de Producto ---
const ProductAvatar = ({ name, imageUrl }: { name: string, imageUrl?: string }) => {
  return (
    <div className="w-10 h-10 rounded-lg flex-shrink-0 border border-line-light/50 shadow-sm">
      {imageUrl ? (
        <img src={imageUrl} alt={name} className="w-full h-full rounded-lg object-cover" />
      ) : (
        <div className="w-full h-full bg-secondary rounded-lg flex items-center justify-center text-primary font-semibold">
          <CubeIcon className="w-5 h-5" />
        </div>
      )}
    </div>
  );
};

// --- Badge de Stock ---
const StockBadge = ({ stock }: { stock: number }) => {
  let colorClass = 'bg-green-100 text-green-700';
  let text = `${stock} en Stock`;

  if (stock === 0) {
    colorClass = 'bg-red-100 text-red-700';
    text = 'Agotado';
  } else if (stock < 10) {
    colorClass = 'bg-yellow-100 text-yellow-800';
    text = `${stock} (Bajo)`;
  }

  return (
    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${colorClass}`}>
      {text}
    </span>
  );
};

// --- Badge de Estado ---
const StatusBadge = ({ status }: { status: string }) => {
  const isActive = (status || 'Activo').toLowerCase() === 'activo';
  const colorClass = isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700';
  const Icon = isActive ? CheckCircleIcon : XCircleIcon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${colorClass}`}>
      <Icon className="w-4 h-4" />
      {status || 'Activo'}
    </span>
  );
};

// --- Sidebar TabButton ---
const TabButton = ({ title, icon: Icon, active }: { title: string, icon: any, active?: boolean }) => (
  <button
    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all w-full text-left
      ${active
        ? "bg-primary text-white shadow"
        : "text-text-muted hover:bg-secondary hover:text-text-main"}`}
  >
    <Icon className="w-5 h-5" />
    {title}
  </button>
);

// --- Opciones simuladas para filtro de categoría ---
const categoryFilterOptions = [
  { value: 'all', label: 'Todas las Categorías' },
  { value: '1', label: 'Ferretería' },
  { value: '2', label: 'Ropa' },
  { value: '3', label: 'Electrónica' },
];

const StoreProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getStoreProducts();

        // --- Simulamos datos extra ---
        const enriched = data.map(p => ({
          ...p,
          apartados: Math.floor(p.stock * 0.2),
          comprados: Math.floor(p.stock * 0.4),
        }));
        setProducts(enriched);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setIsLoading(false);
      }
    };
    loadProducts();
  }, []);

  // --- Filtros ---
  const filteredProducts = useMemo(() => {
    return products
      .filter(() => true)
      .filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.barcode && product.barcode.includes(searchQuery))
      );
  }, [products, searchQuery, categoryFilter]);

  // --- Badge genérico para métricas ---
  const MetricBadge = ({ label, value, color }: { label: string; value: number; color: string }) => (
    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${color}`}>
      {label}: {value}
    </span>
  );

  const renderContent = () => {
    if (isLoading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} />;
    if (products.length === 0) {
      return (
        <Card className="text-center p-12">
          <CubeIcon className="w-12 h-12 text-text-muted mx-auto" />
          <h3 className="font-semibold text-lg text-text-main mt-4">No tienes productos</h3>
          <p className="text-sm text-text-muted mt-1 mb-6">
            Empieza añadiendo tu primer producto para que aparezca aquí.
          </p>
          <Button>
            <PlusIcon className="w-5 h-5" />
            Añadir mi primer producto
          </Button>
        </Card>
      );
    }

    if (filteredProducts.length === 0) {
      return (
        <p className="text-center text-text-muted p-8">
          No se encontraron productos que coincidan con tu búsqueda.
        </p>
      );
    }

    return (
      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary text-text-main">
              <tr>
                <th className="p-4 font-semibold">Producto</th>
                <th className="p-4 font-semibold">Precio</th>
                <th className="p-4 font-semibold">Stock Total</th>
                <th className="p-4 font-semibold">Apartados</th>
                <th className="p-4 font-semibold">Comprados</th>
                <th className="p-4 font-semibold">Stock Disponible</th>
                <th className="p-4 font-semibold">Estado</th>
                <th className="p-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => {
                const stockDisponible = product.stock - product.apartados - product.comprados;
                const disponibleColor =
                  stockDisponible <= 0
                    ? "bg-red-100 text-red-700"
                    : stockDisponible < 10
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-700";

                return (
                  <tr
                    key={product.id}
                    className="border-t border-line-light hover:bg-secondary-light transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3 whitespace-nowrap">
                        <ProductAvatar name={product.name} imageUrl={product.imageUrl} />
                        <div>
                          <span className="font-semibold text-text-main">{product.name}</span>
                          <p className="text-xs text-text-muted">{product.barcode || `ID: ${product.id}`}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-text-main font-medium">
                      ${product.price.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-4"><StockBadge stock={product.stock} /></td>
                    <td className="p-4">
                      <MetricBadge label="Apartados" value={product.apartados} color="bg-blue-100 text-blue-700" />
                    </td>
                    <td className="p-4">
                      <MetricBadge label="Comprados" value={product.comprados} color="bg-purple-100 text-purple-700" />
                    </td>
                    <td className="p-4">
                      <MetricBadge label="Disponible" value={Math.max(stockDisponible, 0)} color={disponibleColor} />
                    </td>
                    <td className="p-4"><StatusBadge status={product.status || 'Activo'} /></td>
                    <td className="p-4 text-right space-x-1 whitespace-nowrap">
                      <Button variant="ghost" size="sm" className="text-text-muted hover:text-primary" title="Editar Producto">
                        <PencilSquareIcon className="w-5 h-5" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-text-muted hover:text-red-500" title="Eliminar Producto">
                        <TrashIcon className="w-5 h-5" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {!isLoading && filteredProducts.length > 0 && (
          <div className="p-4 border-t border-line-light flex flex-col md:flex-row justify-between items-center text-xs text-text-muted gap-4">
            <span>
              Mostrando{" "}
              <span className="font-semibold text-text-main">{filteredProducts.length}</span> de{" "}
              <span className="font-semibold text-text-main">{products.length}</span> productos
            </span>
            <div className="flex gap-1">
              <Button variant="secondary" size="sm" className="px-2" disabled> &lt; Anterior </Button>
              <Button variant="secondary" size="sm" className="px-2"> Siguiente &gt; </Button>
            </div>
          </div>
        )}
      </Card>
    );
  };

  // --- Estructura principal con Sidebar ---
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* --- Sidebar --- */}
        <div className="lg:col-span-1">
          <Card paddingClass="p-2">
            <nav className="flex flex-col space-y-1">
              <TabButton title="Mis Productos" icon={Squares2X2Icon} active />
              <TabButton title="Stock Total" icon={InboxIcon} />
              <TabButton title="Disponible" icon={ArchiveBoxIcon} />
            </nav>
          </Card>
        </div>

        {/* --- Contenido Principal --- */}
        <div className="lg:col-span-3">
          {/* --- Barra de Filtros y Acción --- */}
          <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
            <div className="flex gap-4">
              <div className="relative w-full md:w-72">
                <Input
                  id="searchProducts"
                  placeholder="Buscar por nombre o código..."
                  className="pl-10 !py-2"
                  containerClassName="mb-0"
                  icon={<MagnifyingGlassIcon />}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="w-full md:w-56">
                <Select
                  id="categoryFilter"
                  containerClassName="mb-0"
                  className="!py-2"
                  options={categoryFilterOptions}
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                />
              </div>
            </div>

            <Button>
              <PlusIcon className="w-5 h-5" />
              Añadir Producto
            </Button>
          </div>

          {renderContent()}
        </div>
      </div>
    </>
  );
};

export default StoreProductsPage;
