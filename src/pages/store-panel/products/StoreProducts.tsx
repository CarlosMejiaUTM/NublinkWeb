// FileName: StoreProductsPage.tsx
// Path: src/pages/store-panel/products/StoreProductsPage.tsx

import { useState, useEffect, useMemo, useCallback } from "react";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import ProductTable from "./ProductTable";
import AddProductForm from "./AddProductForm";
import type { Product } from "@/types";
import { type FullPurchase, type Apartado, getFullPurchases, getApartados, markPurchaseAsPickedUp, markApartadoAsPickedUp } from "@/services/api/products";
import { 
  PlusIcon, 
  MagnifyingGlassIcon,
  XMarkIcon,
  FunnelIcon,
  ShoppingCartIcon,
  CreditCardIcon,
  CubeIcon
} from "@heroicons/react/20/solid";
import { getStoreProducts } from "@/services/api";
import ConfirmModal from "@/components/common/ConfirmModal";

/* ============================================================
   --- Tipos de Vista ---
============================================================ */
type ViewMode = 'products' | 'purchases' | 'apartados';
type PurchaseStatus = 'pendiente' | 'recogido';
type ApartadoStatus = 'apartado' | 'liquidado' | 'recogido';

/* ============================================================
   --- Componente de carga ---
============================================================ */
const LoadingSpinner = ({ message }: { message?: string }) => (
  <div className="flex flex-col justify-center items-center h-64">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary mb-4"></div>
    {message && (
      <p className="text-text-muted text-sm animate-pulse">{message}</p>
    )}
  </div>
);

/* ============================================================
   --- Componente de estadísticas rápidas ---
============================================================ */
const QuickStats = ({ 
  total, 
  filtered, 
  lowStock,
  viewMode 
}: { 
  total: number; 
  filtered: number; 
  lowStock?: number;
  viewMode: ViewMode;
}) => {
  const getStatsLabels = () => {
    switch (viewMode) {
      case 'purchases':
        return {
          total: 'Total Compras',
          filtered: 'Mostrando',
          third: 'Pendientes',
        };
      case 'apartados':
        return {
          total: 'Total Apartados',
          filtered: 'Mostrando',
          third: 'Activos',
        };
      default:
        return {
          total: 'Total Productos',
          filtered: 'Mostrando',
          third: 'Bajo Stock',
        };
    }
  };

  const labels = getStatsLabels();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <Card className="shadow-md transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-text-muted mb-1">{labels.total}</p>
            <p className="text-3xl font-bold text-text-main mt-1">{total}</p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <CubeIcon className="w-6 h-6 text-primary" />
          </div>
        </div>
      </Card>

      <Card className="shadow-md transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-text-muted mb-1">{labels.filtered}</p>
            <p className="text-3xl font-bold text-text-main mt-1">{filtered}</p>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <FunnelIcon className="w-6 h-6 text-primary" />
          </div>
        </div>
      </Card>

      <Card className="shadow-md transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-text-muted mb-1">{labels.third}</p>
            <p className="text-3xl font-bold text-text-main mt-1">{lowStock || 0}</p>
          </div>
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <XMarkIcon className="w-6 h-6 text-primary" /> 
          </div>
        </div>
      </Card>
    </div>
  );
};

