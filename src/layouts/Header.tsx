// FileName: Header.tsx
// Path: src/layouts/Header.tsx

import React from 'react'; // Necesario para JSX
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import nublinkLogoUrl from '../assets/nublink-logo.png'; // <-- ¡Importa tu logo real!

const Header = () => {
  return (
    // --- ¡MEJORA! Header "pegajoso" con efecto 'frosted glass' ---
    <header className="sticky top-0 z-20 w-full bg-surface/90 backdrop-blur-md border-b border-line-light shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        
        {/* Logo (ahora es un link a la home) */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          {/* --- ¡MEJORA! Logo real --- */}
          <img src={nublinkLogoUrl} alt="Nublink Logo" className="h-8 w-auto" />
          <h1 className="text-xl font-bold text-text-main hidden sm:block">Nublink</h1>
        </Link>
        
        {/* Navegación (Traducida) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-text-muted">
          <a href="#features" className="hover:text-primary transition-colors">Características</a>
          <a href="#how-it-works" className="hover:text-primary transition-colors">¿Cómo Funciona?</a>
          <a href="#pricing" className="hover:text-primary transition-colors">Planes</a>
          <a href="#" className="hover:text-primary transition-colors">Contacto</a>
        </nav>
        
        {/* Botones (Traducidos y con tamaño ajustado) */}
        <div className="flex items-center gap-2">
          <Link to="/login">
            <Button variant="ghost" size="sm">Iniciar Sesión</Button>
          </Link>
          <Link to="/registro-tienda">
            <Button size="sm">Registrarse</Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;