// FileName: ProtectedRoute.tsx
// Path: src/components/common/ProtectedRoute.tsx

import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import type { User } from "../../types";
import { getStoreProfile } from "../../services/api/store";

/* ============================================================
   🔄 Spinner de carga
   ============================================================ */
const AuthSpinner = () => (
  <div className="flex justify-center items-center h-screen bg-background-main">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
  </div>
);

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: (User["role"])[];
}

/* ============================================================
   🧩 ProtectedRoute: control de acceso y redirecciones
   ============================================================ */
const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const location = useLocation();
  const token = localStorage.getItem("authToken");

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

        console.log("🧩 Usuario obtenido en ProtectedRoute:", userData);

        // Normalizamos el rol (no forzamos "store" para superadmin)
        const normalizedRole =
          userData.role || userData.rol || userData.userType || "store";

        const fixedUser: User = {
          ...userData,
          role: normalizedRole,
        };

        setUser(fixedUser);
      } catch (error) {
        console.error("❌ Error validando usuario en ProtectedRoute:", error);
        localStorage.clear();
        setAuthError(true);
      } finally {
        setIsLoading(false);
      }
    };

    validateUser();
  }, [token]);

  /* ============================================================
     🕐 Cargando
     ============================================================ */
  if (isLoading) return <AuthSpinner />;

  /* ============================================================
     🚫 No autenticado o error
     ============================================================ */
  if (!token || authError || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const userRole = user.role || "store";

  /* ============================================================
     🔐 Validar rol permitido
     ============================================================ */
  if (!allowedRoles.includes(userRole)) {
    console.warn("⚠️ Rol no permitido:", userRole);

    // Superadmin siempre a su dashboard
    if (userRole === "superadmin") {
      return <Navigate to="/admin/dashboard" replace />;
    }

    // Store siempre a su dashboard (por defecto)
    if (userRole === "store") {
      return <Navigate to="/tienda/dashboard" replace />;
    }

    // Otros roles no reconocidos → login
    return <Navigate to="/login" replace />;
  }

  /* ============================================================
     🧠 Lógica especial SOLO para rol 'store'
     ============================================================ */
  if (userRole === "store") {
    const tienda = user.store;

    if (!tienda) {
      console.warn("⚠️ El usuario STORE no tiene objeto tienda asociado.");
      if (location.pathname === "/registro-tienda") return <>{children}</>;
      return <Navigate to="/registro-tienda" replace />;
    }

    const status = tienda.status || "pending";
    const isPendingPage = location.pathname === "/tienda/pendiente";
    const isRejectedPage = location.pathname === "/tienda/rechazada";

    console.log("🏪 Estado de la tienda:", status);

    if (status === "pending") {
      if (isPendingPage) return <>{children}</>;
      return <Navigate to="/tienda/pendiente" replace />;
    }

    if (status === "rejected") {
      if (isRejectedPage) return <>{children}</>;
      return <Navigate to="/tienda/rechazada" replace />;
    }

    if (status === "approved" && (isPendingPage || isRejectedPage)) {
      return <Navigate to="/tienda/dashboard" replace />;
    }

    return <>{children}</>;
  }

  /* ============================================================
     ✅ Si pasa todas las validaciones
     ============================================================ */
  return <>{children}</>;
};

export default ProtectedRoute;
