// FileName: AuthLayout.tsx
// Path: src/layouts/AuthLayout.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import nublinkLogoUrl from '../assets/nublink-logo.png'; // Ruta al logo

// --- ¡MEJORA! Header con 'sticky' y 'backdrop-blur' ---
const AuthHeader = () => (
  <header className="sticky top-0 z-20 w-full bg-surface/90 backdrop-blur-md border-b border-line-light">
    <div className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
      <Link to="/" className="flex items-center gap-2">
        <img src={nublinkLogoUrl} alt="Nublink Logo" className="h-8 w-auto" />
        <h1 className="text-xl font-bold text-text-main">Nublink</h1>
      </Link>
      <nav className="flex items-center gap-2">
        <Link to="/login">
            <Button variant="ghost" size="sm">Iniciar Sesión</Button>
        </Link>
        <Link to="/registro-tienda">
            <Button size="sm">Registrar Tienda</Button>
        </Link>
      </nav>
    </div>
  </header>
);

// --- ¡MEJORA! Footer traducido y limpio ---
const AuthFooter = () => (
  <footer className="w-full bg-bg-base mt-auto"> {/* Fondo que coincide con la página */}
    <div className="container mx-auto px-4 sm:px-6 py-8 text-center text-text-muted border-t border-line-light">
      <div className="flex justify-center gap-6 text-sm mb-4">
        <a href="#" className="hover:text-primary">Sobre Nosotros</a>
        <a href="#" className="hover:text-primary">Términos de Servicio</a>
        <a href="#" className="hover:text-primary">Política de Privacidad</a>
      </div>
      <p className="mt-2 text-xs text-text-muted">&copy; 2025 Nublink. Todos los derechos reservados.</p>
    </div>
  </footer>
);

// --- ¡MEJORA! Layout de dos columnas inspirado en tu mockup ---
const AuthLayout = ({ children, title, subtitle }: { children: React.ReactNode, title: string, subtitle?: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-bg-base flex flex-col font-sans">
      <AuthHeader />
      
      {/* Contenedor principal que centra la tarjeta */}
      <main className="flex-grow flex items-center justify-center p-4 my-10 md:my-16">
        
        {/* Tarjeta principal con dos columnas */}
        <div className="w-full max-w-5xl bg-surface rounded-xl shadow-xl border border-line-light overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            
            {/* Columna 1: El Formulario (Contenido) */}
            <div className="p-6 md:p-10">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-text-main">{title}</h1>
                {subtitle && <p className="text-text-muted mt-2 text-base">{subtitle}</p>}
              </div>
              {children} {/* Aquí se renderiza Login.tsx o StoreRegistration.tsx */}
            </div>

            {/* Columna 2: Branding (Como en tu mockup de registro) */}
            <div className="hidden md:flex flex-col items-center justify-center text-center bg-gradient-to-br from-primary to-primary-dark p-10">
                <img src={nublinkLogoUrl} alt="Nublink Logo" className="h-20 w-auto bg-white rounded-full p-3 shadow-lg" />
                <h2 className="text-4xl font-extrabold text-white mt-6">
                  Haz crecer tu negocio con Nublink
                </h2>
                <p className="text-primary-light/80 mt-4">
                  Llega a miles de compradores locales y lleva tu tienda al siguiente nivel.
                </p>
            </div>

          </div>
        </div>
      </main>
      
      <AuthFooter />
    </div>
  );
};

// Necesitamos importar Button aquí si AuthHeader lo usa
// (Asumiendo que Button.tsx está en la ruta correcta)
import Button from '../components/common/Button'; 

export default AuthLayout;