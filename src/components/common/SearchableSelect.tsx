// FileName: SearchableSelect.tsx
// Path: src/components/common/SearchableSelect.tsx

import React, { useState, useRef, useEffect } from 'react';
import { ChevronUpDownIcon, CheckIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid';

interface Option {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  id: string;
  label: string;
  options: Option[];
  value: string | number | null;
  onChange: (value: string) => void;
  icon?: React.ReactNode;
  placeholder?: string;
}

const SearchableSelect = ({ label, options, value, onChange, icon, placeholder = "Seleccionar..." }: SearchableSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Encontrar la etiqueta de la opción seleccionada actualmente
  const selectedOption = options.find(opt => opt.value === value?.toString());

  // Filtrar las opciones basado en lo que escribe el usuario
  const filteredOptions = options.filter(opt =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Cerrar el menú si se hace clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  return (
    <div className="w-full relative" ref={wrapperRef}>
      <label className="block text-sm font-medium text-text-muted mb-1.5 ml-1">
        {label}
      </label>
      
      {/* Botón principal que abre el menú */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-full cursor-pointer rounded-xl bg-secondary py-3 pl-10 pr-10 text-left shadow-sm border border-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-text-main sm:text-sm"
      >
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-text-muted">
            {icon}
        </span>
        <span className={`block truncate ${!selectedOption ? 'text-gray-400' : ''}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </span>
      </button>

      {/* Menú Desplegable */}
      {isOpen && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          
          {/* Input de Búsqueda dentro del menú */}
          <div className="sticky top-0 z-10 bg-white px-2 py-2 border-b">
             <div className="relative">
                <MagnifyingGlassIcon className="pointer-events-none absolute inset-y-0 left-2 h-full w-4 text-gray-400" />
                <input
                    type="text"
                    className="w-full rounded-md border border-gray-300 py-1 pl-8 pr-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                    placeholder="Buscar categoría..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                />
             </div>
          </div>

          {/* Lista de Opciones Filtradas */}
          {filteredOptions.length === 0 ? (
            <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
              No se encontraron resultados.
            </div>
          ) : (
            filteredOptions.map((option) => (
              <div
                key={option.value}
                className={`relative cursor-pointer select-none py-2 pl-10 pr-4 hover:bg-primary/10 hover:text-primary ${
                   (value?.toString() === option.value) ? 'bg-primary/5 text-primary font-semibold' : 'text-text-main'
                }`}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                  setSearchTerm(''); // Resetear búsqueda al seleccionar
                }}
              >
                <span className={`block truncate`}>
                  {option.label}
                </span>
                {value?.toString() === option.value ? (
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                  </span>
                ) : null}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;