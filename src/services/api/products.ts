// File: src/services/api/products.ts
import { fetchWithAuth, API_BASE_URL } from "./helpers";
import { getStoreProfile } from "./store";

/* ============================================================
   🧩 Interfaces
============================================================ */
export interface ProductCategory {
  id: number;
  name: string;
  description: string;
  createdAt: string;
}

export interface CategoriesResponse {
  statusCode: number;
  message: string;
  total: number;
  data: ProductCategory[];
}

export interface CreateCategoryData {
  name: string;
  description: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: string | number;
  stock: number;
  imageUrl: string;
  category: ProductCategory;
  createdAt: string;
  barcode?: string;
  status?: string;
  apartados?: number;
  comprados?: number;
}

export interface ProductsResponse {
  statusCode: number;
  message: string;
  total: number;
  data: Product[];
}

export interface CreateProductData {
  name: string;
  description?: string;
  price: number;
  stock: number;
  storeId?: number;
  categoryId: number;
  image?: File;
}

export interface UpdateProductData {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  categoryId?: number;
  image?: File;
}

/* ============================================================
   🆕 Interfaces para Compras Completas y Apartados
============================================================ */

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  username: string;
  role: string;
  created_at: string;
  stripe_customer_id?: string;
}

export interface Store {
  id: number;
  business_name: string;
  owner_name: string;
  address: string;
  map_url: string;
  longitude: string;
  latitude: string;
  description: string;
  status: string;
  is_verified: boolean;
}

export interface ProductDetail {
  id: number;
  name: string;
  description: string;
  aiDescription: string | null;
  price: string;
  stock: number;
  imageUrl: string;
  createdAt: string;
}

export interface FullPurchase {
  id: number;
  product: ProductDetail;
  store: Store;
  user: User;
  quantity: number;
  unit_price: string;
  total_price: string;
  status: 'pendiente' | 'recogido';
  created_at: string;
  updated_at: string;
}

export interface FullPurchaseResponse {
  ok: boolean;
  total: number;
  data: FullPurchase[];
}

export interface Apartado {
  id: number;
  user: User;
  store: Store;
  product: ProductDetail;
  quantity: number;
  unit_price: string;
  total_price: string;
  porcentaje_pagado: string;
  monto_pagado: string;
  saldo_pendiente: string;
  saldo_final: string;
  status: 'apartado' | 'liquidado' | 'recogido';
  created_at: string;
  updated_at: string;
}


export interface Comprasfisicas {
  id: number;
  user: User;
  store: Store;
  product: ProductDetail;
  quantity: number;
  unit_price: string;
  total_price: string;
  status: 'pendiente' | 'recogido' | 'vencido';
  created_at: string;
  updated_at: string;
}

export interface ApartadosResponse {
  ok: boolean;
  total: number;
  data: Apartado[];
}

/* ============================================================
   📦 Categorías
============================================================ */

export const getProductCategories = async (): Promise<ProductCategory[]> => {
  const result: CategoriesResponse = await fetchWithAuth(`/product-categories`, {
    method: "GET",
  });

  if (!result?.data || !Array.isArray(result.data)) {
    console.warn("⚠️ Respuesta inválida en categorías:", result);
    return [];
  }

  return result.data;
};

export const createProductCategory = async (
  categoryData: CreateCategoryData
): Promise<ProductCategory> => {
  const result = await fetchWithAuth(`/product-categories`, {
    method: "POST",
    body: JSON.stringify(categoryData),
  });

  if (!result?.data) {
    throw new Error("No se recibió la categoría creada correctamente");
  }

  return result.data;
};

/* ============================================================
   🛍️ Productos
============================================================ */

