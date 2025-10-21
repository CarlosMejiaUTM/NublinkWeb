// FileName: main.tsx
// Path: src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// LA SIGUIENTE LÍNEA SE BORRA O COMENTA PORQUE YA USAMOS EL CDN EN index.html
// import './index.css'; 

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);