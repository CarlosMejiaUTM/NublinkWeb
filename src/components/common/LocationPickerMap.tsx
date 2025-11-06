// FileName: LocationPickerMap.tsx
// Path: src/components/common/LocationPickerMap.tsx

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Circle, useMap, useMapEvents, Popup } from 'react-leaflet';
import L from 'leaflet';

// --- Arreglo para el icono por defecto de Leaflet (Sin cambios) ---
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});
// --- Fin del arreglo ---

interface LocationPickerMapProps {
  onLocationSelect: (coords: { lat: number; lng: number }) => void;
  initialCenter?: [number, number];
}

/**
 * Componente interno para manejar los eventos del mapa y la geolocalización.
 * Debe ser un hijo de <MapContainer> para usar los hooks de Leaflet.
 */
const MapController = ({ onMapClick, onLocationFound }: { onMapClick: (coords: L.LatLng) => void, onLocationFound: (coords: [number, number]) => void }) => {
  const map = useMap();

  // Hook para escuchar clics en el mapa
  useMapEvents({
    click(e) {
      onMapClick(e.latlng); // Envía las coordenadas al componente padre
    },
  });

  // Hook para centrar el mapa en la ubicación del usuario al cargar
  useEffect(() => {
    // navigator.geolocation.getCurrentPosition(
    //   (position) => {
    //     const coords: [number, number] = [position.coords.latitude, position.coords.longitude];
    //     map.setView(coords, 16); // Centra el mapa en el usuario
    //     onLocationFound(coords); // Opcional: informa al padre
    //   },
    //   (error) => {
    //     console.warn("Error getting geolocation:", error.message);
    //     // Si falla, simplemente se queda en 'initialCenter'
    //   },
    //   { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    // );
    // Comentado temporalmente, 'getCurrentPosition' puede ser lento
    // y a veces es mejor que el usuario mueva el mapa manualmente.
    // Lo dejamos centrado en Mérida por ahora.
  }, [map, onLocationFound]); // Se ejecuta una vez al montar

  return null;
};

const LocationPickerMap: React.FC<LocationPickerMapProps> = ({
  onLocationSelect,
  initialCenter = [20.9674, -89.5926] // Mérida
}) => {
  const [selectedPosition, setSelectedPosition] = useState<L.LatLng | null>(null);
  const markerRef = useRef<L.Marker>(null); // Referencia al marcador

  const handleMapClick = (coords: L.LatLng) => {
    setSelectedPosition(coords);
    onLocationSelect({ lat: coords.lat, lng: coords.lng });
  };

  // --- ¡NUEVO! Manejador para cuando el usuario termina de ARRASTRAR el pin ---
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const newCoords = marker.getLatLng();
          setSelectedPosition(newCoords); // Actualiza el estado
          onLocationSelect({ lat: newCoords.lat, lng: newCoords.lng }); // Envía al padre
        }
      },
    }),
    [onLocationSelect],
  );

  return (
    // --- ¡NUEVO! Contenedor estilizado ---
    // Le damos el mismo estilo que una Card para que se integre
    <div className="bg-surface rounded-xl border border-line-light shadow-sm overflow-hidden z-0">
      <MapContainer 
        center={initialCenter} 
        zoom={16} 
        style={{ height: '400px', width: '100%' }} // zIndex 0 ya no es necesario aquí
      >
        {/* --- ¡NUEVO! Tiles de Mapa (Diseño Profesional) --- */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        
        <MapController 
          onMapClick={handleMapClick} 
          onLocationFound={(coords) => {
            // Opcional: ¿Seleccionar automáticamente la ubicación encontrada?
            // handleMapClick(L.latLng(coords[0], coords[1]));
          }}
        />

        {selectedPosition && (
          <>
            {/* --- ¡NUEVO! Marcador Arrastrable --- */}
            <Marker
              position={selectedPosition}
              draggable={true}
              eventHandlers={eventHandlers}
              ref={markerRef}
            >
              <Popup>Puedes arrastrar este pin para afinar la ubicación.</Popup>
            </Marker>
            
            {/* Círculo con radio de 6m y color primario */}
            <Circle
              center={selectedPosition}
              radius={6} // <-- Radio de 6 metros
              pathOptions={{ 
                color: '#4B43B3', // Tu color 'primary'
                fillColor: '#4B43B3', 
                fillOpacity: 0.2 
              }}
            />
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default LocationPickerMap;