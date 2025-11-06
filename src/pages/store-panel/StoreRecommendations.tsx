// FileName: StoreRecommendations.tsx
// Path: src/pages/store-panel/StoreRecommendations.tsx

import React, { useState } from 'react';
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import { Link } from 'react-router-dom';

// --- ¡NUEVO! Iconos Profesionales ---
import { 
    ArrowTrendingUpIcon, 
    ArrowTrendingDownIcon,
    TagIcon,
    ChartBarIcon
} from '@heroicons/react/20/solid';

// --- ¡NUEVO! Tipo de Recomendación ---
interface Recommendation {
    id: number;
    type: 'price_up' | 'price_down' | 'promotion';
    title: string;
    productName: string;
    reason: string;
}

// --- ¡NUEVO! Datos Simulados ---
const mockRecommendations: Recommendation[] = [
    { 
        id: 1, 
        type: 'price_up', 
        title: 'Sugerencia de Precio: Subir 5%', 
        productName: 'Martillos de Uña 16oz',
        reason: 'Alta demanda detectada y precio 10% por debajo de la competencia local.'
    },
    { 
        id: 2, 
        type: 'price_down', 
        title: 'Sugerencia de Precio: Bajar 3%', 
        productName: 'Taladros Inalámbricos 20V',
        reason: 'Demanda media y precio 5% por encima de la competencia local.'
    },
    { 
        id: 3, 
        type: 'promotion', 
        title: 'Sugerencia de Promoción', 
        productName: 'Juego de Desarmadores',
        reason: 'Producto con baja rotación (0 ventas en los últimos 30 días).'
    },
];

// --- ¡NUEVO! Gráfico Simulado ---
const LineChartPlaceholder = () => (
    <div className="relative h-40 bg-secondary rounded-lg flex items-end justify-around p-4 border border-line-light overflow-hidden">
        <div className="flex justify-around w-full h-full items-end absolute bottom-0 left-0 px-4 pb-4 gap-2">
            <div className="w-1/4 bg-primary-light hover:bg-primary/50 rounded-t-md transition-all" style={{ height: '40%' }}></div>
            <div className="w-1/4 bg-primary-light hover:bg-primary/50 rounded-t-md transition-all" style={{ height: '60%' }}></div>
            <div className="w-1/4 bg-primary-light hover:bg-primary/50 rounded-t-md transition-all" style={{ height: '80%' }}></div>
            <div className="w-1/4 bg-primary-light hover:bg-primary/50 rounded-t-md transition-all" style={{ height: '50%' }}></div>
        </div>
        <p className="absolute top-2 left-2 text-xs text-text-muted">Ventas esperadas</p>
    </div>
);

