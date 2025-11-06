// FileName: LocationPickerMap.tsx
// Path: src/components/common/LocationPickerMap.tsx

import React, { useState, useEffect, useMemo, useRef } from "react";
import { MapContainer, TileLayer, Marker, Circle, useMap, useMapEvents, Popup } from "react-leaflet";
import L from "leaflet";

// --- Arreglo para el icono por defecto de Leaflet ---
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface LocationPickerMapProps {
  onLocationSelect: (coords: { lat: number; lng: number }) => void;
  initialCenter?: [number, number];
}

/** Controlador interno de Leaflet */
const MapController = ({
  onMapClick,
  onLocationFound,
}: {
  onMapClick: (coords: L.LatLng) => void;
  onLocationFound: (coords: [number, number]) => void;
}) => {
  const map = useMap();

  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });

  useEffect(() => {
    // navigator.geolocation.getCurrentPosition((position) => {
    //   const coords: [number, number] = [position.coords.latitude, position.coords.longitude];
    //   map.setView(coords, 16);
    //   onLocationFound(coords);
    // });
  }, [map, onLocationFound]);

  return null;
};

const LocationPickerMap: React.FC<LocationPickerMapProps> = ({
  onLocationSelect,
  initialCenter = [20.9674, -89.5926],
}) => {
  const [selectedPosition, setSelectedPosition] = useState<L.LatLng | null>(null);
  const markerRef = useRef<L.Marker>(null);

  const handleMapClick = (coords: L.LatLng) => {
    setSelectedPosition(coords);
    onLocationSelect({ lat: coords.lat, lng: coords.lng });
  };

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const newCoords = marker.getLatLng();
          setSelectedPosition(newCoords);
          onLocationSelect({ lat: newCoords.lat, lng: newCoords.lng });
        }
      },
    }),
    [onLocationSelect]
  );

  return (
    // ✅ Envolvemos el mapa en un div aislado con z-index bajo
    <div
      className="bg-surface rounded-xl border border-line-light shadow-sm overflow-hidden"
      style={{
        position: "relative",
        zIndex: 0, // Mantiene el mapa detrás de la modal
      }}
    >
      {/* --- Estilos de corrección directamente en el componente --- */}
      <style>
        {`
          .leaflet-container, 
          .leaflet-pane, 
          .leaflet-control, 
          .leaflet-top, 
          .leaflet-bottom {
            z-index: 0 !important;
          }
        `}
      </style>

      <MapContainer
        center={initialCenter}
        zoom={16}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        <MapController
          onMapClick={handleMapClick}
          onLocationFound={() => {}}
        />

        {selectedPosition && (
          <>
            <Marker
              position={selectedPosition}
              draggable={true}
              eventHandlers={eventHandlers}
              ref={markerRef}
            >
              <Popup>Puedes arrastrar este pin para afinar la ubicación.</Popup>
            </Marker>

            <Circle
              center={selectedPosition}
              radius={6}
              pathOptions={{
                color: "#4B43B3",
                fillColor: "#4B43B3",
                fillOpacity: 0.2,
              }}
            />
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default LocationPickerMap;
