// FileName: AdminDashboardLayout.tsx
// Path: src/layouts/AdminDashboardLayout.tsx

import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import nublinkLogoUrl from '../assets/nublink-logo.png';
import type { User } from '../types';
import ConfirmModal from '../components/common/ConfirmModal';

// ICONOS
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 10.414V18a1 1 0 01-1 1h-2a1 1 0 01-1-1v-4a1 1 0 00-1-1H9a1 1 0 00-1 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1V10.414a1 1 0 01.293-.707l7-7z" clipRule="evenodd" /></svg>;
const StoreIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M3.5 2A1.5 1.5 0 002 3.5v12A1.5 1.5 0 003.5 17h13a1.5 1.5 0 001.5-1.5v-12A1.5 1.5 0 0016.5 2h-13zM6.5 6a.5.5 0 000 1h3a.5.5 0 000-1h-3zM5 6.5a.5.5 0 01.5-.5h.008a.5.5 0 01.5.5v.008a.5.5 0 01-.5.5H5.5a.5.5 0 01-.5-.5V6.5zm1 2.5a.5.5 0 000 1h3a.5.5 0 000-1h-3zM5 9a.5.5 0 01.5-.5h.008a.5.5 0 01.5.5v.008a.5.5 0 01-.5.5H5.5a.5.5 0 01-.5-.5V9zm1 2.5a.5.5 0 000 1h3a.5.5 0 000-1h-3zM5 11.5a.5.5 0 01.5-.5h.008a.5.5 0 01.5.5v.008a.5.5 0 01-.5.5H5.5a.5.5 0 01-.5-.5v-.008zM10.5 6.5a.5.5 0 01.5-.5h3a.5.5 0 010 1h-3a.5.5 0 01-.5-.5zm.5 2a.5.5 0 00-.5.5v.008a.5.5 0 00.5.5h.008a.5.5 0 00.5-.5V9.5a.5.5 0 00-.5-.5h-.008zm.5 2a.5.5 0 01.5-.5h3a.5.5 0 010 1h-3a.5.5 0 01-.5-.5zm.5 2a.5.5 0 00-.5.5v.008a.5.5 0 00.5.5h.008a.5.5 0 00.5-.5v-.008a.5.5 0 00-.5-.5h-.008z" /></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.78 6.125-2.095a1.23 1.23 0 00.41-1.412A9.99 9.99 0 0010 12.75c-2.31 0-4.438.78-6.125 2.095z" /></svg>;
const ProductIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M3.25 4A2.25 2.25 0 001 6.25v7.5A2.25 2.25 0 003.25 16h13.5A2.25 2.25 0 0019 13.75v-7.5A2.25 2.25 0 0016.75 4H3.25zM2 9.75a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z" /></svg>;
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M11.07 2.22a.75.75 0 00-2.14 0l-1.15.52a.75.75 0 01-.64.02l-1.28-.3a.75.75 0 00-.7-.03l-1.15.5a.75.75 0 00-.4.66v1.19c0 .28-.02.56-.07.83l-.3.98a.75.75 0 00.01.66l.3 1.1a.75.75 0 01-.02.64l-.52 1.15a.75.75 0 00.03.7l.5 1.15c.1.22.08.49-.03.7l-.3 1.28a.75.75 0 00.02.64l1.1 1.1a.75.75 0 01.66.4l1.19.08c.28.05.56.02.83-.07l.98-.3a.75.75 0 00.66.01l1.1.3c.22.09.49.07.7-.03l1.15-.5a.75.75 0 00.4-.66v-1.19a.75.75 0 01.07-.83l.3-.98a.75.75 0 00-.01-.66l-.3-1.1a.75.75 0 01.02-.64l.52-1.15a.75.75 0 00-.03-.7l-.5-1.15a.75.75 0 00-.7-.03l-1.28.3a.75.75 0 01-.64-.02l-1.15-.52zM10 8.25a1.75 1.75 0 100 3.5 1.75 1.75 0 000-3.5z" clipRule="evenodd" /></svg>;
const LogoutIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
  </svg>
);

// AVATAR
const UserAvatar = ({ name }: { name: string }) => {
  const initial = name ? name.charAt(0).toUpperCase() : 'A';
  return (
    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold flex-shrink-0 border-2 border-primary-light/50 shadow-sm">
      {initial}
    </div>
  );
};