export const createProduct = async (
  productData: CreateProductData
): Promise<Product> => {
  const profile = await getStoreProfile();
  const storeId = profile?.store?.id;

  if (!storeId) {
    throw new Error("No se encontró la tienda asociada al usuario.");
  }

  const formData = new FormData();
  formData.append("name", productData.name);
  formData.append("price", productData.price.toString());
  formData.append("stock", productData.stock.toString());
  formData.append("storeId", storeId.toString());
  formData.append("categoryId", productData.categoryId.toString());

  if (productData.description)
    formData.append("description", productData.description);
  if (productData.image)
    formData.append("image", productData.image);

  const token = localStorage.getItem("authToken");
  if (!token) throw new Error("No se encontró token de autenticación");

  const response = await fetch(`${API_BASE_URL}/products`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    let message = `Error HTTP ${response.status}`;
    try {
      const err = await response.json();
      message = err.message || message;
    } catch {
      // respuesta no JSON
    }
    throw new Error(message);
  }

  const result = await response.json();
  return result.data || result;
};

/**
 * ✅ ACTUALIZA un producto existente - VERSIÓN CORREGIDA CON PUT
 */
export const updateProduct = async (
  productId: number,
  productData: UpdateProductData
): Promise<Product> => {
  const token = localStorage.getItem("authToken");
  if (!token) throw new Error("No se encontró token de autenticación");

  const profile = await getStoreProfile();
  const storeId = profile?.store?.id;

  if (!storeId) {
    throw new Error("No se encontró la tienda asociada al usuario.");
  }

  // ✅ URL CORRECTA
  const url = `${API_BASE_URL}/products/${productId}`;

  console.log('🔧 Actualizando producto:', {
    url,
    productId,
    data: productData
  });

  // Si hay imagen, usar FormData
  if (productData.image) {
    const formData = new FormData();
    
    // ✅ Enviar TODOS los campos requeridos
    if (productData.name) formData.append("name", productData.name);
    if (productData.description !== undefined) formData.append("description", productData.description);
    if (productData.price !== undefined) formData.append("price", productData.price.toString());
    if (productData.stock !== undefined) formData.append("stock", productData.stock.toString());
    formData.append("storeId", storeId.toString());
    if (productData.categoryId) formData.append("categoryId", productData.categoryId.toString());
    formData.append("image", productData.image);

    const response = await fetch(url, {
      method: "PUT", // ✅ CAMBIO CRÍTICO: PUT en lugar de PATCH
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      let errorMessage = `Error HTTP ${response.status}`;
      let errorDetails = '';
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
        errorDetails = JSON.stringify(errorData, null, 2);
        console.error('❌ Error del servidor:', errorData);
      } catch {
        try {
          errorDetails = await response.text();
          console.error('❌ Error (texto):', errorDetails);
        } catch {
          errorDetails = 'No se pudo obtener detalles del error';
        }
      }
      
      throw new Error(`${errorMessage}\n\nDetalles: ${errorDetails}`);
    }

    const result = await response.json();
    return result.data || result;
  }

  // Si no hay imagen, usar JSON
  const bodyData: any = {
    storeId: storeId,
  };

  if (productData.name !== undefined) bodyData.name = productData.name;
  if (productData.description !== undefined) bodyData.description = productData.description;
  if (productData.price !== undefined) bodyData.price = productData.price;
  if (productData.stock !== undefined) bodyData.stock = productData.stock;
  if (productData.categoryId !== undefined) bodyData.categoryId = productData.categoryId;

  console.log('📤 Enviando datos (JSON):', bodyData);

  const response = await fetch(url, {
    method: "PUT", // ✅ CAMBIO CRÍTICO: PUT en lugar de PATCH
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(bodyData),
  });

  if (!response.ok) {
    let errorMessage = `Error HTTP ${response.status}`;
    let errorDetails = '';
    
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
      errorDetails = JSON.stringify(errorData, null, 2);
      console.error('❌ Error del servidor:', errorData);
    } catch {
      try {
        errorDetails = await response.text();
        console.error('❌ Error (texto):', errorDetails);
      } catch {
        errorDetails = 'No se pudo obtener detalles del error';
      }
    }
    
    throw new Error(`${errorMessage}\n\nDetalles: ${errorDetails}`);
  }

  const result = await response.json();
  console.log('✅ Producto actualizado:', result);
  return result.data || result;
};

