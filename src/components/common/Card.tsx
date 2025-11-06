// FileName: Card.tsx
// Path: src/components/common/Card.tsx

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  paddingClass?: string; // Para controlar el padding (ej. 'p-0' para tablas)
  /** Añade una micro-interacción de 'levantarse' al pasar el cursor */
  hoverEffect?: boolean;
}

const Card = ({ 
  children, 
  className = '', 
  title, 
  paddingClass = 'p-4 sm:p-6', // Padding por defecto generoso
  hoverEffect = false // Por defecto, las tarjetas son estáticas
}: CardProps) => {

  // --- Estilos Base Mejorados ---
  // 1. Sombra 'shadow-md' para más profundidad (vs 'shadow-sm')
  // 2. Transición 'transition-all' para animaciones suaves
  // 3. 'duration-300' y 'ease-in-out' para una animación elegante
  const baseStyles = `bg-surface rounded-xl border border-line-light shadow-md transition-all duration-300 ease-in-out`;

  // --- Estilo Hover Opcional ---
  // 4. Efecto "wow": al pasar el cursor, la sombra se expande y la tarjeta se levanta
  const hoverStyles = hoverEffect 
    ? 'hover:shadow-lg hover:-translate-y-1' 
    : '';

  return (
    <div className={`${baseStyles} ${hoverStyles} ${className}`}>
      {title && (
        // 5. Título con más espaciado (py-4) y más grande (text-lg)
        <div className="px-4 py-4 sm:px-6 border-b border-line-light">
          <h2 className="text-lg font-semibold text-text-main">{title}</h2>
        </div>
      )}
      <div className={paddingClass}>
        {children}
      </div>
    </div>
  );
};

export default Card;