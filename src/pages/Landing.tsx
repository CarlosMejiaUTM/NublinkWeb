// FileName: Landing.tsx
// Path: src/pages/Landing.tsx

import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

// Componentes Header y Footer genéricos
const Header = () => (
    <header className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg">N</div>
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

const Footer = () => (
    <footer className="container mx-auto px-4 sm:px-6 py-8 text-center text-text-muted border-t border-line-light mt-auto">
        <div className="flex justify-center gap-6 text-sm mb-4">
            <a href="#" className="hover:text-primary">About Us</a>
            <a href="#" className="hover:text-primary">Terms of Service</a>
            <a href="#" className="hover:text-primary">Privacy Policy</a>
        </div>
        <p className="mt-2 text-xs text-text-muted">&copy; 2025 Nublink. All Rights Reserved.</p>
    </footer>
);

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-bg-base text-text-main font-sans flex flex-col">
      <Header />

      {/* Hero Section */}
      <main className="flex-grow container mx-auto mt-8 md:mt-16 px-4 sm:px-6 text-center">
        <div 
          className="relative w-full h-80 md:h-96 bg-cover bg-center rounded-2xl flex items-center justify-center p-6 shadow-xl overflow-hidden"
          // Usando una imagen placeholder más realista como la del mockup
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')" }} 
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/30 rounded-2xl"></div> {/* Gradiente sutil */}
          <div className="relative z-10 text-white max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-extrabold !leading-tight">
              Register your store and reach thousands of local shoppers.
            </h2>
            <p className="max-w-xl mx-auto mt-4 text-lg text-gray-200">
              Join our platform and grow your business with Nublink. Simple setup, powerful tools, and a community of local buyers ready to find you.
            </p>
            <div className="mt-8">
              <Link to="/registro-tienda">
                <Button size="lg" className="bg-primary text-white hover:bg-primary-dark">Start Registration</Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default LandingPage;