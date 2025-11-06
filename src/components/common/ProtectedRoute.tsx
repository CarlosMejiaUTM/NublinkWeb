// FileName: ProtectedRoute.tsx
// Path: src/components/common/ProtectedRoute.tsx

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import type { User } from '../../types'; // Importa el tipo User

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: (User['role'])[]; // Usa el tipo de rol de la API
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const location = useLocation();
  const token = localStorage.getItem('authToken');
  const role = localStorage.getItem('userRole') as User['role']; // Usa el tipo de rol

  // 1. ¿No hay token? Al login.
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. ¿Hay token pero el rol no está permitido?
  if (!role || !allowedRoles.includes(role)) {
    // Redirige al dashboard que SÍ le corresponde
    const homePath = role === 'superadmin' ? '/admin/dashboard' : '/tienda/dashboard';
    return <Navigate to={homePath} replace />;
  }

  // 3. Hay token y el rol es correcto: Muestra la página solicitada
  return <>{children}</>;
};

export default ProtectedRoute;