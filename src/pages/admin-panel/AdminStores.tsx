// FileName: AdminStores.tsx
// Path: src/pages/admin-panel/AdminStores.tsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import ConfirmModal from "../../components/common/ConfirmModal";
import ToastsContainer from "../../components/common/Toast";
import { useToast } from "../../hooks/useToast";
import type { Store, Category } from "../../types";

import {
  getAdminPendingStores,
  getAdminApprovedStores,
  getAdminRejectedStores,
  approveStore,
  rejectStore,
  getCategories,
} from '../../services/api/admin';

import {
  CheckIcon,
  XMarkIcon,
  EyeIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/20/solid';

/* ============================================================
   🌀 COMPONENTES AUXILIARES
   ============================================================ */
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-48">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

const ErrorMessage = ({ message, onRetry }: { message: string; onRetry?: () => void }) => (
  <div className="p-4 text-center text-red-600 bg-red-100 rounded-lg border border-red-200">
    <p>{message}</p>
    {onRetry && (
      <Button onClick={onRetry} variant="secondary" size="sm" className="mt-2">
        Reintentar
      </Button>
    )}
  </div>
);

const statusStyles: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  approved: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-800',
  rejected: 'bg-red-100 text-red-700',
};

const StoreAvatar = ({ name }: { name: string }) => {
  const initial = name ? name.charAt(0).toUpperCase() : 'T';
  return (
    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-primary font-semibold flex-shrink-0 border border-line-light">
      {initial}
    </div>
  );
};

/* ============================================================
   🧠 PÁGINA PRINCIPAL
   ============================================================ */
const AdminStoresPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get('tab') as 'pending' | 'approved' | 'rejected') || 'pending';
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>(initialTab);

  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingStoreId, setLoadingStoreId] = useState<number | null>(null);

  // --- Filtros ---
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [categoryOptions, setCategoryOptions] = useState<{ value: string; label: string }[]>([]);

  // --- Modal ---
  const [modalOpen, setModalOpen] = useState(false);
  const [modalState, setModalState] = useState<'confirm' | 'loading' | 'success'>('confirm');
  const [modalAction, setModalAction] = useState<'approve' | 'reject' | null>(null);
  const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null);

  // --- Toast system ---
  const { toasts, push } = useToast();

  /* ============================================================
     📡 Cargar tiendas
     ============================================================ */
  const loadStores = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      let data: Store[] = [];

      if (activeTab === 'pending') data = await getAdminPendingStores();
      if (activeTab === 'approved') data = await getAdminApprovedStores();
      if (activeTab === 'rejected') data = await getAdminRejectedStores();

      setStores(data || []);
    } catch (err) {
      console.error("❌ Error al cargar tiendas:", err);
      setError(err instanceof Error ? err.message : "Error desconocido al cargar tiendas");
    } finally {
      setIsLoading(false);
    }
  }, [activeTab]);

  /* ============================================================
     🏷️ Cargar categorías
     ============================================================ */
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
        console.error("❌ Error al cargar categorías:", error);
      }
    };
    loadCategories();
  }, []);

  // 🔁 Recargar al cambiar pestaña
  useEffect(() => {
    loadStores();
  }, [loadStores]);

  /* ============================================================
     🔀 Cambio de pestaña
     ============================================================ */
  const changeTab = (tab: 'pending' | 'approved' | 'rejected') => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  /* ============================================================
     🔎 Filtros
     ============================================================ */
  const filteredStores = useMemo(() => {
    return stores
      .filter(store =>
        (store.business_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (store.owner_name?.toLowerCase() || '').includes(searchQuery.toLowerCase())
      )
      .filter(store =>
        categoryFilter ? store.category_id === parseInt(categoryFilter) : true
      );
  }, [stores, searchQuery, categoryFilter]);

  /* ============================================================
     ⚙️ Modal de confirmación
     ============================================================ */
  const openConfirmModal = (action: 'approve' | 'reject', storeId: number) => {
    setSelectedStoreId(storeId);
    setModalAction(action);
    setModalState('confirm');
    setModalOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedStoreId || !modalAction) return;

    setModalState('loading');
    setLoadingStoreId(selectedStoreId);

    try {
      if (modalAction === 'approve') {
        await approveStore(selectedStoreId.toString());
        push("Tienda aprobada correctamente", "success");
      } else {
        await rejectStore(selectedStoreId.toString());
        push("Tienda rechazada correctamente", "success");
      }

      // 🔁 Actualizar lista
      setStores(prev => prev.filter(s => s.id !== selectedStoreId));
      setModalState('success');
      setTimeout(() => setModalOpen(false), 1500);
    } catch (err) {
      console.error(err);
      push("Error al procesar la acción", "error");
      setModalState('confirm');
    } finally {
      setLoadingStoreId(null);
    }
  };

  /* ============================================================
     🧾 Render principal
     ============================================================ */
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
                  className={`border-t border-line-light transition-colors ${
                    isCurrentLoading ? 'opacity-50 bg-secondary' : 'hover:bg-secondary-light'
                  }`}
                >
                  <td className="p-4 font-medium text-text-main">
                    <div className="flex items-center gap-3">
                      <StoreAvatar name={store.business_name} />
                      <span>{store.business_name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-text-muted">{store.owner_name}</td>
                  <td className="p-4 text-text-muted max-w-xs truncate" title={store.address}>
                    {store.address}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full ${
                        statusStyles[store.status?.toLowerCase()] || 'bg-gray-100 text-gray-700'
                      }`}
                    >
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

  /* ============================================================
     🎛️ Tabs + Layout
     ============================================================ */
  const getTabClass = (tabName: 'pending' | 'approved' | 'rejected') =>
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

      {/* --- TOASTS --- */}
      <ToastsContainer toasts={toasts} />
    </>
  );
};

export default AdminStoresPage;
