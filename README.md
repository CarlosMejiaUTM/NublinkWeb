  # React + TypeScript + Vite

  This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

  Currently, two official plugins are available:

  - [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
  - [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

  ## React Compiler

  The React Compiler is currently not compatible with SWC. See [this issue](https://github.com/vitejs/vite-plugin-react/issues/428) for tracking the progress.

  ## Expanding the ESLint configuration

  If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

  ```js
  export default defineConfig([
    globalIgnores(['dist']),
    {
      files: ['**/*.{ts,tsx}'],
      extends: [
        // Other configs...

        // Remove tseslint.configs.recommended and replace with this
        tseslint.configs.recommendedTypeChecked,
        // Alternatively, use this for stricter rules
        tseslint.configs.strictTypeChecked,
        // Optionally, add this for stylistic rules
        tseslint.configs.stylisticTypeChecked,

        // Other configs...
      ],
      languageOptions: {
        parserOptions: {
          project: ['./tsconfig.node.json', './tsconfig.app.json'],
          tsconfigRootDir: import.meta.dirname,
        },
        // other options...
      },
    },
  ])
  ```

  You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

  ```js
  // eslint.config.js
  import reactX from 'eslint-plugin-react-x'
  import reactDom from 'eslint-plugin-react-dom'

  export default defineConfig([
    globalIgnores(['dist']),
    {
      files: ['**/*.{ts,tsx}'],
      extends: [
        // Other configs...
        // Enable lint rules for React
        reactX.configs['recommended-typescript'],
        // Enable lint rules for React DOM
        reactDom.configs.recommended,
      ],
      languageOptions: {
        parserOptions: {
          project: ['./tsconfig.node.json', './tsconfig.app.json'],
          tsconfigRootDir: import.meta.dirname,
        },
        // other options...
      },
    },
  ])
  ```

  ```
  prisma
  ├─ .env
  ├─ eslint.config.js
  ├─ estructura
  ├─ index.html
  ├─ package-lock.json
  ├─ package.json
  ├─ public
  │  ├─ icons
  │  │  ├─ icon-192x192.png
  │  │  └─ icon-512x512.png
  │  └─ vite.svg
  ├─ README.md
  ├─ src
  │  ├─ App.css
  │  ├─ App.tsx
  │  ├─ assets
  │  │  ├─ hero-boutique.jpg
  │  │  ├─ nublink-logo.png
  │  │  └─ react.svg
  │  ├─ common
  │  │  └─ Button
  │  ├─ components
  │  │  ├─ common
  │  │  │  ├─ Button.tsx
  │  │  │  ├─ Card.tsx
  │  │  │  ├─ ConfirmModal.tsx
  │  │  │  ├─ Input.tsx
  │  │  │  ├─ LocationPickerMap.tsx
  │  │  │  ├─ PaymentForm.tsx
  │  │  │  ├─ ProtectedRoute.tsx
  │  │  │  └─ Select.tsx
  │  │  └─ ui
  │  ├─ hooks
  │  │  └─ useAuth.ts
  │  ├─ index.css
  │  ├─ layouts
  │  │  ├─ AdminDashboardLayout.tsx
  │  │  ├─ AuthLayout.tsx
  │  │  ├─ DashboardLayout.tsx
  │  │  ├─ Footer.tsx
  │  │  └─ Header.tsx
  │  ├─ main.tsx
  │  ├─ pages
  │  │  ├─ admin-panel
  │  │  │  ├─ AdminAI.tsx
  │  │  │  ├─ AdminDashboard.tsx
  │  │  │  ├─ AdminGlobalProducts.tsx
  │  │  │  ├─ AdminPayments.tsx
  │  │  │  ├─ AdminStoreDetail.tsx
  │  │  │  ├─ AdminStores.tsx
  │  │  │  ├─ AdminSupport.tsx
  │  │  │  └─ AdminUsers.tsx
  │  │  ├─ auth
  │  │  │  ├─ Login.tsx
  │  │  │  └─ StoreRegistration.tsx
  │  │  ├─ Landing.tsx
  │  │  └─ store-panel
  │  │     ├─ PendingStore.tsx
  │  │     ├─ RejectedStore.tsx
  │  │     ├─ StoreDashboard.tsx
  │  │     ├─ StoreOrders.tsx
  │  │     ├─ StoreProducts.tsx
  │  │     ├─ StorePromotions.tsx
  │  │     ├─ StoreRecommendations.tsx
  │  │     ├─ StoreRejectedPage.tsx
  │  │     ├─ StoreReports.tsx
  │  │     └─ StoreSettings.tsx
  │  ├─ services
  │  │  ├─ api
  │  │  │  ├─ admin.ts
  │  │  │  ├─ ai.ts
  │  │  │  ├─ auth.ts
  │  │  │  ├─ categories.ts
  │  │  │  ├─ helpers.ts
  │  │  │  ├─ index.ts
  │  │  │  ├─ payments.ts
  │  │  │  └─ store.ts
  │  │  └─ api.txt
  │  └─ types
  │     └─ index.ts
  ├─ tailwind.config.js
  ├─ tsconfig.app.json
  ├─ tsconfig.json
  ├─ tsconfig.node.json
  └─ vite.config.ts

  ```