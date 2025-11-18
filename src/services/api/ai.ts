
import { getStoreProfile } from './store';

// ==================== TIPOS ====================
export interface AIRecommendation {
  top_products: Array<{
    name?: string;
    productName?: string;
    productname?: string;
    qty?: number;
    totalQty?: number;
    totalqty?: number;
    revenue?: number;
    totalRevenue?: number;
    totalrevenue?: number;
    comparison?: string;
    comparison_with_global_avg?: string;
    comparison_vs_global?: string;
    reasons?: string[];
    possible_reasons?: string[];
    reason_1?: string;
    reason_2?: string;
  }>;
  low_products: Array<{
    name?: string;
    productName?: string;
    productname?: string;
    qty?: number;
    totalQty?: number;
    totalqty?: number;
    revenue?: number;
    totalRevenue?: number;
    totalrevenue?: number;
    comparison?: string;
    comparison_with_global_avg?: string;
    comparison_vs_global?: string;
    actions?: string[];
    recommended_actions?: string[];
    recommended_action_1?: string;
    recommended_action_2?: string;
    action_1?: string;
    action_2?: string;
  }>;
  executive_summary: string;
  recommendations?: string;
}

export interface RawData {
  top_products: Array<{
    productName: string;
    totalQty: number;
    totalRevenue: number;
  }>;
  low_products: Array<{
    productName: string;
    totalQty: number;
    totalRevenue: number;
  }>;
  sales_total: number;
}

export interface FullAPIResponse {
  data: RawData;
  ai_parsed: AIRecommendation;
}

// ==================== HELPERS ====================
const toNumber = (value: any): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = parseFloat(value.replace(/,/g, ''));
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

const extractJsonFromAI = (aiString: string): any => {
  try {
    let cleaned = aiString.trim();
    
    const markdownMatch = cleaned.match(/```json\s*([\s\S]*?)\s*```/);
    if (markdownMatch && markdownMatch[1]) {
      cleaned = markdownMatch[1].trim();
    } else {
      const simpleMarkdownMatch = cleaned.match(/```\s*([\s\S]*?)\s*```/);
      if (simpleMarkdownMatch && simpleMarkdownMatch[1]) {
        cleaned = simpleMarkdownMatch[1].trim();
      }
    }
    
    return JSON.parse(cleaned);
  } catch (error) {
    console.error('❌ Error al parsear JSON de IA:', error);
    throw new Error('No se pudo procesar la respuesta de la IA');
  }
};

// Generar recomendaciones automáticas basadas en datos
const generateRecommendations = (product: any, isTopProduct: boolean): string[] => {
  const recommendations: string[] = [];
  const qty = toNumber(product.qty || product.totalQty || 0);
  const revenue = toNumber(product.revenue || product.totalRevenue || 0);
  
  if (isTopProduct) {
    // Para productos estrella
    recommendations.push('✅ Mantén este producto siempre disponible en stock.');
    recommendations.push('📣 Considera promocionarlo como "Bestseller" para aumentar aún más las ventas.');
    recommendations.push('🎯 Aumenta su visibilidad en la tienda física o digital.');
  } else {
    // Para productos con oportunidades
    recommendations.push('💡 Mejora la descripción del producto y añade mejores imágenes.');
    recommendations.push('🎁 Crea bundles con productos complementarios para aumentar ventas.');
    recommendations.push('📍 Reubica este producto en un lugar más visible de tu tienda.');
    recommendations.push('🏷️ Considera implementar descuentos o promociones 2x1.');
  }
  
  return recommendations;
};

const normalizeTopProduct = (product: any): any => {
  const productName = product.name || product.productName || 'Producto sin nombre';
  const qty = toNumber(product.qty || product.totalQty || 0);
  const revenue = toNumber(product.revenue || product.totalRevenue || 0);

  const normalized: any = {
    productname: productName,
    totalqty: qty,
    totalrevenue: revenue,
  };

  // Usar razones si existen, sino generar automáticamente
  if (product.reasons && Array.isArray(product.reasons) && product.reasons.length > 0) {
    normalized.possible_reasons = product.reasons;
    normalized.reason_1 = product.reasons[0];
    if (product.reasons.length > 1) normalized.reason_2 = product.reasons[1];
  } else {
    const reasons = generateRecommendations(normalized, true);
    normalized.possible_reasons = reasons;
    normalized.reason_1 = reasons[0];
    if (reasons.length > 1) normalized.reason_2 = reasons[1];
  }

  // Comparación si existe
  if (product.comparison) {
    normalized.comparison_with_global_avg = product.comparison;
  }

  return normalized;
};

