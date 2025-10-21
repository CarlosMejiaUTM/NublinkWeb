// FileName: Button.tsx
// Path: src/components/common/Button.tsx

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'; // Ghost añadido para botones sin fondo
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const Button = ({ variant = 'primary', size = 'md', children, className, ...props }: ButtonProps) => {
  const baseStyles = 'rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs', // Ajustado para botones más pequeños
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const variantStyles = {
    primary: 'bg-primary text-white hover:bg-primary-dark focus:ring-primary shadow-sm', // Sin sombra exagerada
    secondary: 'bg-secondary text-text-main hover:bg-line-light focus:ring-primary border border-line-light', // Con borde sutil
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 shadow-sm',
    ghost: 'bg-transparent text-text-muted hover:bg-secondary focus:ring-primary', // Para acciones menos importantes
  };

  return (
    <button className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;