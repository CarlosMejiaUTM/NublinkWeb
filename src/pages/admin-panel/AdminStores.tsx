// FileName: AdminStores.tsx
// Path: src/pages/admin-panel/AdminStores.tsx

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import ConfirmModal from "../../components/common/ConfirmModal"; // ✅ NUEVO
import type { Store, Category } from "../../types";
import {
  getAdminPendingStores,
  getAdminApprovedStores,
  getAdminRejectedStores,
  approveStore,
  rejectStore,
  getCategories
} from '../../services/api';

import {
  CheckIcon,
  XMarkIcon,
  EyeIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/20/solid';

// --- (Spinner y Error) ---
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-48">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

const ErrorMessage = ({ message, onRetry }: { message: string, onRetry?: () => void }) => (
  <div className="p-4 text-center text-red-600 bg-red-100 rounded-lg border border-red-200">
    <p>{message}</p>
    {onRetry && (
      <Button onClick={onRetry} variant="secondary" size="sm" className="mt-2">
        Reintentar
      </Button>
    )}
  </div>
);

const statusStyles: { [key: string]: string } = {
  'active': 'bg-green-100 text-green-700',
  'pending': 'bg-yellow-100 text-yellow-800',
  'rejected': 'bg-red-100 text-red-700',
};

type StoreStatusTab = 'pending' | 'approved' | 'rejected';

// --- Avatar ---
const StoreAvatar = ({ name }: { name: string }) => {
  const initial = name ? name.charAt(0).toUpperCase() : 'T';
  return (
    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-primary font-semibold flex-shrink-0 border border-line-light">
      {initial}
    </div>
  );
};

const AdminStoresPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'pending';

  const [activeTab, setActiveTab] = useState<StoreStatusTab>(initialTab as StoreStatusTab);
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingStoreId, setLoadingStoreId] = useState<number | null>(null);

  // --- Filtros ---
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [categoryOptions, setCategoryOptions] = useState<{ value: string, label: string }[]>([]);

  // --- Modal ---
  const [modalOpen, setModalOpen] = useState(false);
  const [modalState, setModalState] = useState<'confirm' | 'success'>('confirm');
  const [modalAction, setModalAction] = useState<'approve' | 'reject' | null>(null);
  const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null);

  const loadStores = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      let data: Store[] = [];
      if (activeTab === 'pending') {
        data = await getAdminPendingStores();
      } else if (activeTab === 'approved') {
        data = await getAdminApprovedStores();
      } else if (activeTab === 'rejected') {
        data = await getAdminRejectedStores();
      }
      setStores(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido al cargar tiendas");
    } finally {
      setIsLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categories = await getCategories();
        const options = categories.map((cat: Category) => ({
          value: cat.id.toString(),
          label: cat.name
        }));
        setCategoryOptions([{ value: '', label: 'Todas las Categorías' }, ...options]);
      } catch (error) {
        console.error("Error al cargar categorías", error);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    loadStores();
  }, [loadStores]);

  const changeTab = (tab: StoreStatusTab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const filteredStores = useMemo(() => {
    return stores
      .filter(store =>
        store.business_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.owner_name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .filter(store =>
        categoryFilter ? store.category_id === parseInt(categoryFilter) : true
      );
  }, [stores, searchQuery, categoryFilter]);

  // --- CONFIRM DIALOG LOGIC ---
  const openConfirmModal = (action: 'approve' | 'reject', storeId: number) => {
    setSelectedStoreId(storeId);
    setModalAction(action);
    setModalState('confirm');
    setModalOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedStoreId || !modalAction) return;

    setModalState('confirm');
    setLoadingStoreId(selectedStoreId);

    try {
      if (modalAction === 'approve') {
        await approveStore(selectedStoreId);
      } else {
        await rejectStore(selectedStoreId);
      }
      setStores(prev => prev.filter(s => s.id !== selectedStoreId));
      setModalState('success');
      setTimeout(() => setModalOpen(false), 1500);
    } catch (err) {
      console.error(err);
      alert(`Error al ${modalAction === 'approve' ? 'aprobar' : 'rechazar'} la tienda`);
    } finally {
      setLoadingStoreId(null);
    }
  };

  const renderContent = () => {
    if (isLoading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} onRetry={loadStores} />;
    if (stores.length > 0 && filteredStores.length === 0)
      return <p className="text-center text-text-muted p-8">No se encontraron tiendas que coincidan con tu búsqueda.</p>;
    if (filteredStores.length === 0)
      return <p className="text-center text-text-muted p-8">No hay tiendas en esta categoría.</p>;

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-secondary text-text-main">
            <tr>
              <th className="p-4 font-semibold">Nombre Tienda</th>
              <th className="p-4 font-semibold">Propietario</th>
              <th className="p-4 font-semibold">Dirección</th>
              <th className="p-4 font-semibold">Estado</th>
              <th className="p-4 font-semibold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredStores.map((store) => {
              const isCurrentLoading = loadingStoreId === store.id;
              return (
                <tr
                  key={store.id}
                  className={`border-t border-line-light transition-colors ${isCurrentLoading ? 'opacity-50 bg-secondary' : 'hover:bg-secondary-light'}`}
                >
                  <td className="p-4 font-medium text-text-main">
                    <div className="flex items-center gap-3">
                      <StoreAvatar name={store.business_name} />
                      <span>{store.business_name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-text-muted">{store.owner_name}</td>
                  <td className="p-4 text-text-muted max-w-xs truncate" title={store.address}>{store.address}</td>
                  <td className="p-4">
                    <span className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full ${statusStyles[store.status.toLowerCase()] || 'bg-gray-100 text-gray-700'}`}>
                      {store.status}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <Link to={`/admin/tienda/${store.id}`}>
                      <Button variant="ghost" size="sm" className="text-primary hover:bg-primary-light">
                        <EyeIcon className="w-4 h-4" />
                        <span>Ver</span>
                      </Button>
                    </Link>
                    {activeTab === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => openConfirmModal('approve', store.id)}
                          disabled={isCurrentLoading}
                        >
                          <CheckIcon className="w-4 h-4" />
                          <span>{isCurrentLoading ? '...' : 'Aprobar'}</span>
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => openConfirmModal('reject', store.id)}
                          disabled={isCurrentLoading}
                        >
                          <XMarkIcon className="w-4 h-4" />
                          <span>{isCurrentLoading ? '...' : 'Rechazar'}</span>
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const getTabClass = (tabName: StoreStatusTab) =>
    `px-4 py-2 font-medium text-sm rounded-md transition-colors ${
      activeTab === tabName
        ? 'bg-primary text-white shadow-sm'
        : 'text-text-muted hover:bg-secondary hover:text-text-main'
    }`;

  return (
    <>
      {/* --- Filtros --- */}
      <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
        <div className="relative w-full md:w-80">
          <Input
            id="searchStore"
            placeholder="Buscar por nombre de tienda o propietario..."
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
            options={categoryOptions}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 bg-surface p-1 rounded-lg border border-line-light shadow-sm inline-flex space-x-1">
        <button onClick={() => changeTab('pending')} className={getTabClass('pending')}>
          Pendientes
        </button>
        <button onClick={() => changeTab('approved')} className={getTabClass('approved')}>
          Aprobadas
        </button>
        <button onClick={() => changeTab('rejected')} className={getTabClass('rejected')}>
          Rechazadas
        </button>
      </div>

      {!isLoading && !error && (
        <p className="text-sm text-text-muted mb-4">
          Mostrando <span className="font-semibold text-text-main">{filteredStores.length}</span> de{' '}
          <span className="font-semibold text-text-main">{stores.length}</span> tiendas {activeTab}.
        </p>
      )}

      <Card className="overflow-hidden p-0">
        {renderContent()}
        {!isLoading && filteredStores.length > 0 && (
          <div className="p-4 border-t border-line-light flex justify-between items-center text-xs text-text-muted">
            <span>Página 1 de 1</span>
            <div className="flex gap-1">
              <Button variant="secondary" size="sm" className="px-2" disabled>
                &lt; Anterior
              </Button>
              <Button variant="secondary" size="sm" className="px-2">
                Siguiente &gt;
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* --- MODAL --- */}
      <ConfirmModal
        isOpen={modalOpen}
        title={
          modalState === 'success'
            ? 'Acción completada'
            : modalAction === 'approve'
            ? 'Confirmar aprobación'
            : 'Confirmar rechazo'
        }
        message={
          modalState === 'success'
            ? 'La acción se completó exitosamente.'
            : modalAction === 'approve'
            ? '¿Seguro que deseas aprobar esta tienda?'
            : '¿Seguro que deseas rechazar esta tienda?'
        }
        confirmText="Confirmar"
        cancelText="Cancelar"
        onConfirm={handleConfirmAction}
        onCancel={() => setModalOpen(false)}
        state={modalState}
      />
    </>
  );
};

export default AdminStoresPage;