const normalizeLowProduct = (product: any): any => {
  const productName = product.name || product.productName || 'Producto sin nombre';
  const qty = toNumber(product.qty || product.totalQty || 0);
  const revenue = toNumber(product.revenue || product.totalRevenue || 0);

  const normalized: any = {
    productname: productName,
    totalqty: qty,
    totalrevenue: revenue,
  };

  // Usar acciones si existen, sino generar automáticamente
  if (product.actions && Array.isArray(product.actions) && product.actions.length > 0) {
    normalized.recommended_actions = product.actions;
    normalized.recommended_action_1 = product.actions[0];
    if (product.actions.length > 1) normalized.recommended_action_2 = product.actions[1];
  } else {
    const actions = generateRecommendations(normalized, false);
    normalized.recommended_actions = actions;
    normalized.recommended_action_1 = actions[0];
    if (actions.length > 1) normalized.recommended_action_2 = actions[1];
  }

  // Comparación si existe
  if (product.comparison) {
    normalized.comparison_with_global_avg = product.comparison;
  }

  return normalized;
};

// ==================== FUNCIÓN PRINCIPAL ====================
export const getStoreAnalysis = async (storeId: number): Promise<FullAPIResponse> => {
  const endpoint = `https://lookappapi.onrender.com/analyze/${storeId}/stats`;
  
  try {
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

    const json = await response.json();

    console.log('📦 Respuesta completa del backend:', json);

    if (!json.data || !json.ai) {
      throw new Error('La respuesta del servidor no tiene el formato esperado');
    }

    const parsed = extractJsonFromAI(json.ai);

    if (!parsed || typeof parsed !== 'object') {
      throw new Error('La respuesta de IA no tiene el formato correcto');
    }
    
    if (!parsed.top_products && !parsed.low_products) {
      throw new Error('No hay suficientes datos para generar recomendaciones');
    }

    // Procesar productos top
    let topProducts: any[] = [];
    if (parsed.top_products && Array.isArray(parsed.top_products)) {
      topProducts = parsed.top_products
        .map((p: any) => {
          try {
            return normalizeTopProduct(p);
          } catch (err) {
            console.warn('Error al procesar producto top:', err);
            return null;
          }
        })
        .filter((p: any) => p !== null);
    }

    // Procesar productos low
    let lowProducts: any[] = [];
    if (parsed.low_products && Array.isArray(parsed.low_products)) {
      lowProducts = parsed.low_products
        .map((p: any) => {
          try {
            return normalizeLowProduct(p);
          } catch (err) {
            console.warn('Error al procesar producto low:', err);
            return null;
          }
        })
        .filter((p: any) => p !== null);
    }

    // Procesar executive summary (ya viene en español del backend)
    let executiveSummary = '';
    if (parsed.executive_summary && typeof parsed.executive_summary === 'string') {
      executiveSummary = parsed.executive_summary.trim();
    }

    if (topProducts.length === 0 && lowProducts.length === 0) {
      throw new Error('No se encontraron productos válidos en el análisis');
    }

    return {
      data: json.data,
      ai_parsed: {
        top_products: topProducts,
        low_products: lowProducts,
        executive_summary: executiveSummary,
        recommendations: parsed.recommendations || '',
      },
    };

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

// ==================== FUNCIONES EXPORTADAS ====================
export const fetchAIRecommendations = async (): Promise<AIRecommendation> => {
  try {
    const user = await getStoreProfile();
    
    if (!user?.store?.id) {
      throw new Error('No se pudo obtener la información de tu tienda');
    }
    
    const fullResponse = await getStoreAnalysis(user.store.id);
    return fullResponse.ai_parsed;
  } catch (error: any) {
    throw error;
  }
};

export const fetchRawReportData = async (): Promise<RawData> => {
  try {
    const user = await getStoreProfile();
    
    if (!user?.store?.id) {
      throw new Error('No se pudo obtener la información de tu tienda');
    }
    
    const fullResponse = await getStoreAnalysis(user.store.id);
    
    console.log('🔍 Full Response:', fullResponse);
    console.log('🔍 Data:', fullResponse.data);
    
    // Verificar que la estructura sea correcta
    if (!fullResponse.data) {
      throw new Error('No se recibieron datos del servidor');
    }
    
    // El backend devuelve los datos directamente en json.data
    return fullResponse.data;
  } catch (error: any) {
    console.error('❌ Error en fetchRawReportData:', error);
    throw error;
  }
};

export const fetchFullStoreData = async (): Promise<FullAPIResponse> => {
  try {
    const user = await getStoreProfile();
    
    if (!user?.store?.id) {
      throw new Error('No se pudo obtener la información de tu tienda');
    }
    
    return await getStoreAnalysis(user.store.id);
  } catch (error: any) {
    throw error;
  }
};