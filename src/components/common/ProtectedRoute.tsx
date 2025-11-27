// FileName: ProtectedRoute.tsx
// Path: src/components/common/ProtectedRoute.tsx

import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import type { User } from "../../types";
import { getStoreProfile } from "../../services/api/store";

const AuthSpinner = () => (
  <div className="flex justify-center items-center h-screen bg-background-main">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
  </div>
);

/* ============================================================
   🔓 RUTAS PÚBLICAS (solo estas pasan SIN TOKEN)
   ============================================================ */
const PUBLIC_ROUTES = [
  "/",               // Landing
  "/login",          // Login
  "/registro-tienda" // Registro de tienda
];

// Rutas públicas SIN startsWith (esto es lo que estaba mal)
const isPublicRoute = (pathname: string) => {
  return PUBLIC_ROUTES.includes(pathname);
};

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: (User["role"])[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const location = useLocation();
  const pathname = location.pathname;
  const token = localStorage.getItem("authToken");

  /* ============================================================
     🟢 1) Si la ruta es pública → DEJA PASAR
     ============================================================ */
  if (isPublicRoute(pathname)) {
    return <>{children}</>;
  }

  /* ============================================================
     🟡 2) RUTAS PROTEGIDAS
     ============================================================ */
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [authError, setAuthError] = useState(false);

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    const validateUser = async () => {
      try {
        const userData = await getStoreProfile();
        const normalizedRole =
          userData.role || userData.rol || userData.userType || "store";

        setUser({ ...userData, role: normalizedRole });
      } catch (error) {
        localStorage.clear();
        setAuthError(true);
      } finally {
        setIsLoading(false);
      }
    };

    validateUser();
  }, [token]);

  if (isLoading) return <AuthSpinner />;

  /* ============================================================
     🔴 3) Sin token → login (sin sessionExpired)
     ============================================================ */
  if (!token || authError || !user) {
    return <Navigate to="/login" replace />;
  }

  const userRole = user.role || "store";

  /* ============================================================
     🔐 4) Validar roles
     ============================================================ */
  if (!allowedRoles.includes(userRole)) {
    if (userRole === "superadmin") return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/tienda/dashboard" replace />;
  }

  /* ============================================================
     🏪 5) Lógica para TIENDAS
     ============================================================ */
  if (userRole === "store") {
    const tienda = user.store;

    if (!tienda) return <Navigate to="/registro-tienda" replace />;

    if (tienda.status === "pending" && pathname !== "/tienda/pendiente")
      return <Navigate to="/tienda/pendiente" replace />;

    if (tienda.status === "rejected" && pathname !== "/tienda/rechazada")
      return <Navigate to="/tienda/rechazada" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