export const deleteProduct = async (productId: number): Promise<void> => {
  const result = await fetchWithAuth(`/products/${productId}`, {
    method: "DELETE",
  });

  if (!result?.ok && result?.statusCode !== 200) {
    throw new Error(result?.message || "Error al eliminar el producto");
  }
};

/* ============================================================
   🛒 Compras Completas
============================================================ */

export const getFullPurchases = async (
  status: 'pendiente' | 'recogido'
): Promise<FullPurchase[]> => {
  try {
    const result: FullPurchaseResponse = await fetchWithAuth(
      `/app/purchase/full?status=${status}`,
      { method: "GET" }
    );

    if (!result?.data || !Array.isArray(result.data)) {
      console.warn("⚠️ Respuesta inválida en compras completas:", result);
      return [];
    }

    return result.data;
  } catch (error) {
    console.error(`Error al obtener compras con estado ${status}:`, error);
    throw error;
  }
};

export const getPendingPurchases = async (): Promise<FullPurchase[]> => {
  return getFullPurchases('pendiente');
};

export const getPickedUpPurchases = async (): Promise<FullPurchase[]> => {
  return getFullPurchases('recogido');
};

/* ============================================================
   💰 Compras fisicas
============================================================ */

/* ============================================================
   💰 Compras fisicas
============================================================ */

export const getComprasFisicas = async (
  status: 'pendiente' | 'recogido' | 'vencido'
): Promise<Comprasfisicas[]> => {
  try {
    // ✅ El endpoint devuelve DIRECTAMENTE un array, no un objeto con .data
    const result = await fetchWithAuth(
      `/web/stores/listar`,
      { 
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      }
    );

    console.log('📦 Respuesta raw de compras físicas:', result);

    // ✅ CAMBIO CRÍTICO: El API devuelve un array directamente
    if (!Array.isArray(result)) {
      console.warn("⚠️ Respuesta inválida en comprasfisicas (no es array):", result);
      return [];
    }

    return result; // ✅ Devolver directamente el array
  } catch (error) {
    console.error(`Error al obtener compras fisicas con estado ${status}:`, error);
    throw error;
  }
};
export const getpendfisico = async (): Promise<Comprasfisicas[]> => {
  return getComprasFisicas('pendiente');
};

export const getrecogidosifico = async (): Promise<Comprasfisicas[]> => {
  return getComprasFisicas('recogido');
};

export const getvencidofisico = async (): Promise<Comprasfisicas[]> => {
  return getComprasFisicas('vencido');
};



/* ============================================================
   📦 Obtener Todos los Apartados y Compras Completas
============================================================ */
export const getApartados = async (
  status: 'apartado' | 'liquidado' | 'recogido'
): Promise<Apartado[]> => {
  try {
    const result: ApartadosResponse = await fetchWithAuth(
      `/app/apartados/mine?status=${status}`,
      { method: "GET" }
    );

    if (!result?.data || !Array.isArray(result.data)) {
      console.warn("⚠️ Respuesta inválida en apartados:", result);
      return [];
    }

    return result.data;
  } catch (error) {
    console.error(`Error al obtener apartados con estado ${status}:`, error);
    throw error;
  }
};

export const getActiveApartados = async (): Promise<Apartado[]> => {
  return getApartados('apartado');
};

export const getLiquidatedApartados = async (): Promise<Apartado[]> => {
  return getApartados('liquidado');
};

export const getPickedUpApartados = async (): Promise<Apartado[]> => {
  return getApartados('recogido');
};












export const getAllFullPurchases = async (): Promise<{
  pendientes: FullPurchase[];
  recogidas: FullPurchase[];
}> => {
  try {
    const [pendientes, recogidas] = await Promise.all([
      getPendingPurchases(),
      getPickedUpPurchases(),
    ]);

    return {
      pendientes,
      recogidas,
    };
  } catch (error) {
    console.error("Error al obtener todas las compras completas:", error);
    throw error;
  }
};

/* ============================================================
   📊 SUSCRIPCIÓN
============================================================ */

export interface Subscription {
  id?: number;
  plan_name: string;
  status: string;
  start_date: string;
  end_date: string;
  subscription_id?: string;
}

