// FileName: admin.ts
// Path: src/services/api/admin.ts
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
  return res.data;
};

/** 🏪 Tiendas aprobadas */
export const getAdminApprovedStores = async (): Promise<Store[]> => {
  const res: GetStoresResponse = await fetchWithAuth("/web/superadmin/approved", { method: "GET" });
  return res.data || [];
};

/** 🕒 Tiendas pendientes de aprobación */
export const getAdminPendingStores = async (): Promise<Store[]> => {
  const res: GetStoresResponse = await fetchWithAuth("/web/superadmin/pending", { method: "GET" });
  return res.data || [];
};

/** ❌ Tiendas rechazadas */
export const getAdminRejectedStores = async (): Promise<Store[]> => {
  const res: GetStoresResponse = await fetchWithAuth("/web/superadmin/rejected", { method: "GET" });
  return res.data || [];
};

/** 🏪 Todas las tiendas */
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
  return res.data;
};

/** 📈 Obtener estadísticas de una tienda por su ID */
export const getAdminStoreStatsById = async (id: string): Promise<any> => {
  const res = await fetchWithAuth(`/web/stores/${id}`, { method: "GET" });
  if (!res?.data) throw new Error("No se pudieron obtener las estadísticas de la tienda.");
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
  return res.data;
};

/** 👤 Actualizar un usuario existente */
export const updateUser = async (id: number, data: Partial<User>): Promise<User> => {
  const body = {
    name: data.name,
    email: data.email,
    password: data.password || "123456",
    phone: data.phone || "",
    username: data.username || (data.email ? data.email.split("@")[0] : "usuario"),
    role: data.role || "client",
  };

  const res = await fetchWithAuth(`/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok && !res?.data) throw new Error(`Error al actualizar usuario (${res.status})`);
  return res.data;
};

/** 👤 Eliminar un usuario */
export const deleteUser = async (id: number): Promise<void> => {
  const res = await fetchWithAuth(`/users/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar usuario");
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
  return res;
};

/** 🚫 Rechazar tienda pendiente */
export const rejectStore = async (id: string) => {
  const res = await fetchWithAuth(`/web/superadmin/${id}/reject`, { method: "PATCH" });
  if (!res?.message && res.status !== 200) throw new Error("No se pudo rechazar la tienda.");
  return res;
};

/** 🗑️ ELIMINAR TIENDA (NUEVO) */
export const deleteStore = async (id: string): Promise<void> => {
  const res = await fetchWithAuth(`/web/stores/${id}`, { method: "DELETE" });
  // Verificamos si la respuesta es exitosa (200 o 204)
  if (!res.ok && res.status !== 200 && res.status !== 204) {
      throw new Error("Error al eliminar la tienda");
  }
  console.log(`🗑️ Tienda ${id} eliminada`);
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

/** 🔹 Obtener tiendas según estado */
export const getAdminStoresByStatus = async (status: "pending" | "approved" | "rejected", page = 1) => {
  let endpoint = `/web/superadmin/${status}`;
  const res = await fetchWithAuth(`${endpoint}?page=${page}`, { method: "GET" });
  if (!res?.data) throw new Error(`Error obteniendo tiendas ${status}`);
  return res.data;
};

/** 🔹 Actualizar estado de una tienda */
export const updateStoreStatus = async (storeId: number, newStatus: string) => {
  const endpoint = newStatus === "approved"
      ? `/web/superadmin/${storeId}/approve`
      : `/web/superadmin/${storeId}/reject`;
  const res = await fetchWithAuth(endpoint, { method: "PATCH" });
  if (!res?.message && res.status !== 200) throw new Error(`Error al cambiar estado a ${newStatus}`);
  return res;
};

/* ============================================================
   🧾 Actividad reciente
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
      users.value.slice(-5).forEach((u: any) => activities.push({ id: `user-${u.id}`, type: "user", name: u.name || u.email, date: u.created_at || new Date().toISOString(), description: "Nuevo usuario registrado" }));
    }
    if (stores.status === "fulfilled") {
      stores.value.slice(-5).forEach((s: any) => activities.push({ id: `store-${s.id}`, type: "store", name: s.business_name, date: s.created_at || new Date().toISOString(), description: "Tienda aprobada recientemente" }));
    }
    if (subs.status === "fulfilled") {
      subs.value.slice(-5).forEach((sub: any) => activities.push({ id: `sub-${sub.id}`, type: "subscription", name: sub.store_name || "Suscripción activa", date: sub.created_at || new Date().toISOString(), description: "Nueva suscripción iniciada" }));
    }

    return activities.filter((a) => a.date).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
  } catch (err) {
    return [];
  }
}

/** 🔸 Obtener todas las categorías */
export const getCategories = async (): Promise<any[]> => {
  const res = await fetchWithAuth("/categories", { method: "GET" });
  if (!res?.data) throw new Error("No se pudieron obtener las categorías");
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