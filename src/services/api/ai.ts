import { getStoreProfile } from './store';

export interface AIRecommendation {
  store_id: number;
  topProducts: Array<{
    id: number;
    name: string;
    total_sold: number;
  }>;
  lowProducts: Array<{
    id: number;
    name: string;
    total_sold: number;
  }>;
  aiSummary: string;
  aiTopProductAnalysis: string[];
  aiLowProductAnalysis: string[];
}

// ✅ INTERFACE CORREGIDA según el response real de reportes
export interface RawData {
  store_id: number;
  apartado: Array<{
    id: number;
    product: {
      id: number;
      name: string;
      price: string;
      stock: number;
    };
    quantity: number;
    unit_price: string;
    total_price: string;
    product_name?: string;  // Retrocompatibilidad
    total?: number;         // Retrocompatibilidad
  }>;
  full: Array<{
    id: number;
    product: {
      id: number;
      name: string;
      price: string;
      stock: number;
    };
    quantity: number;
    unit_price: string;
    total_price: string;
    product_name?: string;  // Retrocompatibilidad
    total?: number;         // Retrocompatibilidad
  }>;
  fisico: Array<{
    id: number;
    product: {
      id: number;
      name: string;
      price: string;
      stock: number;
    };
    quantity: number;
    unit_price: string;
    total_price: string;
    product_name?: string;  // Retrocompatibilidad
    total?: number;         // Retrocompatibilidad
  }>;
  top_sales: Array<{
    id: number;
    name: string;
    total_sold: number;
  }>;
  top_lowest_sales: Array<{
    id: number;
    name: string;
    total_sold: number;
  }>;
  total_sales: number | null;
  total_products_sales: number;
  average_ticket: number | null;
  month_range: {
    from: string;
    to: string;
  };
}

export interface FullAPIResponse {
  data: RawData;
  ai_parsed: AIRecommendation;
}

// ✅ INTERFACE CORREGIDA según el response real
export interface PromotionsData {
  store_id: number;
  products: Array<{
    id: number;
    product: {
      id: number;
      name: string;
      price: string;
      stock: number;
    };
    quantity: number;
    unit_price: string;
    total_price: string;
  }>;
  promotionRecommendations: string[];
  pricingSuggestions: string[];
  visibilityTips: string[];
}

export const fetchAIRecommendationsstats = async (): Promise<AIRecommendation> => {
  try {
    const user = await getStoreProfile();
    
    if (!user?.store?.id) {
      throw new Error('No se pudo obtener la información de tu tienda');
    }
    
    const storeId = user.store.id;
    const endpoint = `https://lookappapi.onrender.com/purchases/store/${storeId}/recommendations`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 180000);

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 404) throw new Error('No se encontró información para esta tienda');
      if (response.status === 500) throw new Error('Error en el servidor. Intenta de nuevo');
      throw new Error(`Error del servidor (${response.status})`);
    }

    const result = await response.json();

    if (!result || typeof result !== 'object') {
      throw new Error('La respuesta del servidor no tiene el formato esperado');
    }

    const processAnalysis = (analysis: any): string[] => {
      if (Array.isArray(analysis)) {
        return analysis
          .filter((line: any) => typeof line === 'string')
          .map((line: string) => line.trim())
          .filter((line: string) => line.length > 0);
      }
      
      if (typeof analysis === 'string' && analysis.trim()) {
        return analysis
          .split('\n')
          .map((line: string) => line.trim())
          .filter((line: string) => line.length > 0);
      }
      
      return [];
    };

    const aiRecommendation: AIRecommendation = {
      store_id: typeof result.store_id === 'number' ? result.store_id : storeId,
      topProducts: Array.isArray(result.topProducts) ? result.topProducts.map((p: any) => ({
        id: Number(p.id || 0),
        name: String(p.name || ''),
        total_sold: Number(p.total_sold || 0)
      })) : [],
      lowProducts: Array.isArray(result.lowProducts) ? result.lowProducts.map((p: any) => ({
        id: Number(p.id || 0),
        name: String(p.name || ''),
        total_sold: Number(p.total_sold || 0)
      })) : [],
      aiSummary: typeof result.aiSummary === 'string' ? result.aiSummary.trim() : '',
      aiTopProductAnalysis: processAnalysis(result.aiTopProductAnalysis || []),
      aiLowProductAnalysis: processAnalysis(result.aiLowProductAnalysis || []),
    };

    return aiRecommendation;

  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error('La solicitud tardó demasiado tiempo. Intenta nuevamente.');
    }
    
    if (error.message?.includes('Failed to fetch')) {
      throw new Error('Error de conexión. Verifica tu internet.');
    }

    throw error;
  }
};

