// FileName: Select.tsx
// Path: src/components/common/Select.tsx

import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  containerClassName?: string;
  isOptional?: boolean;
}

const Select = ({ label, id, options, containerClassName = '', isOptional = false, className, ...props }: SelectProps) => {
  // Icono de flecha SVG para reemplazar el nativo
  const ArrowDownIcon = () => (
    <svg className="h-5 w-5 text-text-muted" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );

  return (
    <div className={`relative ${containerClassName}`}>
      <label htmlFor={id} className="block text-sm font-medium text-text-main mb-1.5">
        {label} {isOptional && <span className="text-text-muted font-normal text-xs">(Optional)</span>}
      </label>
      <select
        id={id}
        className={`w-full px-4 py-2.5 border border-line-light bg-secondary rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary text-text-main text-sm appearance-none cursor-pointer ${className}`} // appearance-none para quitar flecha nativa
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center pointer-events-none"> {/* Ajuste de top-6 para alinear con label */}
        <ArrowDownIcon />
      </div>
    </div>
  );
};

export default Select;