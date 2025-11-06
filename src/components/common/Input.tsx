// FileName: Input.tsx
// Path: src/components/common/Input.tsx

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string; // Hacemos 'id' obligatorio para el 'htmlFor' de la label
  containerClassName?: string;
  isOptional?: boolean;
  /** Opcional: Añade un icono SVG (como ReactNode) al inicio del input */
  icon?: React.ReactNode;
  /** Opcional: Muestra un mensaje de error y cambia el estilo */
  error?: string;
}

const Input = ({ 
  label, 
  id, 
  containerClassName = '', 
  isOptional = false, 
  icon, 
  error, 
  className, 
  ...props 
}: InputProps) => {
  
  // --- Estilos Base ---
  // El estilo 'base' (gris claro) que ya tenías
  const baseInputStyles = 'w-full border border-line-light bg-secondary rounded-lg shadow-sm placeholder-text-muted/60 text-sm transition-colors duration-200 ease-in-out';
  
  // --- Estilos de Focus ---
  // El estilo 'focus' (blanco y con anillo primario)
  const focusInputStyles = 'focus:bg-surface focus:ring-2 focus:ring-primary';

  // --- ¡NUEVO! Estilos de Error ---
  // Estilo visual para cuando hay un error
  const errorInputStyles = error 
    ? 'border-red-500 ring-1 ring-red-500 focus:ring-red-500 focus:border-red-500' // Borde y anillo rojos
    : 'focus:border-primary'; // Borde primario normal en focus

  // --- ¡NUEVO! Estilos de Padding ---
  // Ajusta el padding si hay un icono, para que el texto no se encime
  const paddingStyles = icon ? 'pl-10 pr-4 py-2.5' : 'px-4 py-2.5';

  return (
    <div className={containerClassName}>
      <label htmlFor={id} className="block text-sm font-medium text-text-main mb-1.5">
        {label} {isOptional && <span className="text-text-muted font-normal text-xs">(Opcional)</span>}
      </label>
      
      {/* ¡NUEVO! Contenedor relativo para el icono */}
      <div className="relative">
        
        {/* ¡NUEVO! Icono (si existe) */}
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {/* Clona el icono para añadirle clases de estilo (color) */}
            {React.cloneElement(icon as React.ReactElement, {
              className: `w-5 h-5 ${error ? 'text-red-500' : 'text-text-muted'}`, // El icono se pone rojo con el error
            })}
          </div>
        )}
        
        <input
          id={id}
          className={`
            ${baseInputStyles} 
            ${focusInputStyles} 
            ${errorInputStyles} 
            ${paddingStyles} 
            ${className}
          `}
          {...props}
        />
      </div>
      
      {/* ¡NUEVO! Mensaje de Error (si existe) */}
      {error && (
        <p className="mt-1.5 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Input;