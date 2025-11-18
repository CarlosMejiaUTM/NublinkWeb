// FileName: DashboardLayout.tsx
// Path: src/layouts/DashboardLayout.tsx

import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import nublinkLogoUrl from '../assets/nublink-logo.png';
import Button from '../components/common/Button';
import ConfirmModal from '../components/common/ConfirmModal';
import AddProductForm from '../pages/store-panel/products/AddProductForm';
import { fetchWithAuth } from '../services/api/helpers';
import type { User } from '../types';

// --- Iconos Heroicons 20 solid ---
import {
  SparklesIcon as AILightbulbIcon,
  BuildingStorefrontIcon,
  ChartBarIcon,
  QuestionMarkCircleIcon as HelpIcon,
  HomeIcon,
  LightBulbIcon,
  ArrowLeftOnRectangleIcon as LogoutIcon,
  PlusIcon,
  CubeIcon as ProductIcon,
  TagIcon as PromotionIcon,
  Cog6ToothIcon as SettingsIcon
} from '@heroicons/react/20/solid';

// --- Avatar del Usuario ---
const UserAvatar = ({ name }: { name: string }) => {
  const initial = name ? name.charAt(0).toUpperCase() : 'U';
  return (
    <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center text-primary font-bold text-lg border-2 border-primary-light/50 shadow-sm transition-transform duration-200 hover:scale-110">
      {initial}
    </div>
  );
};

