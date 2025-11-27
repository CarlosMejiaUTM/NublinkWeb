// ✅ File: src/services/api/admin.ts
import { fetchWithAuth } from "./helpers";
import type {
  AdminDashboardSummary,
  GetStoresResponse,
  GetUsersResponse,
  Store,
  User,
  Product,
} from "../../types";

/* ============================================================
   🧠 SUPERADMIN API SERVICE
   Funciones exclusivas del panel de SuperAdministrador
   ============================================================ */

/** 📊 Estadísticas generales del sistema */
export const getAdminDashboardData = async (): Promise<AdminDashboardSummary> => {
  const res = await fetchWithAuth("/web/superadmin/admin/stats", { method: "GET" });
  if (!res?.data) throw new Error("No se pudo obtener /web/superadmin/admin/stats");
  console.log("🟢 Dashboard cargado:", res.data);
  return res.data;
};

/** 🏪 Tiendas aprobadas */
export const getAdminApprovedStores = async (): Promise<Store[]> => {
  const res: GetStoresResponse = await fetchWithAuth("/web/superadmin/approved", {
    method: "GET",
  });
  return res.data || [];
};

/** 🕒 Tiendas pendientes de aprobación */
export const getAdminPendingStores = async (): Promise<Store[]> => {
  const res: GetStoresResponse = await fetchWithAuth("/web/superadmin/pending", {
    method: "GET",
  });
  return res.data || [];
};

/** ❌ Tiendas rechazadas */
export const getAdminRejectedStores = async (): Promise<Store[]> => {
  const res: GetStoresResponse = await fetchWithAuth("/web/superadmin/rejected", {
    method: "GET",
  });
  return res.data || [];
};

/** 🏪 Todas las tiendas (aprobadas + pendientes + rechazadas) */
export const getAdminAllStores = async (): Promise<Store[]> => {
  const [approved, pending, rejected] = await Promise.all([
    getAdminApprovedStores(),
    getAdminPendingStores(),
    getAdminRejectedStores(),
  ]);
  return [...approved, ...pending, ...rejected];
};

/** 🏪 Obtener información de una tienda por su ID */
export const getAdminStoreById = async (id: string): Promise<Store> => {
  const res = await fetchWithAuth(`/web/superadmin/store/${id}`, { method: "GET" });
  if (!res?.data) throw new Error("No se pudo obtener la tienda.");
  console.log("🟢 Tienda cargada:", res.data);
  return res.data;
};

/** 📈 Obtener estadísticas de una tienda por su ID */
export const getAdminStoreStatsById = async (id: string): Promise<any> => {
  const res = await fetchWithAuth(`/web/stores/${id}`, { method: "GET" });
  if (!res?.data) throw new Error("No se pudieron obtener las estadísticas de la tienda.");
  console.log("📊 Estadísticas de tienda cargadas:", res.data);
  return res.data;
};

/** 👤 Obtener todos los usuarios */
export const getAdminUsers = async (): Promise<User[]> => {
  const res: GetUsersResponse = await fetchWithAuth("/users", { method: "GET" });
  return res.data || [];
};

