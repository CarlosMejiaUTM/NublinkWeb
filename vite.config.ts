// FileName: vite.config.ts
// Path: vite.config.ts

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),

    // Configuración de PWA
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      manifest: {
        name: 'Nublink | Registra tu tienda',
        short_name: 'Nublink',
        description: 'Registra tu tienda y llega a miles de compradores locales.',
        theme_color: '#4B43B3',
        background_color: '#FFFFFF',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],


  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
