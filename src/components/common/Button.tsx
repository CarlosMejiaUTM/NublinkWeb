// FileName: Button.tsx
// Path: src/components/common/Button.tsx

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const Button = ({ variant = 'primary', size = 'md', children, className, ...props }: ButtonProps) => {
  
  // --- ESTILOS BASE MEJORADOS ---
  // Añadimos 'ease-in-out' y 'duration-150' para una transición más nítida
  // Añadimos 'active:scale-[.98]' para el efecto de "presionar"
  // Añadimos 'disabled:transform-none disabled:shadow-none' para un estado deshabilitado claro
  const baseStyles = 'rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none flex items-center justify-center gap-2 active:scale-[.98]';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  // --- ESTILOS DE VARIANTE MEJORADOS ---
  // Ajustamos el 'hover' y 'shadow' para que sean más coherentes
  const variantStyles = {
    outline: 'bg-transparent text-main flex-1 border-2  hover:bg-secondary/10 focus:ring-primary shadow-sm hover:shadow-md',
    primary: 'bg-primary text-white hover:bg-primary-dark focus:ring-primary shadow-md hover:shadow-lg transform hover:-translate-y-0.5',
    secondary: 'bg-surface text-text-main hover:bg-secondary focus:ring-primary border border-line-light shadow-sm hover:shadow-md', // Cambiado a 'bg-surface' (blanco) para más contraste
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 shadow-md hover:shadow-lg transform hover:-translate-y-0.5',
    ghost: 'bg-transparent text-text-muted hover:bg-secondary focus:ring-primary hover:text-text-main active:scale-100', // Ghost no debe encogerse
  };

  return (
    <button className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;