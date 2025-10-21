// FileName: Card.tsx
// Path: src/components/common/Card.tsx

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string; // Título opcional para la tarjeta
}

const Card = ({ children, className = '', title }: CardProps) => {
  return (
    <div className={`bg-surface rounded-xl border border-line-light shadow-sm ${className}`}>
      {title && (
        <div className="p-4 sm:p-5 border-b border-line-light">
          <h2 className="text-base font-semibold text-text-main">{title}</h2>
        </div>
      )}
      <div className={`p-4 sm:p-5 ${title ? '' : ''}`}> {/* Ajusta padding si hay título */}
        {children}
      </div>
    </div>
  );
};

export default Card;