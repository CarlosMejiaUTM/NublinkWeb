// FileName: Footer.tsx
// Path: src/layouts/Footer.tsx

import React from 'react'; // React es necesario si se usa JSX

const Footer = () => {
  return (
    // --- ¡MEJORA! Fondo 'bg-bg-base' para mezclarse con la página ---
    <footer className="w-full bg-bg-base border-t border-line-light mt-auto">
      <div className="container mx-auto px-4 sm:px-6 py-6">
        
        {/* --- ¡MEJORA! Layout profesional (izquierda/derecha) en desktop --- */}
        {/* Apilado y centrado en móvil (flex-col), y en horizontal (md:flex-row) en desktop */}
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4">
          
          {/* Izquierda: Copyright */}
          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} Nublink. Todos los derechos reservados.
          </p>

          {/* Derecha: Enlaces (Traducidos) */}
          <div className="flex justify-center gap-6 text-sm text-text-muted">
            <a href="#" className="hover:text-primary transition-colors">Sobre Nosotros</a>
            <a href="#" className="hover:text-primary transition-colors">Términos de Servicio</a>
            <a href="#" className="hover:text-primary transition-colors">Privacidad</a>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;