// FileName: Select.tsx
// Path: src/components/common/Select.tsx

import React from 'react';

// --- ¡NUEVO! Icono de Chevron (más profesional) ---
const ChevronUpDownIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75L15.75 15m-7.5-6L12 5.25L15.75 9" />
  </svg>
);
// --- Fin del Icono ---

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  id: string; // Hacemos 'id' obligatorio
  options: SelectOption[];
  containerClassName?: string;
  isOptional?: boolean;
  /** Opcional: Añade un icono SVG (como ReactNode) al inicio */
  icon?: React.ReactNode;
  /** Opcional: Muestra un mensaje de error y cambia el estilo */
  error?: string;
}

const Select = ({ 
  label, 
  id, 
  options, 
  containerClassName = '', 
  isOptional = false, 
  icon, 
  error, 
  className, 
  ...props 
}: SelectProps) => {

  // --- Estilos Base ---
  const baseSelectStyles = 'w-full border border-line-light bg-secondary rounded-lg shadow-sm placeholder-text-muted/60 text-sm transition-colors duration-200 ease-in-out appearance-none cursor-pointer';
  
  // --- Estilos de Focus ---
  const focusSelectStyles = 'focus:bg-surface focus:ring-2 focus:ring-primary';

  // --- ¡NUEVO! Estilos de Error ---
  const errorSelectStyles = error 
    ? 'border-red-500 ring-1 ring-red-500 focus:ring-red-500 focus:border-red-500' // Borde y anillo rojos
    : 'focus:border-primary'; // Borde primario normal

  // --- ¡NUEVO! Estilos de Padding ---
  // pr-10 para dejar espacio a la flecha, pl-10 si hay icono
  const paddingStyles = icon ? 'pl-10 pr-10 py-2.5' : 'px-4 pr-10 py-2.5';

  return (
    <div className={containerClassName}>
      <label htmlFor={id} className="block text-sm font-medium text-text-main mb-1.5">
        {label} {isOptional && <span className="text-text-muted font-normal text-xs">(Opcional)</span>}
      </label>
      
      {/* ¡NUEVO! Contenedor relativo para el select y los iconos */}
      <div className="relative">

        {/* ¡NUEVO! Icono Izquierdo (si existe) */}
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
            {React.cloneElement(icon as React.ReactElement, {
              className: `w-5 h-5 ${error ? 'text-red-500' : 'text-text-muted'}`,
            })}
          </div>
        )}

        <select
          id={id}
          className={`
            ${baseSelectStyles} 
            ${focusSelectStyles} 
            ${errorSelectStyles} 
            ${paddingStyles} 
            ${className}
          `}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        {/* Icono de Flecha (Derecho) */}
        <div className={`absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none ${error ? 'text-red-500' : 'text-text-muted'}`}>
          <ChevronUpDownIcon className="w-5 h-5" />
        </div>
      </div>

      {/* ¡NUEVO! Mensaje de Error (si existe) */}
      {error && (
        <p className="mt-1.5 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Select;