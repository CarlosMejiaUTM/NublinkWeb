// FileName: StoreDashboard.tsx
// Path: src/pages/store-panel/StoreDashboard.tsx

import DashboardLayout from "../../layouts/DashboardLayout";
import { DashboardStats, KeyMetrics } from "../../types";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card"; // Usa el componente Card

// Datos estáticos
const dashboardData: { stats: DashboardStats, metrics: KeyMetrics } = {
  stats: {
    todaySales: { value: 2350, change: 15 },
    monthSales: { value: 15780, change: 8 },
    pendingOrders: { value: 12, change: -5 },
    lowStockItems: { value: 5, change: -2 },
  },
  metrics: {
    salesTrend: {
        percentChange: 12,
        data: [{ label: 'W1', value: 3000 }, { label: 'W2', value: 4200 }, { label: 'W3', value: 3800 }, { label: 'W4', value: 4500 }],
    },
    topScannedProducts: {
        totalScans: 350,
        change: 18,
        products: [
            { id: 'p1', name: 'Product A', percentage: 80 }, { id: 'p2', name: 'Product B', percentage: 60 },
            { id: 'p3', name: 'Product C', percentage: 40 }, { id: 'p4', name: 'Product D', percentage: 30 },
            { id: 'p5', name: 'Product E', percentage: 20 },
        ]
    }
  }
};

// Componente para las tarjetas de estadísticas
const StatCard = ({ title, value, change }: {title: string, value: string, change: number}) => (
    <Card className="shadow-sm"> {/* Usa Card y sombra */}
        <p className="text-sm font-medium text-text-muted mb-1">{title}</p>
        <p className="text-3xl font-bold text-text-main mt-2">{value}</p>
        <p className={`text-sm font-semibold mt-1 ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {change >= 0 ? '+' : ''}{change}%
        </p>
    </Card>
);

// Placeholder para un gráfico de línea
const LineChartPlaceholder = ({ data }: { data: { label: string, value: number }[] }) => (
    <div className="relative h-48 bg-secondary rounded-lg flex items-end justify-center border border-line-light overflow-hidden p-2">
        {/* Simulación de líneas de gráfico y etiquetas */}
        <div className="flex justify-around w-full h-full items-end absolute bottom-0 left-0 px-4 pb-6">
            {data.map((point, index) => (
                <div key={index} className="flex flex-col items-center">
                    <div className="h-24 w-1 bg-primary-light rounded-t-full relative" style={{ height: `${(point.value / 6000) * 100}%` /* Normalizar altura */ }}>
                       <div className="absolute -bottom-4 text-xs text-text-muted">{point.label}</div>
                    </div>
                </div>
            ))}
        </div>
        <p className="absolute top-2 left-2 text-xs text-text-muted">Sales / Week</p>
    </div>
);


const StoreDashboardPage = () => {
  const { stats, metrics } = dashboardData;

  return (
    <DashboardLayout
        pageTitle="Home" // Título como en el mockup
        pageDescription="Here's a snapshot of your stand's performance."
    >
      <div className="flex justify-end items-center mb-6">
        <Button>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Add setup
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard title="Today's Sales" value={`$${stats.todaySales.value.toLocaleString('en-US')}`} change={stats.todaySales.change} />
        <StatCard title="This Month's Sales" value={`$${stats.monthSales.value.toLocaleString('en-US')}`} change={stats.monthSales.change} />
        <StatCard title="Pending Orders" value={stats.pendingOrders.value.toString()} change={stats.pendingOrders.change} />
        <StatCard title="Low Stock Items" value={stats.lowStockItems.value.toString()} change={stats.lowStockItems.change} />
      </div>

      {/* Key Metrics in Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <Card className="lg:col-span-3" title="Sales Trend">
            <p className="font-bold text-3xl text-text-main">+{metrics.salesTrend.percentChange}% from last month</p>
            <p className="text-sm text-text-muted mt-1 mb-4">Last 30 Days <span className="text-green-500">+{metrics.salesTrend.percentChange}%</span></p>
            <LineChartPlaceholder data={metrics.salesTrend.data} />
        </Card>
        <Card className="lg:col-span-2" title="Top Scanned Products">
            <p className="font-bold text-3xl text-text-main">{metrics.topScannedProducts.totalScans} scans</p>
            <p className="text-sm text-text-muted mt-1 mb-4">This month <span className="text-green-500">+{metrics.topScannedProducts.change}%</span></p>
            <div className="space-y-3 mt-4">
                {metrics.topScannedProducts.products.map(p => (
                    <div key={p.id} className="flex items-center gap-2">
                        <p className="w-20 text-sm text-text-muted flex-shrink-0">{p.name}</p>
                        <div className="h-3 flex-1 bg-secondary rounded-full border border-line-light overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${p.percentage}%` }}></div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
      </div>

      <div className="text-center mt-8">
        <Button variant="secondary">View AI Recommendations</Button>
      </div>
    </DashboardLayout>
  );
};

export default StoreDashboardPage;