// File: src/services/api/ai.ts

import { getStoreProfile } from './store';

export interface AIRecommendation {
  top_products: {
    productname: string;
    totalqty: number;
    totalrevenue: number;
    reason_1: string;
    reason_2: string;
  }[];
  low_products: {
    productname: string;
    totalqty: number;
    totalrevenue: number;
    action_1: string;
    action_2: string;
  }[];
  executive_summary: {
    title: string;
    summary: string;
  }[];
}

export const getStoreAnalysis = async (storeId: number): Promise<AIRecommendation> => {
  const endpoint = `https://lookappapi.onrender.com/analyze/${storeId}/stats`;
  const res = await fetch(endpoint);

  if (!res.ok) throw new Error(`Error al obtener análisis: HTTP ${res.status}`);
  const json = await res.json();

  if (!json.ai) throw new Error("La respuesta no contiene el campo 'ai'");

  const match = json.ai.match(/```json\s*([\s\S]*?)\s*```/);
  if (!match) throw new Error('No se pudo extraer el JSON del análisis');

  const parsed = JSON.parse(match[1]);

  return {
    top_products: (parsed.top_products || []).map((p: any) => ({
      productname: p.name,
      totalqty: p.quantity_sold,
      totalrevenue: p.revenue,
      reason_1: p.reason_1,
      reason_2: p.reason_2,
    })),
    low_products: (parsed.low_products || []).map((p: any) => ({
      productname: p.name,
      totalqty: p.quantity_sold,
      totalrevenue: p.revenue,
      action_1: p.action_1,
      action_2: p.action_2,
    })),
    executive_summary: parsed.executive_summary || [],
  };
};

export const fetchAIRecommendations = async (): Promise<AIRecommendation> => {
  const user = await getStoreProfile();
  if (!user.store?.id) throw new Error('No se pudo obtener el ID de la tienda.');
  return await getStoreAnalysis(user.store.id);
};