const DashboardLayout = ({
  children,
  pageTitle,
  pageDescription,
  onProductsRefresh
}: {
  children: React.ReactNode;
  pageTitle: string;
  pageDescription?: string;
  onProductsRefresh?: () => void;
}) => {

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ease-in-out group text-sm font-medium ${
      isActive 
        ? 'bg-primary text-white shadow-md shadow-primary/30'
        : 'text-text-muted hover:bg-secondary hover:text-text-main hover:translate-x-1'
    }`;

  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userInitial, setUserInitial] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // ✅ Estado para verificar acceso a recomendaciones IA
  const [hasAIAccess, setHasAIAccess] = useState<boolean | null>(null);

  // ✅ Modal de confirmación de logout
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmModalState, setConfirmModalState] = useState<'confirm' | 'success'>('confirm');

  // ✅ Estado para controlar el modal de añadir producto
  const [showAddProductForm, setShowAddProductForm] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const name = localStorage.getItem('userName') || 'Usuario';
    const role = (localStorage.getItem('userRole') as User['role']) || 'store';
    const email = localStorage.getItem('userEmail') || '';
    
    setUserName(name);
    setUserInitial(name.charAt(0).toUpperCase());
    setUserEmail(email);
    setUserRole(role === 'superadmin' ? 'Modo Administrador' : 'Modo Tienda');

    // ✅ SOLUCIÓN FINAL: Verificar acceso desde la API directamente
    const checkAIAccess = async () => {
      try {
        console.log('🚀 Verificando acceso a IA desde API...');
        
        // Llamar directamente a la API de suscripción
        const result = await fetchWithAuth('/web/stores/mine/subscription', {
          method: 'GET'
        });
        
        console.log('📦 Respuesta de suscripción:', result);
        
        if (!result?.data) {
          console.warn('⚠️ No hay datos de suscripción');
          setHasAIAccess(false);
          return;
        }
        
        const subscription = result.data;
        const plan = subscription.plan || subscription.plan_name || '';
        const status = subscription.status || '';
        
        console.log('📋 Plan:', plan);
        console.log('📋 Status:', status);
        
        // Verificar si es premium
        const planLower = plan.toLowerCase();
        const isPremium = planLower === 'premium' || 
                         planLower.includes('premium') || 
                         planLower.includes('ia');
        
        const isActive = status.toLowerCase() === 'active' || 
                        status.toLowerCase() === 'activo';
        
        const hasAccess = isPremium && isActive;
        
        console.log('✅ isPremium:', isPremium);
        console.log('✅ isActive:', isActive);
        console.log('🎯 ACCESO FINAL:', hasAccess);
        
        setHasAIAccess(hasAccess);
        
        // Actualizar localStorage con la suscripción
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          user.subscription = subscription;
          localStorage.setItem('user', JSON.stringify(user));
          console.log('💾 Usuario actualizado en localStorage con suscripción');
        }
        
      } catch (error) {
        console.error('❌ Error al verificar acceso:', error);
        setHasAIAccess(false);
      }
    };

    checkAIAccess();
  }, []);

  const handleLogout = () => {
    setConfirmModalOpen(true);
    setConfirmModalState('confirm');
  };

  // ✅ Acción confirmada de logout
  const confirmLogout = () => {
    console.log("✅ Cierre de sesión confirmado");
    localStorage.clear();
    setConfirmModalState('success');

    // Redirigir después de un pequeño delay
    setTimeout(() => {
      setConfirmModalOpen(false);
      navigate('/login');
    }, 1500);
  };

  // ✅ Función para abrir el modal de añadir producto
  const handleOpenAddProduct = () => {
    setShowAddProductForm(true);
  };

  // ✅ Función para cerrar el modal de añadir producto
  const handleCloseAddProduct = () => {
    setShowAddProductForm(false);
  };

const handleProductAdded = () => {
  console.log('🎯 handleProductAdded llamado en DashboardLayout');
  setShowAddProductForm(false);
  
  // Disparar evento personalizado para notificar a la página de productos
  console.log('📢 Disparando evento productAdded');
  const event = new CustomEvent('productAdded', { 
    detail: { timestamp: Date.now() } 
  });
  window.dispatchEvent(event);
  
  // Si hay una función de refresh, llamarla (para cuando estamos en la página de productos)
  if (onProductsRefresh) {
    console.log('🔄 Llamando onProductsRefresh');
    onProductsRefresh();
  }
  
  // Solo navegar si NO estamos en la página de productos
  const currentPath = window.location.pathname;
  console.log('📍 Ruta actual:', currentPath);
  if (!currentPath.includes('/tienda/productos')) {
    console.log('➡️ Navegando a productos');
    navigate('/tienda/productos');
  } else {
    console.log('✅ Ya estamos en productos, no navegamos');
  }
};

  return (
    <div className="flex h-screen bg-bg-base font-sans overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-64 bg-surface flex-shrink-0 border-r border-line-light flex flex-col justify-between shadow-lg z-20 fixed h-full overflow-y-auto">
        {/* Logo */}
        <div className="flex flex-col gap-6 p-4">
          <Link to="/tienda/dashboard" className="flex items-center gap-2">
            <img src={nublinkLogoUrl} alt="Nublink Logo" className="h-8 w-auto" />
            <div className="text-xl font-bold text-text-main truncate">Nublink</div>
          </Link>

          {/* Perfil */}
          <div className="bg-secondary rounded-xl p-3 flex items-center gap-3 transition-all duration-200 hover:shadow-lg">
            <UserAvatar name={userName} />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-text-main break-words">{`¡Hola de nuevo, ${userName}!`}</p>
              <p className="text-xs text-text-muted break-words">{userRole}</p>
            </div>
          </div>

          {/* Navegación */}
          <nav className="mt-2">
            <ul className="space-y-1.5">
              <li>
                <NavLink to="/tienda/dashboard" className={navLinkClasses} end>
                  <HomeIcon className="w-5 h-5" /> 
                  <span>Inicio</span>
                </NavLink>
              </li>
              
              <li>
                <NavLink to="/tienda/productos" className={navLinkClasses}>
                  <ProductIcon className="w-5 h-5" /> 
                  <span>Productos</span>
                </NavLink>
              </li>
              
              {/* ✅ RECOMENDACIONES - Solo visible si tiene acceso */}
              {hasAIAccess !== null && (
                hasAIAccess ? (
                  <li>
                    <NavLink to="/tienda/recomendaciones" className={navLinkClasses}>
                      <LightBulbIcon className="w-5 h-5" /> 
                      <span>Recomendaciones AI</span>
                      <AILightbulbIcon className="w-4 h-4 ml-auto text-purple-500" />
                    </NavLink>
                  </li>
                ) : (
                  <li>
                    <div 
                      className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-text-muted/50 cursor-not-allowed opacity-60"
                      title="Mejora tu plan para acceder a Recomendaciones AI"
                    >
                      <span>Recomendaciones AI</span>
                      <span className="ml-auto text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-semibold">
                        Premium
                      </span>
                    </div>
                  </li>
                )
              )}
              
              <li>
                {hasAIAccess !== null && (
                  hasAIAccess ? (
                    <li>
                      <NavLink to="/tienda/reportes" className={navLinkClasses}>
                        <ChartBarIcon className="w-5 h-5" /> 
                        <span>Reportes AI</span>
                        <AILightbulbIcon className="w-4 h-4 ml-auto text-purple-500" />
                      </NavLink>
                    </li>
                  ) : (
                    <li>
                      <div 
                        className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-text-muted/50 cursor-not-allowed opacity-60"
                        title="Mejora tu plan para acceder a Reportes AI"
                      >
                        <span>Reportes AI</span>
                        <span className="ml-auto text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-semibold">
                          Premium
                        </span>
                      </div>
                    </li>
                  )
                )}
              </li>

              <li>
                {hasAIAccess !== null && (
                  hasAIAccess ? (
                    <li>
                      <NavLink to="/tienda/promociones" className={navLinkClasses}>
                        <PromotionIcon className="w-5 h-5" /> 
                        <span>Promociones AI</span>
                        <AILightbulbIcon className="w-4 h-4 ml-auto text-purple-500" />
                      </NavLink>
                    </li>
                  ) : (
                    <li>
                      <div 
                        className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-text-muted/50 cursor-not-allowed opacity-60"
                        title="Mejora tu plan para acceder a Promociones AI"
                      >
                        <span>Promociones AI</span>
                        <span className="ml-auto text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-semibold">
                          Premium
                        </span>
                      </div>
                    </li>
                  )
                )}
              </li>
              
              <li>
                <NavLink to="/tienda/configuracion" className={navLinkClasses}>
                  <SettingsIcon className="w-5 h-5" /> 
                  <span>Configuración</span>
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>

        {/* Footer Sidebar */}
        <div className="mt-auto border-t border-line-light p-4">
          <NavLink to="/tienda/ayuda" className={navLinkClasses}>
            <HelpIcon className="w-5 h-5" /> 
            <span>Ayuda</span>
          </NavLink>
        </div>
      </aside>

      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col ml-64 overflow-hidden">
        <header className="bg-surface/95 backdrop-blur-sm border-b border-line-light px-6 py-4 flex justify-between items-center sticky top-0 z-10">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-text-main">{pageTitle}</h1>
            {pageDescription && <p className="text-sm text-text-muted mt-1">{pageDescription}</p>}
          </div>
             
          <div className="flex items-center gap-4 relative">
            <Button 
              variant="secondary" 
              size="sm" 
              className="hidden sm:flex items-center gap-2"
              onClick={handleOpenAddProduct}
            >
              <PlusIcon className="w-4 h-4" />
              Añadir Producto
            </Button>
    
            <button 
              onClick={() => setIsProfileMenuOpen(prev => !prev)} 
              className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-text-main font-semibold cursor-pointer border border-line-light focus:outline-none focus:ring-2 focus:ring-primary transition-transform duration-200 hover:scale-110"
            >
              {userInitial || '?'}
            </button>
                
            {isProfileMenuOpen && (
              <div 
                className="absolute top-14 right-0 w-64 bg-surface rounded-xl shadow-xl border border-line-light z-20 py-2 transition-all duration-200 ease-in-out scale-100 opacity-100"
                onMouseLeave={() => setIsProfileMenuOpen(false)}
              >
                <div className="px-4 py-3 border-b border-line-light">
                  <p className="font-semibold text-sm text-text-main truncate">{userName}</p>
                  <p className="text-xs text-text-muted truncate">{userEmail}</p>
                </div>
                <div className="p-1 flex flex-col gap-1">
                  <NavLink
                    to="/tienda/configuracion"
                    className="group flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-text-muted hover:bg-secondary hover:text-text-main rounded-md transition-all duration-150"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    <SettingsIcon className="w-5 h-5 text-text-muted group-hover:text-text-main" />
                    <span>Configuración</span>
                  </NavLink>
                  <a
                    href="#"
                    className="group flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-text-muted hover:bg-secondary hover:text-text-main rounded-md transition-all duration-150"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    <BuildingStorefrontIcon className="w-5 h-5 text-text-muted group-hover:text-text-main" />
                    <span>Ver mi Tienda (Público)</span>
                  </a>
                  <button 
                    onClick={handleLogout}
                    className="group flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-all duration-150"
                  >
                    <LogoutIcon className="w-5 h-5 text-red-500" />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>

      {/* ✅ Modal de confirmación de cierre de sesión */}
      <ConfirmModal
        isOpen={confirmModalOpen}
        state={confirmModalState}
        title={confirmModalState === 'confirm' ? '¿Cerrar sesión?' : 'Sesión cerrada'}
        message={
          confirmModalState === 'confirm'
            ? 'Tu sesión actual se cerrará y deberás iniciar nuevamente.'
            : 'Has cerrado sesión correctamente.'
        }
        onConfirm={confirmLogout}
        onCancel={() => setConfirmModalOpen(false)}
      />

      {/* ✅ Modal de añadir producto */}
      {showAddProductForm && (
        <AddProductForm
          onClose={handleCloseAddProduct}
          onSubmit={handleProductAdded}
        />
      )}
    </div>
  );
};

export default DashboardLayout;