const StoreProductsPage = () => {
  // Estados principales
  const [viewMode, setViewMode] = useState<ViewMode>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [purchases, setPurchases] = useState<FullPurchase[]>([]);
  const [apartados, setApartados] = useState<Apartado[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Estados de búsqueda y filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [purchaseStatus, setPurchaseStatus] = useState<PurchaseStatus | 'all'>('all');
  const [apartadoStatus, setApartadoStatus] = useState<ApartadoStatus | 'all'>('all');

  // ✅ Estado para modal de marcar como recogido
  const [pickupModal, setPickupModal] = useState({
    isOpen: false,
    state: 'confirm' as 'confirm' | 'success',
    title: '',
    message: '',
    type: 'confirm' as 'confirm' | 'success' | 'error' | 'loading',
    purchaseToPickup: null as FullPurchase | null,
    onConfirm: () => {},
  });

const loadData = useCallback(async () => {
    setLoading(true);
    try {
      switch (viewMode) {
        case 'products':
          const productsData = await getStoreProducts();
          setProducts(productsData);
          break;
        
        case 'purchases':
          if (purchaseStatus === 'all') {
            const [pendientes, recogidas] = await Promise.all([
              getFullPurchases('pendiente'),
              getFullPurchases('recogido')
            ]);
            setPurchases([...pendientes, ...recogidas]);
          } else {
            const purchasesData = await getFullPurchases(purchaseStatus);
            setPurchases(purchasesData);
          }
          break;
        
        case 'apartados':
          if (apartadoStatus === 'all') {
            const [apartadosActivos, liquidados, recogidos] = await Promise.all([
              getApartados('apartado'),
              getApartados('liquidado'),
              getApartados('recogido')
            ]);
            setApartados([...apartadosActivos, ...liquidados, ...recogidos]);
          } else {
            const apartadosData = await getApartados(apartadoStatus);
            setApartados(apartadosData);
          }
          break;
      }
    } catch (error) {
      console.error(`Error al cargar ${viewMode}:`, error);
    } finally {
      setLoading(false);
    }
  }, [viewMode, purchaseStatus, apartadoStatus]); // ✅ Dependencias estables

useEffect(() => {
  console.log('🔧 StoreProductsPage: useEffect montado/actualizado');
  loadData();

  // 👂 Escuchar evento de producto añadido desde el DashboardLayout
  const handleProductAdded = (e: Event) => {
    console.log('🎉 StoreProductsPage: Evento productAdded recibido!', e);
    console.log('🔄 Recargando productos...');
    loadData();
  };

  console.log('👂 Registrando listener para productAdded');
  window.addEventListener('productAdded', handleProductAdded);

  // Limpiar el evento al desmontar
  return () => {
    console.log('🧹 Limpiando listener de productAdded');
    window.removeEventListener('productAdded', handleProductAdded);
  };
}, [loadData]);



  const handleProductUpdated = () => {
    loadData();
  };

  const handleProductAdded = () => {
  setShowAddForm(false);
  loadData();
};

  // ✅ Función para marcar como recogido
  const handleMarkAsPickedUp = (purchase: FullPurchase) => {
    setPickupModal({
      isOpen: true,
      state: 'confirm',
      title: '¿Marcar como recogido?',
      message: `¿Confirmas que el cliente "${purchase.user.name}" recogió el producto "${purchase.product.name}"?`,
      type: 'confirm',
      purchaseToPickup: purchase,
      onConfirm: async () => {
        try {
          // Mostrar loading
          setPickupModal({
            ...pickupModal,
            isOpen: true,
            state: 'confirm',
            title: 'Procesando...',
            message: 'Marcando la compra como recogida...',
            type: 'loading',
            onConfirm: () => {},
          });

          await markPurchaseAsPickedUp(purchase.id);

          // Mostrar éxito
          setPickupModal({
            ...pickupModal,
            isOpen: true,
            state: 'success',
            title: '¡Compra marcada como recogida!',
            message: 'El estado se ha actualizado correctamente.',
            type: 'success',
            onConfirm: () => {
              setPickupModal({ ...pickupModal, isOpen: false, purchaseToPickup: null });
            },
          });

          // Recargar datos después de 1.5s
          setTimeout(() => {
            setPickupModal({ ...pickupModal, isOpen: false, purchaseToPickup: null });
            loadData();
          }, 1500);
        } catch (error: any) {
          const errorMessage = error.message || 'No se pudo marcar la compra como recogida';
          
          setPickupModal({
            ...pickupModal,
            isOpen: true,
            state: 'confirm',
            title: 'Error',
            message: errorMessage,
            type: 'error',
            onConfirm: () => {
              setPickupModal({ ...pickupModal, isOpen: false, purchaseToPickup: null });
            },
          });

          setTimeout(() => {
            setPickupModal({ ...pickupModal, isOpen: false, purchaseToPickup: null });
          }, 3000);
        }
      },
    });
  };


  // ✅ Función para marcar apartado como recogido
const handleMarkApartadoAsPickedUp = (apartado: Apartado) => {
  setPickupModal({
    isOpen: true,
    state: 'confirm',
    title: '¿Marcar apartado como recogido?',
    message: `¿Confirmas que el cliente "${apartado.user.name}" recogió el producto "${apartado.product.name}"?`,
    type: 'confirm',
    purchaseToPickup: null,
    onConfirm: async () => {
      try {
        setPickupModal({
          ...pickupModal,
          isOpen: true,
          state: 'confirm',
          title: 'Procesando...',
          message: 'Marcando el apartado como recogido...',
          type: 'loading',
          onConfirm: () => {},
        });

        await markApartadoAsPickedUp(apartado.id);

        setPickupModal({
          ...pickupModal,
          isOpen: true,
          state: 'success',
          title: '¡Apartado marcado como recogido!',
          message: 'El estado se ha actualizado correctamente.',
          type: 'success',
          onConfirm: () => {
            setPickupModal({ ...pickupModal, isOpen: false, purchaseToPickup: null });
          },
        });

        setTimeout(() => {
          setPickupModal({ ...pickupModal, isOpen: false, purchaseToPickup: null });
          loadData();
        }, 1500);
      } catch (error: any) {
        const errorMessage = error.message || 'No se pudo marcar el apartado como recogido';
        
        setPickupModal({
          ...pickupModal,
          isOpen: true,
          state: 'confirm',
          title: 'Error',
          message: errorMessage,
          type: 'error',
          onConfirm: () => {
            setPickupModal({ ...pickupModal, isOpen: false, purchaseToPickup: null });
          },
        });

        setTimeout(() => {
          setPickupModal({ ...pickupModal, isOpen: false, purchaseToPickup: null });
        }, 3000);
      }
    },
  });
};

  // Obtener categorías únicas
  const categories = useMemo(() => {
    const uniqueCategories = new Map<number, { id: number; name: string }>();
    products.forEach(product => {
      if (product.category && !uniqueCategories.has(product.category.id)) {
        uniqueCategories.set(product.category.id, {
          id: product.category.id,
          name: product.category.name
        });
      }
    });
    return Array.from(uniqueCategories.values());
  }, [products]);

  // Filtrar productos
  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(term) ||
        product.description?.toLowerCase().includes(term) ||
        product.category?.name.toLowerCase().includes(term)
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(product => 
        product.category?.id.toString() === selectedCategory
      );
    }

    return filtered;
  }, [products, searchTerm, selectedCategory]);

  // Filtrar compras
  const filteredPurchases = useMemo(() => {
    if (!searchTerm.trim()) return purchases;
    
    const term = searchTerm.toLowerCase();
    return purchases.filter(purchase =>
      purchase.product.name.toLowerCase().includes(term) ||
      purchase.user.name.toLowerCase().includes(term) ||
      purchase.user.email.toLowerCase().includes(term)
    );
  }, [purchases, searchTerm]);

  // Filtrar apartados
  const filteredApartados = useMemo(() => {
    if (!searchTerm.trim()) return apartados;
    
    const term = searchTerm.toLowerCase();
    return apartados.filter(apartado =>
      apartado.product.name.toLowerCase().includes(term) ||
      apartado.user.name.toLowerCase().includes(term) ||
      apartado.user.email.toLowerCase().includes(term)
    );
  }, [apartados, searchTerm]);

  // Calcular estadísticas
  const stats = useMemo(() => {
    switch (viewMode) {
      case 'products':
        return {
          total: products.length,
          filtered: filteredProducts.length,
          lowStock: products.filter(p => p.stock < 10).length,
        };
      case 'purchases':
        return {
          total: purchases.length,
          filtered: filteredPurchases.length,
          lowStock: purchases.filter(p => p.status === 'pendiente').length,
        };
      case 'apartados':
        return {
          total: apartados.length,
          filtered: filteredApartados.length,
          lowStock: apartados.filter(a => a.status === 'apartado').length,
        };
      default:
        return { total: 0, filtered: 0, lowStock: 0 };
    }
  }, [viewMode, products, filteredProducts, purchases, filteredPurchases, apartados, filteredApartados]);

  // Limpiar búsqueda
  const clearSearch = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setPurchaseStatus('all');
    setApartadoStatus('all');
  };

  // Obtener el label del filtro activo
  const getActiveFilterLabel = () => {
    switch (viewMode) {
      case 'purchases':
        return purchaseStatus !== 'all' ? `Estado: ${purchaseStatus}` : null;
      case 'apartados':
        return apartadoStatus !== 'all' ? `Estado: ${apartadoStatus}` : null;
      default:
        return selectedCategory !== 'all' 
          ? `Categoría: ${categories.find(c => c.id.toString() === selectedCategory)?.name}`
          : null;
    }
  };

  return (
    <>
      {showAddForm && (
        <AddProductForm
          onClose={() => setShowAddForm(false)}
          onSubmit={handleProductAdded}
        />
      )}

      {/* SELECTOR DE MODO DE VISTA */}
      <div className="mb-6 flex gap-3 flex-wrap">
        <Button
          onClick={() => setViewMode('products')}
          variant={viewMode === 'products' ? 'primary' : 'secondary'}
          className="flex items-center gap-2"
        >
          <CubeIcon className="w-5 h-5" />
          Productos
        </Button>
        <Button
          onClick={() => setViewMode('purchases')}
          variant={viewMode === 'purchases' ? 'primary' : 'secondary'}
          className="flex items-center gap-2"
        >
          <ShoppingCartIcon className="w-5 h-5" />
          Compras Completas
        </Button>
        <Button
          onClick={() => setViewMode('apartados')}
          variant={viewMode === 'apartados' ? 'primary' : 'secondary'}
          className="flex items-center gap-2"
        >
          <CreditCardIcon className="w-5 h-5" />
          Apartados
        </Button>
      </div>

      {/* ESTADÍSTICAS RÁPIDAS */}
      {!loading && (
        <QuickStats 
          total={stats.total}
          filtered={stats.filtered}
          lowStock={stats.lowStock}
          viewMode={viewMode}
        />
      )}

      {/* BUSCADOR Y FILTROS */}
      <Card className="mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Buscador */}
          <div className="flex-1 relative">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type="text"
                placeholder={
                  viewMode === 'products' 
                    ? "Buscar por nombre, descripción o categoría..."
                    : "Buscar por nombre de producto o cliente..."
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 border border-line-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Filtros según el modo */}
          <div className="flex gap-2 items-center">
            <FunnelIcon className="w-5 h-5 text-text-muted" />
            
            {viewMode === 'products' && (
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2.5 border border-line-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all min-w-[200px]"
              >
                <option value="all">Todas las categorías</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id.toString()}>
                    {cat.name}
                  </option>
                ))}
              </select>
            )}

            {viewMode === 'purchases' && (
              <select
                value={purchaseStatus}
                onChange={(e) => setPurchaseStatus(e.target.value as PurchaseStatus | 'all')}
                className="px-4 py-2.5 border border-line-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all min-w-[200px]"
              >
                <option value="all">Todos los estados</option>
                <option value="pendiente">Pendientes</option>
                <option value="recogido">Recogidos</option>
              </select>
            )}

            {viewMode === 'apartados' && (
              <select
                value={apartadoStatus}
                onChange={(e) => setApartadoStatus(e.target.value as ApartadoStatus | 'all')}
                className="px-4 py-2.5 border border-line-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all min-w-[200px]"
              >
                <option value="all">Todos los estados</option>
                <option value="apartado">Apartados</option>
                <option value="liquidado">Liquidados</option>
                <option value="recogido">Recogidos</option>
              </select>
            )}
          </div>

          {/* Botón añadir producto (solo en modo productos) */}
          {viewMode === 'products' && (
            <Button onClick={() => setShowAddForm(true)} className="whitespace-nowrap">
              <PlusIcon className="w-4 h-4" />
              Añadir Producto
            </Button>
          )}
        </div>

        {/* Indicador de filtros activos */}
        {(searchTerm || getActiveFilterLabel()) && (
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <span className="text-sm text-text-muted">Filtros activos:</span>
            {searchTerm && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                Búsqueda: "{searchTerm}"
                <button
                  onClick={() => setSearchTerm("")}
                  className="hover:bg-primary/20 rounded-full p-0.5"
                >
                  <XMarkIcon className="w-3 h-3" />
                </button>
              </span>
            )}
            {getActiveFilterLabel() && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                {getActiveFilterLabel()}
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setPurchaseStatus('all');
                    setApartadoStatus('all');
                  }}
                  className="hover:bg-primary/20 rounded-full p-0.5"
                >
                  <XMarkIcon className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={clearSearch}
              className="text-sm text-red-600 hover:text-red-700 font-medium ml-2"
            >
              Limpiar todo
            </button>
          </div>
        )}
      </Card>

      {/* LOADING O TABLA */}
      {loading ? (
        <LoadingSpinner message={`Cargando ${viewMode}...`} />
      ) : (
        <>
          {viewMode === 'products' && filteredProducts.length > 0 ? (
            <>
              <div className="mb-4 text-sm text-text-muted">
                Mostrando {filteredProducts.length} de {products.length} productos
              </div>
              <ProductTable 
                products={filteredProducts} 
                viewMode="products" 
                onProductUpdated={handleProductUpdated}
              />
            </>
          ) : viewMode === 'purchases' && filteredPurchases.length > 0 ? (
            <>
              <div className="mb-4 text-sm text-text-muted">
                Mostrando {filteredPurchases.length} de {purchases.length} compras
              </div>
              <ProductTable 
                purchases={filteredPurchases} 
                viewMode="purchases"
                onMarkAsPickedUp={handleMarkAsPickedUp}
              />
            </>
          ) : viewMode === 'apartados' && filteredApartados.length > 0 ? (
            <>
              <div className="mb-4 text-sm text-text-muted">
                Mostrando {filteredApartados.length} de {apartados.length} apartados
              </div>
              <ProductTable 
                apartados={filteredApartados} 
                viewMode="apartados"
                onMarkApartadoAsPickedUp={handleMarkApartadoAsPickedUp}
              />
            </>
          ) : (
            <Card className="text-center py-12">
              <MagnifyingGlassIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-text-main mb-2">
                No se encontraron resultados
              </h3>
              <p className="text-text-muted mb-4">
                {searchTerm || getActiveFilterLabel()
                  ? "Intenta con otros términos de búsqueda o filtros"
                  : `No hay ${viewMode} registrados`}
              </p>
              {(searchTerm || getActiveFilterLabel()) && (
                <Button onClick={clearSearch} variant="secondary">
                  Limpiar filtros
                </Button>
              )}
            </Card>
          )}
        </>
      )}

      {/* ✅ MODAL DE CONFIRMACIÓN PARA MARCAR COMO RECOGIDO */}
      <ConfirmModal
        isOpen={pickupModal.isOpen}
        state={pickupModal.state}
        title={pickupModal.title}
        message={pickupModal.message}
        type={pickupModal.type}
        confirmText="Confirmar"
        cancelText="Cancelar"
        onConfirm={pickupModal.onConfirm}
        onCancel={() => setPickupModal({ ...pickupModal, isOpen: false, purchaseToPickup: null })}
      />
    </>
  );
};

export default StoreProductsPage;