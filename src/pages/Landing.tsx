// File: src/pages/Landing.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import nublinkLogoUrl from '../assets/nublink-logo.png';
import heroBg from '../assets/hero-boutique.jpg';

import {
  MapPinIcon,
  DevicePhoneMobileIcon,
  SparklesIcon,
  CheckIcon,
  ArrowDownIcon,
  BuildingStorefrontIcon,
  ArrowUpRightIcon,
  BoltIcon,
} from '@heroicons/react/20/solid';

// -------------------------------------------------------------
// 🔹 HEADER
// -------------------------------------------------------------
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-30 transition-all duration-500 ${
        isScrolled
          ? 'bg-white/80 backdrop-blur-lg shadow-md border-b border-gray-200'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={nublinkLogoUrl} alt="Nublink Logo" className="h-8 w-auto" />
          <span
            className={`text-xl font-bold ${
              isScrolled ? 'text-gray-800' : 'text-white'
            }`}
          >
            Nublink
          </span>
        </Link>

        {/* Nav */}
        <nav
          className={`hidden md:flex items-center gap-8 text-sm font-medium ${
            isScrolled ? 'text-gray-700' : 'text-gray-200'
          }`}
        >
          <a href="#features" className="hover:text-primary transition">
            Características
          </a>
          <a href="#how-it-works" className="hover:text-primary transition">
            Cómo Funciona
          </a>
          <a href="#pricing" className="hover:text-primary transition">
            Planes
          </a>
          <a href="#" className="hover:text-primary transition">
            Contacto
          </a>
        </nav>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button
              variant={isScrolled ? 'secondary' : 'ghost'}
              size="sm"
              className={
                isScrolled
                  ? 'text-gray-700 bg-transparent border border-gray-200 hover:bg-gray-100'
                  : '!text-white !bg-white/10 hover:!bg-white/20 border border-white/20'
              }
            >
              Iniciar Sesión
            </Button>
          </Link>
          <Link to="/registro-tienda">
            <Button
              size="sm"
              className={
                isScrolled
                  ? 'bg-primary text-white hover:bg-primary-dark'
                  : 'bg-dark text-primary hover:bg-gray-100'
              }
            >
              Registrar Tienda
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

// -------------------------------------------------------------
// 🔹 HERO SECTION
// -------------------------------------------------------------
const HeroSection = () => (
  <section className="relative h-screen flex items-center justify-center text-center overflow-hidden">
    {/* Fondo */}
    <div className="absolute inset-0">
      <img
        src={heroBg}
        alt="Interior de tienda moderna"
        className="w-full h-full object-cover brightness-[0.55] saturate-110 contrast-110 scale-105 transition-transform duration-[3000ms]"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-primary/40"></div>
    </div>

    {/* Contenido */}
    <div className="relative z-10 text-white px-6 max-w-3xl animate-fadeInUp">
      <h1 className="text-5xl md:text-6xl font-extrabold leading-tight drop-shadow-[0_5px_10px_rgba(0,0,0,0.6)]">
        Registra tu tienda y llega a miles de compradores locales.
      </h1>
      <p className="mt-6 text-lg md:text-xl text-gray-200 font-light leading-relaxed">
        Impulsa tu negocio con Nublink: crea tu perfil, muestra tus productos y
        conecta con clientes cercanos.
      </p>
      <div className="mt-10 flex justify-center">
        <Link to="/registro-tienda">
          <Button
            size="lg"
            className="bg-gradient-to-r from-primary to-indigo-500 text-white px-10 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-[1.05] transition-all"
          >
            Iniciar Registro Gratis
          </Button>
        </Link>
      </div>
    </div>

    {/* Indicador de scroll */}
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center text-white opacity-80">
      <span className="text-xs mb-1">Explorar</span>
      <ArrowDownIcon className="w-5 h-5 animate-bounce" />
    </div>

    {/* Animación */}
    <style>{`
      @keyframes fadeInUp {
        0% { opacity: 0; transform: translateY(40px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      .animate-fadeInUp {
        animation: fadeInUp 1.2s ease-out forwards;
      }
    `}</style>
  </section>
);

// -------------------------------------------------------------
// 🔹 FEATURES
// -------------------------------------------------------------
const FeatureCard = ({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) => (
  <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 hover:-translate-y-2 hover:shadow-xl transition-all duration-300 text-center">
    <div className="inline-block p-4 bg-primary-light rounded-full mb-5">
      {React.cloneElement(icon as React.ReactElement, {
        className: 'w-8 h-8 text-primary',
      })}
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

// -------------------------------------------------------------
// 🔹 PASOS (CÓMO FUNCIONA)
// -------------------------------------------------------------
const HowItWorksStep = ({ step, title, description, icon }: { step: number; title: string; description: string; icon: React.ReactNode }) => (
  <div className="flex items-start gap-5 bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
    <div className="flex-shrink-0 w-12 h-12 bg-primary-light text-primary font-bold rounded-full flex items-center justify-center">
      {icon}
    </div>
    <div>
      <span className="text-sm font-semibold text-primary uppercase">Paso {step}</span>
      <h3 className="font-semibold text-lg text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </div>
);

// -------------------------------------------------------------
// 🔹 PLANES / PRECIOS
// -------------------------------------------------------------
const PricingCard = ({
  planName,
  price,
  description,
  features,
  isPopular = false,
}: {
  planName: string;
  price: string;
  description: string;
  features: string[];
  isPopular?: boolean;
}) => (
  <div
    className={`relative bg-white rounded-2xl shadow-md p-8 flex flex-col transition-all hover:shadow-xl ${
      isPopular ? 'border-2 border-primary' : 'border border-gray-100'
    }`}
  >
    {isPopular && (
      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs px-3 py-1 rounded-full shadow">
        Más popular
      </span>
    )}

    <h3 className="text-2xl font-bold text-gray-900 text-center">{planName}</h3>
    <p className="text-gray-600 text-center mt-2">{description}</p>
    <p className="text-5xl font-extrabold text-gray-900 text-center my-6">
      {price}
      <span className="text-base text-gray-500">/mes</span>
    </p>
    <ul className="space-y-3 text-gray-600 mb-8">
      {features.map((f, i) => (
        <li key={i} className="flex items-center gap-3">
          <CheckIcon className="w-5 h-5 text-green-500" />
          {f}
        </li>
      ))}
    </ul>
    <Link to="/registro-tienda">
      <Button
        variant={isPopular ? 'primary' : 'secondary'}
        size="lg"
        className="w-full rounded-full"
      >
        {isPopular ? 'Empezar Ahora' : 'Elegir Plan'}
      </Button>
    </Link>
  </div>
);

// -------------------------------------------------------------
// 🔹 CTA FINAL
// -------------------------------------------------------------
const CTASection = () => (
  <section className="py-20 bg-gradient-to-r from-primary to-indigo-600 text-center text-white">
    <h2 className="text-3xl md:text-4xl font-bold mb-4">
      ¿Listo para transformar tu tienda?
    </h2>
    <p className="max-w-xl mx-auto text-lg opacity-90 mb-8">
      Regístrate gratis hoy y conecta con nuevos clientes locales en minutos.
    </p>
    <div className="flex justify-center">
      <Link to="/registro-tienda">
        <Button
          size="lg"
          className="bg-indigo-600 text-white font-semibold hover:bg-indigo-700 px-10 py-4 rounded-full shadow-lg transform hover:scale-[1.05] transition-all"
        >
          Comenzar Ahora
        </Button>
      </Link>
    </div>
  </section>
);

// -------------------------------------------------------------
// 🔹 FOOTER
// -------------------------------------------------------------
const Footer = () => (
  <footer className="bg-gray-50 border-t border-gray-200 py-6 text-center text-sm text-gray-600">
    <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4 px-6">
      <p>© {new Date().getFullYear()} Nublink. Todos los derechos reservados.</p>
      <div className="flex gap-6">
        <a href="#" className="hover:text-primary">Sobre Nosotros</a>
        <a href="#" className="hover:text-primary">Términos</a>
        <a href="#" className="hover:text-primary">Privacidad</a>
      </div>
    </div>
  </footer>
);

// -------------------------------------------------------------
// 🔹 PÁGINA PRINCIPAL
// -------------------------------------------------------------
const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50 text-gray-900">
      <Header />

      <main className="flex-grow">
        <HeroSection />

        <section id="features" className="py-24 container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-4">Potencia tu Tienda</h2>
          <p className="text-center text-gray-600 mb-16 max-w-xl mx-auto">
            Nublink te da las herramientas para gestionar, conectar y vender de forma inteligente.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<MapPinIcon />}
              title="Enfoque Local"
              description="Conecta con clientes cercanos y haz que tu tienda aparezca en el mapa digital."
            />
            <FeatureCard
              icon={<DevicePhoneMobileIcon />}
              title="Gestión Inteligente"
              description="Controla inventario, precios y visibilidad desde una sola plataforma."
            />
            <FeatureCard
              icon={<SparklesIcon />}
              title="Análisis Avanzado"
              description="Obtén datos e insights para tomar mejores decisiones comerciales."
            />
          </div>
        </section>

        <section id="how-it-works" className="py-24 bg-white border-y border-gray-100">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-16">Cómo Funciona</h2>
            <div className="max-w-2xl mx-auto space-y-10">
              <HowItWorksStep
                step={1}
                title="Crea tu Cuenta"
                description="Regístrate en pocos minutos y completa la información de tu tienda."
                icon={<BuildingStorefrontIcon className="w-6 h-6" />}
              />
              <HowItWorksStep
                step={2}
                title="Sube tus Productos"
                description="Carga tu catálogo o conecta tu sistema POS fácilmente."
                icon={<ArrowUpRightIcon className="w-6 h-6" />}
              />
              <HowItWorksStep
                step={3}
                title="Empieza a Vender"
                description="Activa tu plan, aparece en búsquedas locales y recibe nuevos clientes."
                icon={<BoltIcon className="w-6 h-6" />}
              />
            </div>
          </div>
        </section>

        <section id="pricing" className="py-24 container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-4">Planes Simples</h2>
          <p className="text-center text-gray-600 mb-16 max-w-xl mx-auto">
            Elige el plan ideal para tu negocio. Sin contratos, sin comisiones ocultas.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <PricingCard
              planName="Básico"
              price="$200 MXN"
              description="Ideal para empezar a mostrar tu tienda en línea."
              features={[
                'Inventario básico',
                'Aparición en mapa local',
                'Soporte por correo',
              ]}
            />
            <PricingCard
              planName="IA Premium"
              price="$500 MXN"
              description="Desbloquea herramientas avanzadas de analítica e IA."
              features={[
                'Todo del plan básico',
                'Predicción de demanda',
                'Asistente IA de precios',
                'Soporte prioritario',
              ]}
              isPopular
            />
          </div>
        </section>

        <CTASection />
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