export interface SubscriptionResponse {
  ok: boolean;
  data: Subscription;
}

export const getStoreSubscription = async (): Promise<Subscription> => {
  try {
    const result: SubscriptionResponse = await fetchWithAuth(
      '/web/stores/mine/subscription',
      { method: "GET" }
    );

    if (!result?.data) {
      console.warn("⚠️ Respuesta inválida en suscripción:", result);
      return {
        plan_name: 'Plan Básico',
        status: 'active',
        start_date: new Date().toISOString(),
        end_date: new Date().toISOString(),
      };
    }

    return result.data;
  } catch (error) {
    console.error("Error al obtener suscripción:", error);
    return {
      plan_name: 'Plan Básico',
      status: 'active',
      start_date: new Date().toISOString(),
      end_date: new Date().toISOString(),
    };
  }
};

export const hasAIRecommendationsAccess = async (): Promise<boolean> => {
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      const planValue = user.subscription?.plan || user.subscription?.plan_name;
      
      if (!planValue) {
        console.warn('⚠️ No hay plan en subscription');
        return false;
      }
      
      const planLower = planValue.toLowerCase();
      const hasPremiumPlan = planLower === 'premium' || 
                             planLower.includes('premium') || 
                             planLower.includes('ia');
      
      const isActive = user.subscription?.status === 'active' || 
                      user.subscription?.status === 'Activo';
      
      if (hasPremiumPlan && isActive) {
        return true;
      }
    }
    
    const subscription = await getStoreSubscription();
    const planValue = (subscription as any).plan || subscription.plan_name;
    const planLower = planValue?.toLowerCase() || '';
    const isPremiumPlan = planLower === 'premium' || 
                          planLower.includes('premium') || 
                          planLower.includes('ia');
    const isActive = subscription.status === 'active' || subscription.status === 'Activo';
    
    return isPremiumPlan && isActive;
    
  } catch (error) {
    console.error("❌ Error al verificar acceso a recomendaciones:", error);
    return false;
  }
};

/* ============================================================
   ✅ Marcar Compra como Recogida
============================================================ */
export const markPurchaseAsPickedUp = async (purchaseId: number): Promise<FullPurchase> => {
  try {
    const result = await fetchWithAuth(
      `/web/stores/mine/purchases-full/${purchaseId}/pick`,
      { 
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        }
      }
    );

    if (!result?.data && !result?.ok) {
      throw new Error(result?.message || "Error al marcar la compra como recogida");
    }

    return result.data || result;
  } catch (error: any) {
    console.error("Error al marcar compra como recogida:", error);
    throw new Error(error.message || "No se pudo marcar la compra como recogida");
  }
};


/* ============================================================
   ✅ Marcar Apartado como Recogido
============================================================ */
export const markApartadoAsPickedUp = async (apartadoId: number): Promise<Apartado> => {
  try {
    const result = await fetchWithAuth(
      `/web/stores/purchase/apartado/recoger`,
      { 
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ apartado_id: apartadoId }),
      }
    );

    if (!result?.data && !result?.ok) {
      throw new Error(result?.message || "Error al marcar el apartado como recogido");
    }

    return result.data || result;
  } catch (error: any) {
    console.error("Error al marcar apartado como recogido:", error);
    throw new Error(error.message || "No se pudo marcar el apartado como recogido");
  }
};

export const markproductfisicoPickedUp = async (ComprafisicaId: number): Promise<Comprasfisicas> => {
  try {
    const result = await fetchWithAuth(
      `/web/stores/recoger`,
      { 
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fisico_id: ComprafisicaId }),
      }
    );

    console.log('📦 Respuesta de marcar recogido:', result);

    // ✅ El API devuelve { ok, message, data }
    if (!result?.ok || !result?.data) {
      throw new Error(result?.message || "Error al marcar el producto como recogido");
    }

    return result.data;
  } catch (error: any) {
    console.error("Error al marcar el producto fisico como recogido:", error);
    throw new Error(error.message || "No se pudo marcar el producto fisico como recogido");
  }
};