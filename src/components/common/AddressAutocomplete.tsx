// FileName: AddressAutocomplete.tsx
// Path: src/components/common/AddressAutocomplete.tsx

import React, { useState, useEffect, useRef } from 'react';
import { MapPinIcon } from '@heroicons/react/20/solid';

interface AddressSuggestion {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
}

interface AddressAutocompleteProps {
  value: string;
  onChange: (address: string) => void;
  onSelectLocation: (coords: { lat: number; lng: number; address: string }) => void;
  placeholder?: string;
}

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  value,
  onChange,
  onSelectLocation,
  placeholder = "Escribe una dirección para buscar..."
}) => {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cerrar sugerencias al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Buscar direcciones con Nominatim
  const searchAddress = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
        `q=${encodeURIComponent(query)}` +
        `&format=json` +
        `&addressdetails=1` +
        `&limit=5` +
        `&countrycodes=mx`, // Limitar a México, puedes quitar esto si quieres global
        {
          headers: {
            'Accept': 'application/json',
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSuggestions(data);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('Error buscando dirección:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce para no hacer muchas peticiones
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      searchAddress(newValue);
    }, 500);
  };

  // Seleccionar una sugerencia
  const handleSelectSuggestion = (suggestion: AddressSuggestion) => {
    onChange(suggestion.display_name);
    onSelectLocation({
      lat: parseFloat(suggestion.lat),
      lng: parseFloat(suggestion.lon),
      address: suggestion.display_name
    });
    setShowSuggestions(false);
    setIsFocused(false);
    setSuggestions([]);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <label className="block text-sm font-medium text-text-main mb-2">
        Dirección
      </label>
      
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <MapPinIcon className="w-5 h-5 text-text-muted" />
        </div>
        
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => {
            setIsFocused(true);
            if (suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2.5 border border-line-light bg-secondary rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-primary text-text-main
                     placeholder:text-text-muted transition-all"
        />

        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent"></div>
          </div>
        )}
      </div>

      {/* Lista de sugerencias */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-secondary border border-line-light rounded-lg shadow-lg max-h-64 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.place_id}
              onClick={() => handleSelectSuggestion(suggestion)}
              className="w-full text-left px-4 py-3 hover:bg-primary/10 transition-colors
                         border-b border-line-light last:border-b-0 flex items-start gap-3"
            >
              <MapPinIcon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-text-main line-clamp-2">
                  {suggestion.display_name}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {showSuggestions && suggestions.length === 0 && !isLoading && value.length >= 3 && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-secondary border border-line-light rounded-lg shadow-lg p-4">
          <p className="text-sm text-text-muted text-center">
            No se encontraron resultados para "{value}"
          </p>
        </div>
      )}
    </div>
  );
};

export default AddressAutocomplete;