const AdminDashboardLayout = ({
  children,
  pageTitle,
  pageDescription,
}: {
  children: React.ReactNode;
  pageTitle: string;
  pageDescription?: string;
}) => {
  const navigate = useNavigate();

  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userInitial, setUserInitial] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const [modalState, setModalState] = useState<'confirm' | 'success' | 'error' | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ease-in-out ${
      isActive
        ? 'bg-secondary text-primary'
        : 'text-text-muted hover:bg-secondary hover:text-text-main hover:translate-x-1'
    }`;

  useEffect(() => {
    const name = localStorage.getItem('userName') || 'Admin';
    const role =
      (localStorage.getItem('userRole') as User['role']) || 'superadmin';
    const email = localStorage.getItem('userEmail') || 'admin@nublink.com';

    setUserName(name);
    setUserInitial(name.charAt(0).toUpperCase());
    setUserEmail(email);
    setUserRole(role === 'superadmin' ? 'Modo Super Admin' : 'Modo Administrador');
  }, []);

  // LOGOUT
  const handleLogout = async () => {
    try {
      console.log('🔹 Cerrando sesión...');
      localStorage.clear();

      await new Promise((res) => setTimeout(res, 1000));

      setModalState('success');
      setTimeout(() => {
        setIsModalOpen(false);
        navigate('/login');
      }, 1200);
    } catch (error) {
      console.error('❌ Error al cerrar sesión:', error);
      setModalState('error');
      setTimeout(() => setIsModalOpen(false), 1500);
    }
  };

  return (
    <>
      <div className="flex h-screen bg-bg-base font-sans">
        {/* Sidebar */}
        <aside className="w-64 bg-surface flex-shrink-0 border-r border-line-light p-4 flex flex-col justify-between">
          <div>
            <Link to="/admin/dashboard" className="flex items-center gap-2 mb-8 px-2">
              <img src={nublinkLogoUrl} alt="Nublink Logo" className="h-8 w-auto" />
              <div className="text-xl font-bold text-text-main">Nublink</div>
            </Link>

            <div className="p-3 bg-secondary rounded-xl flex items-center gap-3 mb-6">
              <UserAvatar name={userName} />
              <div>
                <p className="font-semibold text-sm text-text-main truncate">
                  ¡Hola, {userName}!
                </p>
                <p className="text-xs text-text-muted">{userRole}</p>
              </div>
            </div>

            {/* NAV ACTUALIZADO SIN IA Y SIN SOPORTE */}
            <nav>
              <ul className="space-y-1.5">
                <li><NavLink to="/admin/dashboard" className={navLinkClasses} end><HomeIcon /> <span>Dashboard</span></NavLink></li>
                <li><NavLink to="/admin/tiendas" className={navLinkClasses}><StoreIcon /> <span>Gestionar Tiendas</span></NavLink></li>
                <li><NavLink to="/admin/usuarios" className={navLinkClasses}><UserIcon /> <span>Gestionar Usuarios</span></NavLink></li>
                <li><NavLink to="/admin/productos-globales" className={navLinkClasses}><ProductIcon /> <span>Productos Globales</span></NavLink></li>
                <li><NavLink to="/admin/pagos" className={navLinkClasses}><SettingsIcon /> <span>Pagos y Comisiones</span></NavLink></li>
              </ul>
            </nav>
          </div>

          <div className="mt-auto border-t border-line-light pt-4">
            <li><NavLink to="/admin/configuracion" className={navLinkClasses}><SettingsIcon /> <span>Configuración</span></NavLink></li>
          </div>
        </aside>

        {/* MAIN */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-surface/95 backdrop-blur-sm border-b border-line-light px-6 py-4 flex justify-between items-center sticky top-0 z-10">
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-text-main">{pageTitle}</h1>
              {pageDescription && (
                <p className="text-sm text-text-muted mt-1">{pageDescription}</p>
              )}
            </div>

            <div className="flex items-center gap-4 relative">
              <button
                onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-text-main font-semibold cursor-pointer border border-line-light"
              >
                {userInitial || '?'}
              </button>

              <div
                className={`absolute top-14 right-0 w-64 bg-surface rounded-xl shadow-xl border border-line-light z-20 py-2 transition-all duration-150 ease-in-out ${
                  isProfileMenuOpen
                    ? 'opacity-100 scale-100'
                    : 'opacity-0 scale-95 pointer-events-none'
                }`}
              >
                <div className="px-4 py-3 border-b border-line-light">
                  <p className="font-semibold text-sm text-text-main truncate">{userName}</p>
                  <p className="text-xs text-text-muted truncate">{userEmail}</p>
                </div>
                <div className="p-1">
                  <NavLink
                    to="/admin/configuracion"
                    className="block w-full text-left px-3 py-2 text-sm text-text-muted hover:bg-secondary hover:text-text-main rounded-md"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    Configuración
                  </NavLink>

                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      setModalState('confirm');
                      setIsModalOpen(true);
                    }}
                    className="group flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
                  >
                    <LogoutIcon className="w-5 h-5 text-red-500" />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 md:p-8">
            {children}
          </main>
        </div>
      </div>

      {modalState && (
        <ConfirmModal
          isOpen={isModalOpen}
          title={
            modalState === 'success'
              ? '¡Sesión cerrada!'
              : modalState === 'error'
              ? 'Error al cerrar sesión'
              : '¿Cerrar sesión?'
          }
          message={
            modalState === 'success'
              ? 'Has cerrado sesión correctamente.'
              : modalState === 'error'
              ? 'Ocurrió un error al intentar cerrar sesión.'
              : 'Tu sesión se cerrará y volverás al inicio de sesión.'
          }
          confirmText="Sí, cerrar"
          cancelText="Cancelar"
          onConfirm={handleLogout}
          onCancel={() => setIsModalOpen(false)}
          state={modalState === 'success' ? 'success' : 'confirm'}
          type={modalState}
        />
      )}
    </>
  );
};

export default AdminDashboardLayout;
