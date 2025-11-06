// FileName: DashboardLayout.tsx
// Path: src/layouts/DashboardLayout.tsx

import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import nublinkLogoUrl from '../assets/nublink-logo.png';
import type { User } from '../types';
import Button from '../components/common/Button';
import ConfirmModal from '../components/common/ConfirmModal'; // ✅ Importa tu componente modal

// --- Iconos Heroicons 20 solid ---
import { 
  HomeIcon, 
  CubeIcon as ProductIcon,
  Cog6ToothIcon as SettingsIcon,
  QuestionMarkCircleIcon as HelpIcon,
  SparklesIcon as AILightbulbIcon,
  ChartBarIcon as ReportIcon,
  TagIcon as PromotionIcon,
  ArrowLeftOnRectangleIcon as LogoutIcon,
  BuildingStorefrontIcon
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
  pageDescription
}: {
  children: React.ReactNode;
  pageTitle: string;
  pageDescription?: string;
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

  // ✅ Modal de confirmación de logout
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmModalState, setConfirmModalState] = useState<'confirm' | 'success'>('confirm');

  const navigate = useNavigate();

  useEffect(() => {
    const name = localStorage.getItem('userName') || 'Usuario';
    const role = (localStorage.getItem('userRole') as User['role']) || 'store';
    const email = localStorage.getItem('userEmail') || '';
    
    setUserName(name);
    setUserInitial(name.charAt(0).toUpperCase());
    setUserEmail(email);
    setUserRole(role === 'superadmin' ? 'Modo Administrador' : 'Modo Tienda');
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
              <li><NavLink to="/tienda/dashboard" className={navLinkClasses} end><HomeIcon className="w-5 h-5" /> <span>Inicio</span></NavLink></li>
              <li><NavLink to="/tienda/productos" className={navLinkClasses}><ProductIcon className="w-5 h-5" /> <span>Productos</span></NavLink></li>
              <li><NavLink to="/tienda/recomendaciones" className={navLinkClasses}><AILightbulbIcon className="w-5 h-5" /> <span>Recomendaciones</span></NavLink></li>
              <li><NavLink to="/tienda/reportes" className={navLinkClasses}><ReportIcon className="w-5 h-5" /> <span>Reportes</span></NavLink></li>
              <li><NavLink to="/tienda/promociones" className={navLinkClasses}><PromotionIcon className="w-5 h-5" /> <span>Promociones</span></NavLink></li>
              <li><NavLink to="/tienda/configuracion" className={navLinkClasses}><SettingsIcon className="w-5 h-5" /> <span>Configuración</span></NavLink></li>
            </ul>
          </nav>
        </div>

        {/* Footer Sidebar */}
        <div className="mt-auto border-t border-line-light p-4">
          <NavLink to="/tienda/ayuda" className={navLinkClasses}><HelpIcon className="w-5 h-5" /> <span>Ayuda</span></NavLink>
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
            <Button variant="secondary" size="sm" className="hidden sm:flex">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
              </svg>
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
    </div>
  );
};

export default DashboardLayout;