/** 👤 Crear un nuevo usuario */
export const createUser = async (data: Partial<User>): Promise<User> => {
  const res = await fetchWithAuth("/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok && !res?.data) throw new Error("Error al crear usuario");
  console.log("🟢 Usuario creado:", res.data);
  return res.data;
};

/** 👤 Actualizar un usuario existente (versión corregida para backend real) */
export const updateUser = async (id: number, data: Partial<User>): Promise<User> => {
  console.log("🟠 Actualizando usuario:", id, data);

  const body = {
    name: data.name,
    email: data.email,
    password: data.password || "123456", // requerido por backend
    phone: data.phone || "",
    username: data.username || (data.email ? data.email.split("@")[0] : "usuario"),
    role: data.role || "client",
  };

  const res = await fetchWithAuth(`/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok && !res?.data)
    throw new Error(`Error al actualizar usuario (${res.status})`);

  console.log("🟢 Usuario actualizado correctamente:", res.data);
  return res.data;
};

/** 👤 Eliminar un usuario */
export const deleteUser = async (id: number): Promise<void> => {
  const res = await fetchWithAuth(`/users/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar usuario");
  console.log(`🗑️ Usuario ${id} eliminado`);
};

/** 💳 Suscripciones */
export const getAdminSubscriptions = async (): Promise<any[]> => {
  const res = await fetchWithAuth("/web/stores/subscriptions", { method: "GET" });
  return res.data || [];
};

/** ✅ Aprobar tienda pendiente */
export const approveStore = async (id: string) => {
  const res = await fetchWithAuth(`/web/superadmin/${id}/approve`, { method: "PATCH" });
  if (!res?.message && res.status !== 200) throw new Error("No se pudo aprobar la tienda.");
  console.log(`🟢 Tienda ${id} aprobada correctamente`);
  return res;
};

/** 🚫 Rechazar tienda pendiente */
export const rejectStore = async (id: string) => {
  const res = await fetchWithAuth(`/web/superadmin/${id}/reject`, { method: "PATCH" });
  if (!res?.message && res.status !== 200) throw new Error("No se pudo rechazar la tienda.");
  console.log(`🟠 Tienda ${id} rechazada correctamente`);
  return res;
};

/** 🛍 Obtener todos los productos del admin */
export const getAdminAllProducts = async (): Promise<Product[]> => {
  const res = await fetchWithAuth("/products", { method: "GET" });
  return res.data || [];
};

/** 🤖 Obtener recomendaciones de IA */
export const fetchAIRecommendations = async (): Promise<any[]> => {
  const res = await fetchWithAuth("/analyze/text", { method: "POST" });
  return res.data || [];
};

/* ============================================================
   🔧 NUEVAS FUNCIONES para AdminStores.tsx
   ============================================================ */

/** 🔹 Obtener tiendas según estado (pendiente/aprobada/rechazada) */
export const getAdminStoresByStatus = async (
  status: "pending" | "approved" | "rejected",
  page = 1
) => {
  let endpoint = `/web/superadmin/${status}`;
  const res = await fetchWithAuth(`${endpoint}?page=${page}`, { method: "GET" });
  if (!res?.data) throw new Error(`Error obteniendo tiendas ${status}`);
  return res.data;
};

/** 🔹 Actualizar estado de una tienda (aprobada/rechazada) */
export const updateStoreStatus = async (storeId: number, newStatus: string) => {
  const endpoint =
    newStatus === "approved"
      ? `/web/superadmin/${storeId}/approve`
      : `/web/superadmin/${storeId}/reject`;
  const res = await fetchWithAuth(endpoint, { method: "PATCH" });
  if (!res?.message && res.status !== 200)
    throw new Error(`Error al cambiar estado a ${newStatus}`);
  console.log(`🟢 Estado actualizado a ${newStatus} para tienda ${storeId}`);
  return res;
};

/* ============================================================
   🧾 Actividad reciente combinada (usuarios, tiendas, subs)
   ============================================================ */
export async function getAdminRecentActivity() {
  try {
    const [users, stores, subs] = await Promise.allSettled([
      getAdminUsers(),
      getAdminApprovedStores(),
      getAdminSubscriptions(),
    ]);

    const activities: any[] = [];

    if (users.status === "fulfilled") {
      users.value.slice(-5).forEach((u: any) =>
        activities.push({
          id: `user-${u.id}`,
          type: "user",
          name: u.name || u.email || "Usuario sin nombre",
          date: u.created_at || u.updated_at || new Date().toISOString(),
          description: "Nuevo usuario registrado",
        })
      );
    }

    if (stores.status === "fulfilled") {
      stores.value.slice(-5).forEach((s: any) =>
        activities.push({
          id: `store-${s.id}`,
          type: "store",
          name: s.business_name || s.store_name || "Tienda sin nombre",
          date: s.created_at || s.updated_at || new Date().toISOString(),
          description: "Tienda aprobada recientemente",
        })
      );
    }

    if (subs.status === "fulfilled") {
      subs.value.slice(-5).forEach((sub: any) =>
        activities.push({
          id: `sub-${sub.id}`,
          type: "subscription",
          name: sub.store_name || "Suscripción activa",
          date: sub.created_at || sub.updated_at || new Date().toISOString(),
          description: "Nueva suscripción iniciada",
        })
      );
    }

    const ordered = activities
      .filter((a) => a.date)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    console.log("🟢 Actividad reciente cargada:", ordered);
    return ordered;
  } catch (err) {
    console.error("❌ Error al cargar actividad reciente:", err);
    return [];
  }
}

/* ============================================================
   📚 CATEGORIES
   ============================================================ */

/** 🔸 Obtener todas las categorías */
export const getCategories = async (): Promise<any[]> => {
  const res = await fetchWithAuth("/categories", { method: "GET" });
  if (!res?.data) throw new Error("No se pudieron obtener las categorías");
  console.log("🟢 Categorías cargadas:", res.data);
  return res.data;
};
/** 🧾 Historial completo de suscripciones/pagos por tienda */
export const getAdminStorePaymentsHistory = async (storeId: string): Promise<any[]> => {
  const res = await fetchWithAuth(`/web/superadmin/${storeId}/historial-payments`, {
    method: "GET",
  });

  if (!res?.data) {
    console.error("❌ Error cargando historial:", res);
    throw new Error("No se pudo obtener el historial de pagos");
  }

  console.log("🟢 Historial de pagos cargado:", res.data);
  return res.data;
};

/** 💳 Resumen global de suscripciones para SUPERADMIN */
export const getAdminSubscriptionsSummary = async (): Promise<any> => {
  const res = await fetchWithAuth("/web/superadmin/summary", { method: "GET" });

  // El backend NO usa "data", así que devolvemos la respuesta completa
  if (!res) {
    throw new Error("No se pudo obtener el resumen de suscripciones");
  }

  console.log("🟢 Resumen de suscripciones cargado:", res);
  return res; // retorna el JSON completo
};