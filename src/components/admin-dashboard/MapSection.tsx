// FileName: MapSection.tsx
// Path: src/components/admin-dashboard/MapSection.tsx

import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { Store } from "../../types";
import L from "leaflet";

// Soluciona ícono roto por defecto de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

interface MapSectionProps {
  stores: Store[];
}

export const MapSection: React.FC<MapSectionProps> = ({ stores }) => {
  const defaultPosition: [number, number] = [19.4326, -99.1332]; // CDMX por defecto

  return (
    <div className="bg-white rounded-lg p-4 border border-line-light shadow-md">
      <h2 className="font-semibold text-lg mb-3">Mapa de tiendas activas</h2>

      <MapContainer
        center={defaultPosition}
        zoom={6}
        className="h-80 w-full rounded-lg z-0"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {stores
          .filter((s) => s.latitude && s.longitude)
          .map((store) => (
            <Marker key={store.id} position={[Number(store.latitude), Number(store.longitude)]}>
              <Popup>
                <strong>{store.business_name}</strong>
                <br />
                {store.address}
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
};
