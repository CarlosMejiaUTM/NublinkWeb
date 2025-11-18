// ✅ File: src/pages/admin/AdminStoreDetail.tsx

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAdminStoreById, getAdminStoreStatsById } from '@/services/api/admin';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { ArrowLeftIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/20/solid';
import type { Store, StoreStatsData } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// 🧭 Ajuste para íconos rotos en Leaflet
const defaultIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

// 🎯 Botón para centrar el mapa
const RecenterButton = ({ lat, lng }: { lat: number; lng: number }) => {
  const map = useMap();
  return (
    <button
      onClick={() => map.setView([lat, lng], 17)}
      className="absolute z-[999] bottom-3 right-3 bg-white rounded-lg shadow-md p-2 text-xs font-semibold hover:bg-gray-100"
    >
      Centrar
    </button>
  );
};

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-800',
  rejected: 'bg-red-100 text-red-700',
};

const AdminStoreDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [store, setStore] = useState<(Store & { user?: any }) | null>(null);
  const [stats, setStats] = useState<StoreStatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      setError(null);

      console.log(`🟢 Cargando tienda ID: ${id}...`);

      // 🔹 Obtener detalles de la tienda
      const storeData = await getAdminStoreById(id);
      setStore(storeData);
      console.log("✅ Tienda cargada:", storeData);

      // 🔹 Obtener estadísticas
      const statsData = await getAdminStoreStatsById(id);
      setStats(statsData);
      console.log("📊 Estadísticas cargadas:", statsData);
    } catch (err: any) {
      console.error("❌ Error al cargar tienda:", err);
      if (err.message?.includes("404")) {
        setError("No se encontró la tienda solicitada (404).");
      } else {
        setError("Error al cargar los datos de la tienda.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id && user) loadData();
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
        <Button onClick={loadData} className="mt-4" variant="secondary">
          Reintentar
        </Button>
      </div>
    );
  }

  if (!store) {
    return (
      <p className="text-center p-8 text-text-muted">
        No se encontró la tienda solicitada.
      </p>
    );
  }

  const lat = parseFloat(store.latitude || '');
  const lng = parseFloat(store.longitude || '');
  const hasCoords = !isNaN(lat) && !isNaN(lng);

  const formatted = (num?: number) => (num ? num.toLocaleString() : '0');

  return (
    <div className="space-y-6">
      {/* 🔙 Header */}
      <div className="flex justify-between items-center">
        <Link to="/admin/tiendas">
          <Button variant="secondary" className="flex items-center gap-2">
            <ArrowLeftIcon className="w-4 h-4" /> Volver
          </Button>
        </Link>
        <h1 className="text-2xl font-semibold text-text-main">
          {store.business_name || 'Tienda sin nombre'}
        </h1>
      </div>

      {/* 🏪 Información general */}
      <Card className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-lg font-semibold text-text-main">Información general</h2>
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              statusColors[store.status] || 'bg-gray-100 text-gray-700'
            }`}
          >
            {store.status || 'Desconocido'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-semibold">Propietario:</span>{' '}
            {store.owner_name || store.user?.name || 'No disponible'}
          </div>
          <div>
            <span className="font-semibold">Teléfono:</span>{' '}
            {store.phone || store.user?.phone || 'No disponible'}
          </div>
          <div>
            <span className="font-semibold">Correo:</span>{' '}
            {store.user?.email || 'No disponible'}
          </div>
          <div>
            <span className="font-semibold">Dirección:</span>{' '}
            {store.address || 'No disponible'}
          </div>
          <div className="md:col-span-2">
            <span className="font-semibold">Descripción:</span>{' '}
            {store.description || 'Sin descripción'}
          </div>
        </div>

        {/* 📞 Contacto */}
        <div className="flex gap-3 mt-6">
          {store.user?.email && (
            <a href={`mailto:${store.user.email}`}>
              <Button variant="ghost" className="flex items-center gap-2">
                <EnvelopeIcon className="w-4 h-4" /> Enviar correo
              </Button>
            </a>
          )}
          {store.phone && (
            <a
              href={`https://wa.me/${store.phone.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="ghost" className="flex items-center gap-2">
                <PhoneIcon className="w-4 h-4" /> WhatsApp
              </Button>
            </a>
          )}
        </div>

        {/* 🗺️ Mapa */}
        {hasCoords ? (
          <div className="relative mt-6 h-80 w-full rounded-lg overflow-hidden border border-gray-200">
            <MapContainer center={[lat, lng]} zoom={17} className="h-full w-full">
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[lat, lng]}>
                <Popup>
                  <strong>{store.business_name}</strong>
                  <br />
                  {store.address}
                </Popup>
              </Marker>
              <Circle
                center={[lat, lng]}
                radius={10}
                pathOptions={{ color: 'blue', fillOpacity: 0.2 }}
              />
              <RecenterButton lat={lat} lng={lng} />
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
            {[
              { label: 'Ventas totales', value: formatted(stats.total_sales) },
              { label: 'Productos', value: formatted(stats.total_products) },
              { label: 'Ticket promedio', value: `$${formatted(stats.average_ticket)}` },
              { label: 'Bajo stock', value: formatted(stats.low_stock) },
            ].map((item, i) => (
              <div key={i} className="p-4 bg-secondary rounded-lg shadow-sm">
                <p className="text-2xl font-bold text-primary">{item.value}</p>
                <p className="text-sm text-text-muted">{item.label}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default AdminStoreDetailPage;