export const fetchRawReportData = async (): Promise<RawData> => {
  try {
    const user = await getStoreProfile();
    
    if (!user?.store?.id) {
      throw new Error('No se pudo obtener la información de tu tienda');
    }
    
    const storeId = user.store.id;
    const endpoint = `https://lookappapi.onrender.com/purchases/store/${storeId}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 180000);

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 404) throw new Error('No se encontró información para esta tienda');
      if (response.status === 500) throw new Error('Error en el servidor. Intenta de nuevo');
      throw new Error(`Error del servidor (${response.status})`);
    }

    const result = await response.json();

    if (!result || typeof result !== 'object') {
      throw new Error('La respuesta del servidor no tiene el formato esperado');
    }

    // ✅ Normalizar datos para retrocompatibilidad
    const normalizeProduct = (item: any) => {
      // Si viene con estructura nueva (product anidado)
      if (item.product && typeof item.product === 'object') {
        return {
          ...item,
          product_name: item.product.name,  // Agregar campo plano
          total: parseFloat(item.total_price || '0'),  // Agregar campo plano
        };
      }
      // Si viene con estructura antigua
      return item;
    };

    const normalizedData: RawData = {
      ...result,
      apartado: Array.isArray(result.apartado) ? result.apartado.map(normalizeProduct) : [],
      full: Array.isArray(result.full) ? result.full.map(normalizeProduct) : [],
      fisico: Array.isArray(result.fisico) ? result.fisico.map(normalizeProduct) : [],
      top_sales: Array.isArray(result.top_sales) ? result.top_sales : [],
      top_lowest_sales: Array.isArray(result.top_lowest_sales) ? result.top_lowest_sales : [],
    };

    return normalizedData;

  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error('La solicitud tardó demasiado tiempo. Intenta nuevamente.');
    }
    
    if (error.message?.includes('Failed to fetch')) {
      throw new Error('Error de conexión. Verifica tu internet.');
    }

    throw error;
  }
};

export const fetchFullStoreData = async (): Promise<FullAPIResponse> => {
  try {
    const user = await getStoreProfile();
    
    if (!user?.store?.id) {
      throw new Error('No se pudo obtener la información de tu tienda');
    }
    
    throw new Error('Esta función ya no está disponible con el nuevo endpoint');
  } catch (error: any) {
    throw error;
  }
};

// ✅ FUNCIÓN COMPLETAMENTE CORREGIDA
export const fetchPromotionsData = async (): Promise<PromotionsData> => {
  try {
    const user = await getStoreProfile();
    
    if (!user?.store?.id) {
      throw new Error('No se pudo obtener la información de tu tienda');
    }
    
    const storeId = user.store.id;
    const endpoint = `https://lookappapi.onrender.com/purchases/store/${storeId}/promotions`;

    console.log('🔍 Fetching promotions from:', endpoint);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 180000);

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    console.log('📡 Response status:', response.status);

    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      let errorMessage = `Error del servidor (${response.status})`;
      
      try {
        if (contentType?.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } else {
          const errorText = await response.text();
          console.error('❌ Error response:', errorText.substring(0, 200));
        }
      } catch (e) {
        console.error('❌ Could not parse error response');
      }
      
      if (response.status === 404) {
        throw new Error('El endpoint de promociones no existe o no hay datos disponibles');
      }
      if (response.status === 500) {
        throw new Error('Error en el servidor. Intenta de nuevo más tarde');
      }
      throw new Error(errorMessage);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      throw new Error(`El servidor devolvió ${contentType} en lugar de JSON`);
    }

    const result = await response.json();
    console.log('✅ Promotions data received:', result);

    if (!result || typeof result !== 'object') {
      throw new Error('La respuesta del servidor no tiene el formato esperado');
    }

    // Helper para limpiar texto de markdown
    const cleanMarkdown = (text: string): string => {
      return text
        .replace(/\*\*/g, '')  // Eliminar asteriscos
        .replace(/^#+\s*/g, '') // Eliminar headers markdown
        .trim();
    };

    // Helper para filtrar y limpiar arrays de strings
    const cleanStringArray = (arr: any[]): string[] => {
      return arr
        .filter((item: any) => typeof item === 'string')
        .map((item: string) => cleanMarkdown(item))
        .filter((item: string) => item.length > 5); // Filtrar strings muy cortos
    };

    // ✅ Mapear correctamente según la estructura real del response
    const promotionsData: PromotionsData = {
      store_id: typeof result.store_id === 'number' ? result.store_id : storeId,
      
      // ✅ CORREGIDO: Mapear productos con estructura anidada
      products: Array.isArray(result.products) ? result.products.map((item: any) => ({
        id: Number(item.id || 0),
        product: {
          id: Number(item.product?.id || 0),
          name: String(item.product?.name || ''),
          price: String(item.product?.price || '0.00'),
          stock: Number(item.product?.stock || 0)
        },
        quantity: Number(item.quantity || 0),
        unit_price: String(item.unit_price || '0.00'),
        total_price: String(item.total_price || '0.00')
      })) : [],
      
      // ✅ Limpiar arrays de recomendaciones
      promotionRecommendations: Array.isArray(result.promotionRecommendations) 
        ? cleanStringArray(result.promotionRecommendations)
        : [],
      
      pricingSuggestions: Array.isArray(result.pricingSuggestions)
        ? cleanStringArray(result.pricingSuggestions)
        : [],
      
      visibilityTips: Array.isArray(result.visibilityTips)
        ? cleanStringArray(result.visibilityTips)
        : [],
    };

    return promotionsData;

  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error('La solicitud tardó demasiado tiempo. Intenta nuevamente.');
    }
    
    if (error.message?.includes('Failed to fetch')) {
      throw new Error('Error de conexión. Verifica tu internet.');
    }

    throw error;
  }
};