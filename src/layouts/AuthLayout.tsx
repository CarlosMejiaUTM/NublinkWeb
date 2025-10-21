// FileName: AuthLayout.tsx
// Path: src/layouts/AuthLayout.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button'; // Necesitamos Button aquí

// Componente Header simplificado para Auth
const AuthHeader = () => (
    <header className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg">N</div>
          <h1 className="text-xl font-bold text-text-main">Nublink</h1>
      </div>
      {/* Podríamos añadir un botón de ayuda o contacto si es necesario */}
    </header>
);

// Componente Footer simplificado para Auth
const AuthFooter = () => (
    <footer className="container mx-auto px-4 sm:px-6 py-8 text-center text-text-muted border-t border-line-light mt-auto">
        <div className="flex justify-center gap-6 text-sm mb-4">
            <a href="#" className="hover:text-primary">About Us</a>
            <a href="#" className="hover:text-primary">Terms of Service</a>
            <a href="#" className="hover:text-primary">Privacy Policy</a>
        </div>
        <p className="mt-2 text-xs text-text-muted">&copy; 2025 Nublink. All Rights Reserved.</p>
    </footer>
);


const AuthLayout = ({ children, title, subtitle }: { children: React.ReactNode, title: string, subtitle?: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-bg-base flex flex-col font-sans">
      <AuthHeader />
      <main className="flex-grow flex items-center justify-center p-4">
        {/* Usamos el max-w del mockup de registro */}
        <div className="w-full max-w-2xl bg-surface p-6 md:p-10 rounded-xl shadow-lg border border-line-light">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-text-main">{title}</h1>
                {subtitle && <p className="text-text-muted mt-2 text-base">{subtitle}</p>}
            </div>
          {children}
        </div>
      </main>
      <AuthFooter />
    </div>
  );
};

export default AuthLayout;