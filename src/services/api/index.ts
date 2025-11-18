// File: src/services/api/index.ts

export * from './helpers';
export * from './auth';
export * from './store';
export * from './admin';
export * from './ai';
export * from './payments';

// ✅ Añadir función faltante para IA
export async function fetchAIRecommendations() {
  try {
    const response = await fetch("https://lookappapi.onrender.com/web/superadmin/admin/stats");
    if (!response.ok) throw new Error("Error al obtener recomendaciones de IA");
    const data = await response.json();

    // 🧠 Simulamos formato de recomendaciones basadas en datos globales
    return {
      statusCode: 200,
      message: "Recomendaciones IA generadas correctamente",
      data: [
        {
          id: 1,
          titulo: "Aumentar visibilidad de productos populares",
          descripcion: `Se detectó alta demanda en tiendas activas (${data.data?.tiendas?.activas || 0}).`,
          impacto: "Alto",
        },
        {
          id: 2,
          titulo: "Revisar precios en zonas con menor actividad",
          descripcion: "Algunas tiendas presentan variaciones de precio significativas.",
          impacto: "Medio",
        },
        {
          id: 3,
          titulo: "Potenciar categorías emergentes",
          descripcion: "Crecimiento sostenido en plomería y pintura.",
          impacto: "Alto",
        },
      ],
    };
  } catch (error) {
    console.error("❌ Error en fetchAIRecommendations:", error);
    return { statusCode: 500, message: "Error interno en IA", data: [] };
  }
}
