// FileName: DashboardLayout.tsx
// Path: src/layouts/DashboardLayout.tsx

import React from 'react';
import { NavLink } from 'react-router-dom';

// Iconos Placeholder (Considera usar una librería como react-icons)
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const ProductIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>;
const OrderIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const HelpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9.247a4.75 4.75 0 015.432 0M10.908 17.5a2.25 2.25 0 010-4.5h.008v.008h-.008zM12 21a9 9 0 110-18 9 9 0 010 18z" /></svg>;
const AILightbulbIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
const ReportIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6M5.05 17.05a8 8 0 1113.9 0M12 21a9 9 0 110-18 9 9 0 010 18z" /></svg>;
const PromotionIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.53 0 1.04.21 1.41.59L17 7h3a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h3zm0 4h10M5 15h14" /></svg>;


const NublinkLogo = () => (
    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg">N</div>
);
const UserAvatar = ({ name, imageUrl }: { name: string, imageUrl?: string }) => (
    imageUrl ?
    <img src={imageUrl} alt={name} className="w-8 h-8 rounded-full object-cover" /> :
    <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-primary text-sm font-semibold">
        {name.charAt(0).toUpperCase()}
    </div>
);


const DashboardLayout = ({ children, pageTitle, pageDescription }: { children: React.ReactNode; pageTitle: string; pageDescription?: string }) => {
  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center px-4 py-2.5 rounded-lg transition-colors text-sm font-medium ${
      isActive ? 'bg-secondary text-primary' : 'text-text-muted hover:bg-secondary hover:text-text-main'
    }`;

  return (
    <div className="flex h-screen bg-bg-base font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-surface flex-shrink-0 border-r border-line-light p-4 flex flex-col justify-between">
        <div>
            <div className="flex items-center gap-3 mb-8 px-2">
                <NublinkLogo />
                <div className="text-xl font-bold text-text-main">Nublink</div>
            </div>
            {/* User Profile Block */}
            <div className="p-2 bg-secondary rounded-lg flex items-center gap-3 mb-6">
                <img src="https://placehold.co/40x40/EAEFFB/1A1A1A?text=D" alt="user" className="w-10 h-10 rounded-full" />
                <div>
                    <p className="font-semibold text-sm text-text-main">Welcome back, David!</p>
                    <p className="text-xs text-text-muted">Principal Mode</p>
                </div>
            </div>
            {/* Navigation */}
            <nav>
              <ul className="space-y-1.5">
                <li><NavLink to="/tienda/dashboard" className={navLinkClasses} end><HomeIcon /> <span className="ml-3">Home</span></NavLink></li>
                <li><NavLink to="/tienda/productos" className={navLinkClasses}><ProductIcon /> <span className="ml-3">Products</span></NavLink></li>
                <li><NavLink to="/tienda/pedidos" className={navLinkClasses}><OrderIcon /> <span className="ml-3">Orders</span></NavLink></li>
                <li><NavLink to="/tienda/recomendaciones" className={navLinkClasses}><AILightbulbIcon /> <span className="ml-3">Recommendations</span></NavLink></li>
                <li><NavLink to="/tienda/reportes" className={navLinkClasses}><ReportIcon /> <span className="ml-3">Reports</span></NavLink></li>
                <li><NavLink to="/tienda/promociones" className={navLinkClasses}><PromotionIcon /> <span className="ml-3">Promotions</span></NavLink></li>
                <li><NavLink to="/tienda/configuracion" className={navLinkClasses}><SettingsIcon /> <span className="ml-3">Configurations</span></NavLink></li>
              </ul>
            </nav>
        </div>
        {/* Help Link at the bottom */}
        <div className="mt-auto border-t border-line-light pt-4">
            <NavLink to="/tienda/ayuda" className={navLinkClasses}>
                <HelpIcon /> <span className="ml-3">Help</span>
            </NavLink>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-surface/95 backdrop-blur-sm border-b border-line-light px-6 py-3 flex justify-between items-center sticky top-0 z-10">
             <div className="flex flex-col">
                 <h1 className="text-xl font-bold text-text-main">{pageTitle}</h1>
                 {pageDescription && <p className="text-sm text-text-muted mt-0.5">{pageDescription}</p>}
             </div>
             {/* Header Right Side */}
             <div className="flex items-center gap-4">
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-text-muted">
                    <a href="#" className="hover:text-primary">Features</a>
                    <a href="#" className="hover:text-primary">Pricing</a>
                    <a href="#" className="hover:text-primary">Contact</a>
                </nav>
                 {/* User Avatar */}
                <img src="https://placehold.co/40x40/F4F6F8/1A1A1A?text=D" alt="user" className="w-10 h-10 rounded-full cursor-pointer border border-line-light" />
             </div>
        </header>
        {/* Page Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;