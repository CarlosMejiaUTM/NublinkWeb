// FileName: Login.tsx
// Path: src/pages/auth/Login.tsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input'; // Importa el Input mejorado
import AuthLayout from '../../layouts/AuthLayout';
import { loginUser, getMe } from '../../services/api'; 

// --- ¡NUEVO! Iconos Profesionales ---
const EnvelopeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
    <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.161V6a2 2 0 00-2-2H3z" />
    <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
  </svg>
);

const LockClosedIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
  </svg>
);

const ExclamationCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.94 6.94a.75.75 0 11-1.06-1.061l-1.5 1.5a.75.75 0 001.06 1.06l1.5-1.5zm.024 4.502a.75.75 0 011.06-1.061l3.5-3.5a.75.75 0 111.06 1.06L9 11.06a.75.75 0 01-1.061 0zM10 12.25a.75.75 0 00-1.06 1.061l1.5 1.5a.75.75 0 001.06-1.06l-1.5-1.5z" clipRule="evenodd" />
  </svg>
);

const LoadingSpinnerIcon = () => (
  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);
// --- Fin de Iconos ---

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // PASO 1: Login
      const loginData = await loginUser(email, password);
      localStorage.setItem('authToken', loginData.access_token);

      // PASO 2: Obtener datos del usuario (rol)
      const userData = await getMe();
      
      // --- ¡MEJORA! Guardamos nombre y email para el layout ---
      localStorage.setItem('userRole', userData.role); 
      localStorage.setItem('userName', userData.name);
      localStorage.setItem('userEmail', userData.email); // <-- ¡NUEVO!
      // ---------------------

      if (userData.store_id) {
          localStorage.setItem('storeId', userData.store_id.toString());
      }

      // PASO 3: Redirección (Actualizado a 'superadmin')
      if (userData.role === 'superadmin') {
        navigate('/admin/dashboard');
      } else if (userData.role === 'store') {
        navigate('/tienda/dashboard');
      } else {
        setError('Login exitoso, pero tu rol ("client") no tiene un panel asignado.');
        localStorage.clear();
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error inesperado.');
      console.error('Login fallido:', err);
      localStorage.removeItem('authToken');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
        title="Iniciar Sesión en Nublink"
        subtitle={
            <>
                ¿No tienes cuenta?{' '}
                <Link to="/registro-tienda" className="font-medium text-primary hover:underline">
                    Regístrate aquí
                </Link>
            </>
        }
    >
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* --- ¡MEJORA! Input con Icono --- */}
          <Input
            id="email"
            label="Correo Electrónico"
            type="email"
            placeholder="tu.correo@ejemplo.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            icon={<EnvelopeIcon />} // <-- Icono añadido
            error={error ? ' ' : undefined} // <-- Marca el campo en rojo si hay error (sin texto)
          />
          {/* --- ¡MEJORA! Input con Icono --- */}
          <Input
            id="password"
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            icon={<LockClosedIcon />} // <-- Icono añadido
            error={error ? ' ' : undefined} // <-- Marca el campo en rojo si hay error (sin texto)
          />

          {/* --- ¡MEJORA! Alerta de Error --- */}
          {error && (
            <div className="flex items-start gap-2 text-sm text-red-700 bg-red-100 p-3 rounded-lg border border-red-200">
              <ExclamationCircleIcon className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {/* --- Fin Alerta --- */}

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <input id="remember" type="checkbox" className="h-4 w-4 text-primary focus:ring-primary border-line-light rounded"/>
              <label htmlFor="remember" className="text-text-main">Recordarme</label>
            </div>
            <Link to="/forgot-password" className="font-medium text-primary hover:underline">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          
          {/* --- ¡MEJORA! Botón con Spinner --- */}
          <Button type="submit" className="w-full !mt-8" size="lg" disabled={isLoading}>
            {isLoading && <LoadingSpinnerIcon />}
            <span>{isLoading ? 'Ingresando...' : 'Iniciar Sesión'}</span>
          </Button>
        </form>
    </AuthLayout>
  );
};

export default LoginPage;