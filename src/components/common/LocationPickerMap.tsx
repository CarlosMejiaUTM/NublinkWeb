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

// ✅ INTERFAZ ACTUALIZADA: Ahora incluye address opcional
interface LocationPickerMapProps {
  onLocationSelect: (coords: { lat: number; lng: number; address?: string }) => void;
  initialCenter?: [number, number];
  showAddressInPopup?: boolean;
}

/** Controlador interno de Leaflet */
const MapController = ({
  onMapClick,
  center,
}: {
  onMapClick: (coords: L.LatLng) => void;
  center: L.LatLng | null;
}) => {
  const map = useMap();

  // ✅ Recentrar el mapa cuando cambie la posición
  useEffect(() => {
    if (center) {
      map.flyTo(center, 16, {
        duration: 1.5, // Animación suave de 1.5 segundos
      });
    }
  }, [center, map]);

  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });

  return null;
};

const LocationPickerMap: React.FC<LocationPickerMapProps> = ({
  onLocationSelect,
  initialCenter = [20.9674, -89.5926],
  showAddressInPopup = false,
}) => {
  const [selectedPosition, setSelectedPosition] = useState<L.LatLng | null>(
    initialCenter ? L.latLng(initialCenter[0], initialCenter[1]) : null
  );
  const [currentAddress, setCurrentAddress] = useState<string>('');
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const markerRef = useRef<L.Marker>(null);

  // ✅ FUNCIÓN DE GEOCODIFICACIÓN INVERSA
  const getAddressFromCoords = async (lat: number, lng: number): Promise<string> => {
    setIsLoadingAddress(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?` +
        `lat=${lat}` +
        `&lon=${lng}` +
        `&format=json` +
        `&addressdetails=1`,
        {
          headers: {
            'Accept': 'application/json',
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        return data.display_name || '';
      }
    } catch (error) {
      console.error('Error obteniendo dirección:', error);
    } finally {
      setIsLoadingAddress(false);
    }
    return '';
  };

  // ✅ Actualizar posición cuando cambien las coordenadas desde fuera (ej: desde AddressAutocomplete)
  useEffect(() => {
    if (initialCenter && initialCenter[0] && initialCenter[1]) {
      const newPos = L.latLng(initialCenter[0], initialCenter[1]);
      // Solo actualizar si la posición realmente cambió
      if (!selectedPosition || 
          Math.abs(newPos.lat - selectedPosition.lat) > 0.00001 || 
          Math.abs(newPos.lng - selectedPosition.lng) > 0.00001) {
        setSelectedPosition(newPos);
      }
    }
  }, [initialCenter[0], initialCenter[1]]);

  // ✅ HANDLER ACTUALIZADO: Obtiene dirección automáticamente al hacer clic
  const handleMapClick = async (coords: L.LatLng) => {
    setSelectedPosition(coords);
    
    // Obtener dirección automáticamente
    const address = await getAddressFromCoords(coords.lat, coords.lng);
    setCurrentAddress(address);
    
    // Notificar al componente padre con coordenadas Y dirección
    onLocationSelect({ 
      lat: coords.lat, 
      lng: coords.lng,
      address: address 
    });
  };

  // ✅ EVENT HANDLERS ACTUALIZADOS: Obtiene dirección al arrastrar
  const eventHandlers = useMemo(
    () => ({
      async dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const newCoords = marker.getLatLng();
          setSelectedPosition(newCoords);
          
          // Obtener dirección automáticamente al arrastrar
          const address = await getAddressFromCoords(newCoords.lat, newCoords.lng);
          setCurrentAddress(address);
          
          // Notificar al componente padre con coordenadas Y dirección
          onLocationSelect({ 
            lat: newCoords.lat, 
            lng: newCoords.lng,
            address: address 
          });
        }
      },
    }),
    [onLocationSelect]
  );

  return (
    <div
      className="bg-surface rounded-xl border border-line-light shadow-sm overflow-hidden"
      style={{
        position: "relative",
        zIndex: 0,
      }}
    >
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

        <MapController onMapClick={handleMapClick} center={selectedPosition} />

        {selectedPosition && (
          <>
            <Marker
              position={selectedPosition}
              draggable={true}
              eventHandlers={eventHandlers}
              ref={markerRef}
            >
              <Popup>
                <div className="text-sm">
                  <p className="font-semibold mb-1">📍 Ubicación seleccionada</p>
                  <p className="text-xs text-gray-600 mb-2">
                    Arrastra el pin para ajustar
                  </p>
                  {showAddressInPopup && currentAddress && (
                    <p className="text-xs text-gray-700 mt-2 border-t pt-2">
                      {currentAddress}
                    </p>
                  )}
                  {isLoadingAddress && (
                    <p className="text-xs text-gray-500 italic">
                      Obteniendo dirección...
                    </p>
                  )}
                </div>
              </Popup>
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