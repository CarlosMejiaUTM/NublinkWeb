// File: src/pages/Landing.tsx
// Versión: PREMIUM 2025 - Nublink Landing Page (Sin opción gratuita)

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Button from '../components/common/Button';
import nublinkLogoUrl from '../assets/nublink-logo.png';
import heroBg from '../assets/hero-boutique.jpg';

import {
  MapPinIcon,
  DevicePhoneMobileIcon,
  SparklesIcon,
  CheckIcon,
  ArrowDownIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  UsersIcon,
  StarIcon,
  ChevronRightIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-100'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 py-5 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <img src={nublinkLogoUrl} alt="Nublink" className="h-9 w-auto transition-transform group-hover:scale-110" />
            <div className="absolute -inset-1 bg-indigo-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className={`text-2xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent`}>
            Nublink
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-10">
          {['Características', 'Cómo Funciona', 'Planes', 'Testimonios'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(' ', '-')}`}
              className={`font-medium transition-all hover:text-indigo-500 ${
                isScrolled ? 'text-gray-700' : 'text-white'
              }`}
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link to="/login" className="hidden md:block">
            <Button variant="ghost" className={isScrolled ? 'text-gray-700' : 'text-white'}>
              Iniciar Sesión
            </Button>
          </Link>
          <Link to="/registro-tienda">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl hover:shadow-indigo-500/30">
              Registrar Tienda
            </Button>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden"
          >
            {mobileMenuOpen ? (
              <XMarkIcon className={`w-7 h-7 ${isScrolled ? 'text-gray-900' : 'text-white'}`} />
            ) : (
              <div className="space-y-1">
                <span className={`block w-7 h-0.5 ${isScrolled ? 'bg-gray-900' : 'bg-white'}`}></span>
                <span className={`block w-7 h-0.5 ${isScrolled ? 'bg-gray-900' : 'bg-white'}`}></span>
                <span className={`block w-7 h-0.5 ${isScrolled ? 'bg-gray-900' : 'bg-white'}`}></span>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-gray-200 absolute w-full"
          >
            <div className="container mx-auto px-6 py-8 space-y-6">
              {['Características', 'Cómo Funciona', 'Planes', 'Testimonios'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(' ', '-')}`}
                  className="block text-lg font-medium text-gray-800 hover:text-indigo-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <Link to="/login" className="block">
                <Button variant="outline" className="w-full border-indigo-200 text-indigo-700">Iniciar Sesión</Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

const HeroSection = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <motion.div
        style={{ y }}
        className="absolute inset-0"
      >
        <img
          src={heroBg}
          alt="Tienda moderna"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-indigo-950/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-950/80 to-purple-900/60" />
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="relative z-10 text-center text-white px-6 max-w-5xl mx-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tight">
            Tu tienda local,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">en el mapa digital</span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-6 text-xl md:text-2xl text-indigo-100 font-light max-w-3xl mx-auto"
        >
          Aparece cuando más te necesitan. Conecta con clientes cercanos. Vende más sin esfuerzo.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <Link to="/registro-tienda">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white px-12 py-6 text-xl font-bold rounded-full shadow-2xl hover:shadow-indigo-500/50 transform hover:scale-105 transition-all">
              Comienza Ahora
              <ChevronRightIcon className="w-6 h-6 ml-2" />
            </Button>
          </Link>
          <Button variant="outline" size="lg" className="border-2 border-white/30 backdrop-blur-md text-white hover:bg-white/10 px-10 py-6 text-lg rounded-full">
            Ver Demo
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-20 flex flex-wrap items-center justify-center gap-8 md:gap-12 text-sm"
        >
          {['+500 tiendas activas', '4.9/5 calificación', 'Crecimiento promedio +42%'].map((stat) => (
            <div key={stat} className="text-center">
              <div className="text-indigo-300 font-bold text-lg">{stat.split(' ')[0]}</div>
              <div className="text-indigo-100/80">{stat.split(' ').slice(1).join(' ')}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50"
      >
        <ArrowDownIcon className="w-8 h-8" />
      </motion.div>
    </section>
  );
};

const FeaturesSection = () => {
  const features = [
    { icon: <MapPinIcon />, title: "Visibilidad Local", desc: "Aparece en búsquedas cercanas y en el mapa inteligente" },
    { icon: <DevicePhoneMobileIcon />, title: "Gestión desde tu Celular", desc: "Actualiza precios, inventario y promociones en segundos" },
    { icon: <SparklesIcon />, title: "IA que Vende por Ti", desc: "Recomendaciones automáticas y precios dinámicos" },
    { icon: <ChartBarIcon />, title: "Análisis Predictivo", desc: "Sabe qué vender antes de que se acabe" },
    { icon: <UsersIcon />, title: "Clientes Recurrentes", desc: "Notificaciones automáticas a tus compradores fieles" },
    { icon: <ShieldCheckIcon />, title: "Pagos Seguros", desc: "Cobro directo o contra entrega con total confianza" },
  ];

  return (
    <section id="características" className="py-24 bg-white relative overflow-hidden">
      {/* Decoración de fondo */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-indigo-600 font-bold text-sm tracking-widest uppercase mb-2 block">Características</span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Todo lo que tu negocio necesita
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Olvídate de las apps complicadas. Nublink es simple, poderoso y funciona.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group"
            >
              <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 border border-gray-100 hover:border-indigo-100 h-full">
                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors duration-300">
                  <div className="text-indigo-600 group-hover:text-white transition-colors duration-300">
                    {React.cloneElement(f.icon as any, { className: "w-8 h-8" })}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{f.title}</h3>
                <p className="text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  const steps = [
    { title: "Regístrate en 2 minutos", desc: "Solo necesitas tu nombre y teléfono" },
    { title: "Configura tu tienda", desc: "Sube tu logo, dirección y productos" },
    { title: "¡Listo! Empieza a vender", desc: "Apareces automáticamente en búsquedas locales" },
  ];

  return (
    <section id="cómo-funciona" className="py-32 bg-indigo-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      
      <div className="container mx-auto px-6 text-center relative z-10">
        <h2 className="text-4xl md:text-5xl font-black mb-6">Así de fácil es empezar</h2>
        <p className="text-xl text-indigo-200 mb-20">Tres pasos. Sin complicaciones.</p>

        <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
            >
              <div className="relative group">
                <div className="text-9xl font-black text-indigo-800/50 absolute -top-12 -left-4 group-hover:text-indigo-700/50 transition-colors">
                  0{i + 1}
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-10 border border-white/10 hover:bg-white/10 transition-all relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                  <p className="text-indigo-200 text-lg">{step.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const PricingSection = () => {
  return (
    <section id="planes" className="py-32 bg-gray-50">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-5xl font-black text-gray-900 mb-6">Elige tu plan</h2>
        <p className="text-xl text-gray-600 mb-16 max-w-2xl mx-auto">
          Sin comisiones por venta. Cancelas cuando quieras.
        </p>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto items-center">
          
          {/* Plan Básico */}
          <motion.div
            whileHover={{ y: -10 }}
            className="bg-white rounded-3xl p-10 shadow-xl border border-gray-200 text-left"
          >
            <h3 className="text-3xl font-bold text-gray-900">Básico</h3>
            <p className="text-6xl font-black text-gray-900 mt-6">$200<span className="text-2xl text-gray-500 font-medium">/mes</span></p>
            <ul className="mt-10 space-y-5">
              {['Perfil en mapa local', 'Hasta 500 productos', 'Notificaciones básicas', 'Soporte por email'].map((f) => (
                <li key={f} className="flex items-center gap-4">
                  <div className="bg-indigo-100 rounded-full p-1">
                    <CheckIcon className="w-4 h-4 text-indigo-600" />
                  </div>
                  <span className="text-gray-700">{f}</span>
                </li>
              ))}
            </ul>
            <Link to="/registro-tienda" className="block mt-10">
              <Button variant="outline" className="w-full py-6 text-lg font-bold border-indigo-200 text-indigo-700 hover:bg-indigo-50">Elegir Básico</Button>
            </Link>
          </motion.div>

          {/* Plan Premium */}
          <motion.div
            whileHover={{ y: -10 }}
            className="relative bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-12 shadow-2xl text-white overflow-hidden text-left transform scale-105"
          >
            <div className="absolute -top-20 -right-20 bg-white/10 w-64 h-64 rounded-full blur-3xl"></div>
            
            <div className="absolute top-6 right-8 bg-yellow-400 text-indigo-900 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
              Más Popular
            </div>
            
            <div className="flex items-center gap-2 mb-2">
                <SparklesIcon className="w-6 h-6 text-yellow-300" />
                <span className="text-indigo-200 font-semibold uppercase text-sm tracking-wider">Recomendado</span>
            </div>
            
            <h3 className="text-4xl font-bold">IA Premium</h3>
            <p className="text-7xl font-black mt-6">$500<span className="text-2xl opacity-80 font-medium">/mes</span></p>
            
            <ul className="mt-10 space-y-5">
              {['Todo del Básico', 'Productos ilimitados', 'Asistente IA 24/7', 'Precios dinámicos automáticos', 'Análisis predictivo', 'Soporte prioritario'].map((f) => (
                <li key={f} className="flex items-center gap-4">
                  <div className="bg-white/20 rounded-full p-1">
                    <CheckIcon className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium">{f}</span>
                </li>
              ))}
            </ul>
            <Link to="/registro-tienda" className="block mt-12">
              <Button className="w-full py-6 text-lg font-bold bg-white text-indigo-700 hover:bg-gray-100 border-none shadow-xl">
                Empezar con IA Premium
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const testimonials = [
    { name: "María González", store: "Farmacia La Salud", text: "Mis ventas subieron 60% en el primer mes. Los clientes me encuentran sin hacer nada.", rating: 5 },
    { name: "Carlos Ramírez", store: "Ferretería El Tornillo", text: "Lo mejor que le ha pasado a mi negocio en 20 años. Simple y efectivo.", rating: 5 },
    { name: "Ana López", store: "Boutique Luna", text: "La IA me avisa cuando se me acaba algo. ¡Es como tener un empleado extra!", rating: 5 },
  ];

  return (
    <section id="testimonios" className="py-32 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-5xl font-black text-center text-gray-900 mb-16">
          Lo que dicen nuestros comerciantes
        </h2>
        <div className="grid md:grid-cols-3 gap-10">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-gray-50 p-8 rounded-3xl shadow-sm border border-gray-100"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(t.rating)].map((_, i) => (
                  <StarIcon key={i} className="w-5 h-5 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 italic mb-6 text-lg leading-relaxed">"{t.text}"</p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                    {t.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{t.name}</p>
                  <p className="text-sm text-indigo-600 font-medium">{t.store}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTAFinal = () => {
  return (
    <section className="py-32 bg-gradient-to-r from-indigo-900 to-purple-900 text-white text-center relative overflow-hidden">
      {/* Fondo animado sutil */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-30"></div>

      <div className="container mx-auto px-6 relative z-10">
        <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tight">
          ¿Listo para crecer de verdad?
        </h2>
        <p className="text-2xl mb-12 text-indigo-200 max-w-2xl mx-auto">
          Únete a los cientos de negocios que ya están vendiendo más con Nublink.
        </p>
        <Link to="/registro-tienda">
          <Button size="lg" className="bg-white text-indigo-900 hover:bg-gray-100 px-16 py-8 text-2xl font-bold rounded-full shadow-2xl hover:shadow-white/20 transform hover:scale-105 transition-all border-4 border-transparent hover:border-indigo-200">
            Registrar Mi Tienda
          </Button>
        </Link>
      </div>
    </section>
  );
};

const FloatingCTA = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggle = () => setVisible(window.scrollY > 800);
    window.addEventListener('scroll', toggle);
    return () => window.removeEventListener('scroll', toggle);
  }, []);

  if (!visible) return null;

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40"
    >
      <Link to="/registro-tienda">
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 text-lg font-bold rounded-full shadow-2xl shadow-indigo-900/50 flex items-center gap-2">
          <SparklesIcon className="w-5 h-5" />
          ¡Empieza Ahora!
        </Button>
      </Link>
    </motion.div>
  );
};

const LandingPage = () => {
  return (
    <>
      <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden font-sans">
        <Header />
        <HeroSection />
        <FeaturesSection />
        <HowItWorks />
        <Testimonials />
        <PricingSection />
        <CTAFinal />
        <FloatingCTA />
      </div>
    </>
  );
};

export default LandingPage;