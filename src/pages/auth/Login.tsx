// FileName: Login.tsx
// Path: src/pages/auth/Login.tsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import AuthLayout from '../../layouts/AuthLayout';
import { loginUser, getStoreProfile } from '../../services/api';

// Iconos
const EnvelopeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
    <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.161V6a2 2 0 00-2-2H3z"/>
    <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z"/>
  </svg>
);

const LockClosedIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd"/>
  </svg>
);

const LoadingSpinnerIcon = () => (
  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const LoginPage = () => {
  const [email, setEmail] = useState('CARLOS@GMAIL.COM'); 
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      localStorage.removeItem('authToken');

      // 1️⃣ Login
      const loginResp: any = await loginUser(email, password);
      console.log('🔐 Respuesta de login:', loginResp);

      const token = loginResp.access_token || loginResp.token || loginResp.accessToken;
      if (!token) throw new Error('El login no devolvió token válido.');

      localStorage.setItem('authToken', token);
      console.log('✅ Token guardado en localStorage');

      // 2️⃣ Perfil de usuario (ya normalizado en api.ts)
      const userProfile: any = await getStoreProfile();
      console.log('📡 Perfil recibido (getStoreProfile):', userProfile);

      const role = userProfile.role || 'store';
      const store = userProfile.store || null;

      // 3️⃣ Guardar datos en localStorage
      if (userProfile.name) localStorage.setItem('userName', userProfile.name);
      if (userProfile.email) localStorage.setItem('userEmail', userProfile.email);
      localStorage.setItem('userRole', role);
      if (store?.id) localStorage.setItem('storeId', String(store.id));
      if (store?.status) localStorage.setItem('storeStatus', store.status);

      // 4️⃣ Redirección
      if (role === 'superadmin') {
        navigate('/admin/dashboard');
        return;
      }

      if (role === 'store') {
        const status = store?.status || 'pending';
        console.log('➡️ Redirigiendo según status:', status);

        if (status === 'pending') {
          navigate('/tienda/pendiente');
        } else if (status === 'rejected' || status === 'rechazada') {
          navigate('/tienda/rechazada');
        } else {
          navigate('/tienda/dashboard');
        }
        return;
      }

      setError('Login exitoso, pero tu rol no tiene un panel asignado.');
    } catch (err: any) {
      console.error('Login error ->', err);
      setError(err?.message || 'Ocurrió un error inesperado durante el login.');
      localStorage.removeItem('authToken');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Iniciar Sesión en Nublink"
      subtitle={<>¿No tienes cuenta? <Link to="/registro-tienda" className="font-medium text-primary hover:underline">Regístrate aquí</Link></>}
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <Input
          id="email"
          label="Correo Electrónico"
          type="email"
          placeholder="tu.correo@ejemplo.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          icon={<EnvelopeIcon />}
          error={error ? ' ' : undefined}
        />
        <Input
          id="password"
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          icon={<LockClosedIcon />}
          error={error ? ' ' : undefined}
        />

        {error && (
          <div className="flex items-start gap-2 text-sm text-red-700 bg-red-100 p-3 rounded-lg border border-red-200">
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.94 6.94a.75.75 0 11-1.06-1.061l-1.5 1.5a.75.75 0 001.06 1.06l1.5-1.5z" clipRule="evenodd"/>
            </svg>
            <span>{error}</span>
          </div>
        )}

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <input id="remember" type="checkbox" className="h-4 w-4 text-primary focus:ring-primary border-line-light rounded"/>
            <label htmlFor="remember" className="text-text-main">Recordarme</label>
          </div>
          <Link to="/forgot-password" className="font-medium text-primary hover:underline">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <Button type="submit" className="w-full !mt-8" size="lg" disabled={isLoading}>
          {isLoading && <LoadingSpinnerIcon />}
          <span>{isLoading ? 'Ingresando...' : 'Iniciar Sesión'}</span>
        </Button>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
