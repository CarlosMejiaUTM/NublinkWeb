// FileName: AdminAI.tsx
// Path: src/pages/admin-panel/AdminAIPage.tsx

import React from 'react';
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";

// --- Iconos Específicos para esta página ---
const ChartBarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M15 1.5a.5.5 0 01.5.5v16a.5.5 0 01-1 0v-16a.5.5 0 01.5-.5zM10 6.5a.5.5 0 01.5.5v11a.5.5 0 01-1 0v-11a.5.5 0 01.5-.5zM5 11.5a.5.5 0 01.5.5v6a.5.5 0 01-1 0v-6a.5.5 0 01.5-.5z" /></svg>;
const MapPinIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.1.4-.22.653-.369.253-.148.534-.32.839-.518.305-.198.636-.42.993-.67s.743-.526 1.128-.828c.386-.303.804-.635 1.228-.996.424-.36.87-.746 1.303-1.158.434-.411.833-.857 1.181-1.33a11.96 11.96 0 00.942-1.635 11.96 11.96 0 00.518-2.02c.09-.5.143-1.01.143-1.531 0-3.86-3.14-7-7-7S3 6.14 3 10c0 .52.054 1.03.144 1.53a11.96 11.96 0 001.46 3.654c.348.474.747.92 1.18 1.331.424.361.86.737 1.304 1.158.385.303.804.635 1.227.996.357.25.707.49 1.127.828.305.198.636.42.993.67.253.149.467.27.653.369a5.741 5.741 0 00.28.14l.018.008.006.003zM10 11.25a1.25 1.25 0 100-2.5 1.25 1.25 0 000 2.5z" clipRule="evenodd" /></svg>;
const ArrowTrendingUpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-green-500"><path d="M10.75 3.065A.75.75 0 0010 2.25a.75.75 0 00-.75.75v3.69l-1.97-1.97a.75.75 0 00-1.06 1.06l3.5 3.5a.75.75 0 001.06 0l3.5-3.5a.75.75 0 10-1.06-1.06l-1.97 1.97V3.065z" /><path d="M3.25 13.03a.75.75 0 00-1.06-1.06l-1.5 1.5a.75.75 0 000 1.06l1.5 1.5a.75.75 0 101.06-1.06L2.81 14.25h14.38a.75.75 0 000-1.5H2.81l.44-.44z" /></svg>;
const ExclamationTriangleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-red-500"><path fillRule="evenodd" d="M8.485 2.495c.646-1.133 2.384-1.133 3.03 0l6.294 11.012c.646 1.133-.19 2.495-1.515 2.495H3.706c-1.325 0-2.161-1.362-1.515-2.495l6.294-11.012zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>;
// --- Fin Iconos ---

// Placeholder para un gráfico de líneas
const LineChartPlaceholder = () => (
    <div className="h-64 bg-secondary rounded-lg flex items-center justify-center border border-line-light">
        <p className="text-text-muted text-sm">[ Gráfico de Líneas: Demanda Estacional ]</p>
    </div>
);

// Placeholder para un mapa de calor
const HeatMapPlaceholder = () => (
     <div className="h-64 bg-secondary rounded-lg flex items-center justify-center border border-line-light">
        <p className="text-text-muted text-sm">[ Mapa de Calor: Precios por Zona en Mérida ]</p>
    </div>
);

// Componente para una Alerta de IA
const AiAlert = ({ icon, text, suggestion }: { icon: React.ReactNode, text: string, suggestion: string }) => (
    <div className="flex items-start gap-3 p-3 hover:bg-secondary rounded-lg">
        <div className="flex-shrink-0 mt-1">{icon}</div>
        <div>
            <p className="font-semibold text-text-main text-sm">{text}</p>
            <p className="text-text-muted text-sm">{suggestion}</p>
        </div>
    </div>
);


const AdminAIPage = () => {
    // Aquí cargarías los datos de la API (GET /admin/ai-global-insights)
    // const [data, setData] = useState(null);
    // const [isLoading, setIsLoading] = useState(true);
    // ...

    return (
        // ¡Ya no se envuelve en el Layout!
        <>
            {/* Layout de Cuadrícula (Grid) para el dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Columna 1 y 2: Gráfico Principal y Alertas */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <Card title="Análisis de Tendencias de Consumo" paddingClass="p-5">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="bg-secondary p-4 rounded-lg">
                                <p className="text-xs text-text-muted font-medium uppercase">Producto más Buscado</p>
                                <p className="text-lg font-bold text-primary">Martillos</p>
                            </div>
                            <div className="bg-secondary p-4 rounded-lg">
                                <p className="text-xs text-text-muted font-medium uppercase">Categoría en Auge</p>
                                <p className="text-lg font-bold text-primary">Plomería</p>
                            </div>
                            <div className="bg-secondary p-4 rounded-lg">
                                <p className="text-xs text-text-muted font-medium uppercase">Demanda Estacional</p>
                                <p className="text-lg font-bold text-text-main">Pinturas (Otoño)</p>
                            </div>
                        </div>
                        <LineChartPlaceholder />
                    </Card>

                    <Card title="Alertas Automáticas de la IA" paddingClass="p-2 sm:p-3">
                         <div className="space-y-2">
                            <AiAlert
                                icon={<ArrowTrendingUpIcon />}
                                text="Demanda creciente en 'Pinturas Impermeabilizantes'"
                                suggestion="Sugerencia: Aumentar visibilidad en la app."
                            />
                            <AiAlert
                                icon={<ExclamationTriangleIcon />}
                                text="Alto índice de cancelaciones en 'Tiendas XYZ'"
                                suggestion="Sugerencia: Revisar perfil de tienda y productos."
                            />
                         </div>
                    </Card>
                </div>

                {/* Columna 3: Mapa de Precios */}
                <div className="lg:col-span-1">
                    <Card title="Comparación de Precios por Zona" paddingClass="p-5">
                        <p className="text-sm text-text-muted mb-4">
                            Análisis de precios promedio de productos clave (ej. cemento) en Mérida.
                        </p>
                        <HeatMapPlaceholder />
                        <div className="flex justify-around mt-4 text-xs">
                            <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-blue-200"></div> Precios Bajos</span>
                            <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-red-200"></div> Precios Altos</span>
                        </div>
                    </Card>
                </div>

            </div>
        </>
    );
};
export default AdminAIPage;