// --- ¡NUEVO! Componente de Tarjeta de Recomendación ---
const RecommendationCard = ({ rec, onApply }: { rec: Recommendation, onApply: (id: number) => void }) => {
    
    let icon, iconBg, buttonText, buttonVariant;

    switch (rec.type) {
        case 'price_up':
            icon = <ArrowTrendingUpIcon className="w-5 h-5 text-green-700" />;
            iconBg = 'bg-green-100';
            buttonText = 'Aplicar Aumento';
            buttonVariant = 'secondary';
            break;
        case 'price_down':
            icon = <ArrowTrendingDownIcon className="w-5 h-5 text-red-700" />;
            iconBg = 'bg-red-100';
            buttonText = 'Aplicar Descuento';
            buttonVariant = 'secondary';
            break;
        case 'promotion':
            icon = <TagIcon className="w-5 h-5 text-blue-700" />;
            iconBg = 'bg-blue-100';
            buttonText = 'Crear Promoción';
            buttonVariant = 'primary';
            break;
    }

    return (
        <Card className="shadow-lg transform transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 p-3 rounded-full ${iconBg}`}>
                    {icon}
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold text-text-main">{rec.title}</h3>
                    <p className="text-sm font-medium text-primary">{rec.productName}</p>
                    <p className="text-sm text-text-muted mt-1">{rec.reason}</p>
                    <div className="mt-4">
                        <Button 
                            size="sm" 
                            variant={buttonVariant as 'primary' | 'secondary'}
                            onClick={() => onApply(rec.id)} // ¡Acción "wow"!
                        >
                            {buttonText}
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
};


const StoreRecommendationsPage = () => {
    // --- ¡NUEVO! Estado para manejar la lista de recomendaciones ---
    const [recommendations, setRecommendations] = useState(mockRecommendations);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Simulación de carga de API
    useEffect(() => {
        setIsLoading(true);
        setError(null);
        // Aquí llamarías a: GET /web/stores/mine/recommendations
        setTimeout(() => {
            setRecommendations(mockRecommendations);
            setIsLoading(false);
        }, 1000); // Simula 1 segundo de carga
    }, []);

    // --- ¡NUEVO! Función para la interacción "wow" ---
    const handleApplyRecommendation = (id: number) => {
        // Simula que se "aplica" la recomendación quitándola de la lista
        setRecommendations(prevRecs => prevRecs.filter(rec => rec.id !== id));
        
        // (En un futuro, si el botón es "Crear Promoción", haríamos:)
        // navigate('/tienda/promociones/nueva?producto_id=...&tipo=...');
    };

    // --- Lógica de Renderizado ---
    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex justify-center items-center h-48">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            );
        }
        
        if (error) {
            return <p className="text-center text-red-500">{error}</p>;
        }
        
        if (recommendations.length === 0) {
            return (
                 <Card className="text-center p-12 bg-green-50 border-green-200">
                    <CheckCircleIcon className="w-12 h-12 text-green-600 mx-auto" />
                    <h3 className="font-semibold text-lg text-green-800 mt-4">¡Todo Optimizado!</h3>
                    <p className="text-sm text-green-700 mt-1">No hay nuevas recomendaciones por ahora. ¡Buen trabajo!</p>
                </Card>
            );
        }

        return (
            <div className="space-y-5">
                {recommendations.map(rec => (
                    <RecommendationCard 
                        key={rec.id} 
                        rec={rec} 
                        onApply={handleApplyRecommendation} 
                    />
                ))}
            </div>
        );
    };

    return (
        // ¡Ya no se envuelve en el Layout!
        <>
            {/* Layout de 2 columnas */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Columna Izquierda: Feed de Recomendaciones */}
                <div className="lg:col-span-2">
                    <h2 className="text-xl font-bold text-text-main mb-4">Bandeja de Entrada de IA</h2>
                    {renderContent()}
                </div>

                {/* Columna Derecha: Gráficos de Soporte */}
                <div className="lg:col-span-1 space-y-6">
                    <Card title="Predicción de Demanda (Simulado)">
                        <p className="text-text-muted text-sm mb-4">Ventas esperadas para la próxima semana (basado en tendencias).</p>
                        <LineChartPlaceholder />
                    </Card>
                    <Card title="Productos con Baja Rotación">
                        <p className="text-text-muted text-sm mb-4">Estos productos no se han vendido en los últimos 30 días.</p>
                        <ul className="space-y-2 text-sm">
                            <li className="flex justify-between"><span>Juego de Desarmadores</span> <span className="font-semibold text-red-600">0 ventas</span></li>
                            <li className="flex justify-between"><span>Clavos (Caja 1kg)</span> <span className="font-semibold text-red-600">0 ventas</span></li>
                        </ul>
                        <Button 
                            variant="secondary" 
                            size="sm" 
                            className="w-full mt-4"
                            // Este botón te llevaría a la página de Promociones
                        >
                            <TagIcon className="w-4 h-4" />
                            Crear Promoción
                        </Button>
                    </Card>
                </div>

            </div>
        </>
    );
};
export default StoreRecommendationsPage;