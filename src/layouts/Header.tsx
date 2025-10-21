// FileName: Header.tsx
// Path: src/components/layout/Header.tsx

import { Link } from 'react-router-dom';
import Button from '../common/Button';

// Icono Nublink Placeholder
const NublinkLogo = () => (
    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg">N</div>
);

const Header = () => {
  return (
    <header className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
          <NublinkLogo />
          <h1 className="text-xl font-bold text-text-main">Nublink</h1>
      </div>
      <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-text-muted">
        <a href="#" className="hover:text-primary transition-colors">Home</a>
        <a href="#" className="hover:text-primary transition-colors">Features</a>
        <a href="#" className="hover:text-primary transition-colors">Pricing</a>
        <a href="#" className="hover:text-primary transition-colors">Contact</a>
      </nav>
      <div className="flex items-center gap-2">
        <Link to="/login">
          <Button variant="ghost">Login</Button>
        </Link>
        <Link to="/registro-tienda">
          <Button>Sign Up</Button>
        </Link>
      </div>
    </header>
  );
};

export default Header;

