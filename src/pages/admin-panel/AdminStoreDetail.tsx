// File: src/pages/admin/AdminStoreDetail.tsx

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAdminStoreById, getAdminStoreStatsById } from '@/services/api/admin';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { ArrowLeftIcon } from '@heroicons/react/20/solid';
import type { Store, StoreStatsData } from '@/types';
import { useAuth } from '@/hooks/useAuth';

// 🗺️ Leaflet imports
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// ✅ Ajuste para evitar íconos rotos en Leaflet
const defaultIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

const AdminStoreDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [store, setStore] = useState<(Store & { user?: any }) | null>(null);
  const [stats, setStats] = useState<StoreStatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStoreData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (!user) {
          console.warn('⚠️ Usuario no disponible aún. Esperando para cargar datos...');
          return;
        }

        const storeData = await getAdminStoreById(id!);
        setStore(storeData);

        const statsData = await getAdminStoreStatsById(id!);
        setStats(statsData);
      } catch (err: any) {
        console.error('❌ Error en loadStoreData:', err);
        setError(err.message || 'Error al cargar los datos de la tienda');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) loadStoreData();
  }, [id, user]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        <p>{error}</p>
        <Link to="/admin/tiendas">
          <Button className="mt-4">Volver</Button>
        </Link>
      </div>
    );
  }

  if (!store) {
    return <p className="text-center p-8 text-text-muted">No se encontró la tienda solicitada.</p>;
  }

  const lat = parseFloat(store.latitude || '');
  const lng = parseFloat(store.longitude || '');
  const hasCoords = !isNaN(lat) && !isNaN(lng);

  return (
    <div className="space-y-6">
      {/* 🔙 Botón de regreso */}
      <div className="flex justify-between items-center">
        <Link to="/admin/tiendas">
          <Button variant="secondary" className="flex items-center gap-2">
            <ArrowLeftIcon className="w-4 h-4" /> Volver
          </Button>
        </Link>
        <h1 className="text-2xl font-semibold text-text-main">{store.business_name}</h1>
      </div>

      {/* 🏪 Información general */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4 text-text-main">Información general</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div><span className="font-semibold">Propietario:</span> {store.owner_name || store.user?.name || 'No disponible'}</div>
          <div><span className="font-semibold">Teléfono:</span> {store.phone || store.user?.phone || 'No disponible'}</div>
          <div><span className="font-semibold">Correo:</span> {store.user?.email || 'No disponible'}</div>
          <div><span className="font-semibold">Dirección:</span> {store.address || 'No disponible'}</div>
          <div><span className="font-semibold">Estado:</span> {store.status || 'No especificado'}</div>
          <div className="md:col-span-2">
            <span className="font-semibold">Descripción:</span> {store.description || 'Sin descripción'}
          </div>
        </div>

        {/* 🗺️ Mapa con ubicación y radio */}
        {hasCoords ? (
          <div className="mt-6 h-80 w-full rounded-lg overflow-hidden border border-gray-200">
            <MapContainer center={[lat, lng]} zoom={17} className="h-full w-full">
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
              />
              <Marker position={[lat, lng]}>
                <Popup>
                  <strong>{store.business_name}</strong>
                  <br />
                  {store.address}
                </Popup>
              </Marker>
              <Circle
                center={[lat, lng]}
                radius={6}
                pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.2 }}
              />
            </MapContainer>
          </div>
        ) : (
          <p className="text-sm text-text-muted mt-4">Ubicación no disponible</p>
        )}
      </Card>

      {/* 📊 Estadísticas */}
      {stats && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 text-text-main">Estadísticas</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">{stats.total_sales || 0}</p>
              <p className="text-sm text-text-muted">Ventas totales</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">{stats.total_products || 0}</p>
              <p className="text-sm text-text-muted">Productos</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">{stats.average_ticket || 0}</p>
              <p className="text-sm text-text-muted">Ticket promedio</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">{stats.low_stock || 0}</p>
              <p className="text-sm text-text-muted">Productos con bajo stock</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AdminStoreDetailPage;
