// FileName: Input.tsx
// Path: src/components/common/Input.tsx

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  containerClassName?: string;
  isOptional?: boolean; // Para marcar campos opcionales
}

const Input = ({ label, id, containerClassName = '', isOptional = false, className, ...props }: InputProps) => {
  return (
    <div className={containerClassName}>
      <label htmlFor={id} className="block text-sm font-medium text-text-main mb-1.5">
        {label} {isOptional && <span className="text-text-muted font-normal text-xs">(Optional)</span>}
      </label>
      <input
        id={id}
        className={`w-full px-4 py-2.5 border border-line-light bg-secondary rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary placeholder-text-muted/60 text-sm ${className}`} // Padding ajustado y texto más pequeño
        {...props}
      />
    </div>
  );
};

export default Input;