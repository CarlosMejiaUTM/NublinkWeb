// FileName: main.tsx
// Path: src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// --- Stripe Imports ---
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

// Carga tu clave publicable desde las variables de entorno
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Envuelve tu App con el proveedor Elements */}
    <Elements stripe={stripePromise}>
      <App />
    </Elements>
  </React.StrictMode>,
);