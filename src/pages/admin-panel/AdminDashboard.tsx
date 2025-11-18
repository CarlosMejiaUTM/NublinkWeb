// File: src/pages/admin-panel/AdminDashboard.tsx

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion"; // ✅ Import necesario para animaciones suaves
import {
  getAdminDashboardData,
  getAdminApprovedStores,
  getAdminRecentActivity,
} from "../../services/api/admin";
import type { AdminDashboardSummary, Store } from "../../types";

import Card from "../../components/common/Card";
import { FilterBar } from "../../components/admin-dashboard/FilterBar";
import { MapSection } from "../../components/admin-dashboard/MapSection";
import { TopStores } from "../../components/admin-dashboard/TopStores";
import { StatsCharts } from "../../components/admin-dashboard/StatsCharts";
import { RecentActivity } from "../../components/admin-dashboard/RecentActivity";

import {
  UsersIcon,
  BuildingStorefrontIcon,
  ClockIcon,
  CreditCardIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-96">
    <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-primary"></div>
  </div>
);

const ErrorMessage = ({ message }: { message: string }) => (
  <Card className="bg-red-50 border-red-200">
    <div className="flex items-center gap-3">
      <ExclamationTriangleIcon className="w-8 h-8 text-red-500" />
      <div>
        <p className="font-semibold text-red-700">Error al cargar datos</p>
        <p className="text-sm text-red-600 mt-1">{message}</p>
      </div>
    </div>
  </Card>
);

const StatCard = ({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
}) => (
  <motion.div
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.98 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <Card className="shadow-md hover:-translate-y-1 hover:shadow-lg transition-all duration-200">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary-light rounded-full">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium text-text-muted">{title}</p>
          <p className="text-3xl font-bold text-text-main">{value}</p>
        </div>
      </div>
    </Card>
  </motion.div>
);

const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<AdminDashboardSummary | null>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activityLoading, setActivityLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({ zone: "all", startDate: "", endDate: "" });

  // 🔄 Cargar toda la data del dashboard
  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const [statsRes, storesRes, activityRes] = await Promise.all([
        getAdminDashboardData(),
        getAdminApprovedStores(),
        getAdminRecentActivity(),
      ]);

      setStats(statsRes);
      setStores(storesRes);
      setActivities(activityRes);

      console.log("🟢 Dashboard cargado:", { statsRes, storesRes, activityRes });
    } catch (err) {
      console.error("❌ Error cargando dashboard:", err);
      setError("No se pudieron cargar los datos del dashboard.");
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Recargar solo actividad reciente
  const reloadActivity = async () => {
    try {
      setActivityLoading(true);
      const activityRes = await getAdminRecentActivity();
      setActivities(activityRes);
      console.log("🟢 Actividad actualizada:", activityRes);
    } catch (err) {
      console.error("❌ Error recargando actividad:", err);
    } finally {
      setActivityLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!stats) return <p>No hay datos disponibles.</p>;

  const filteredStores =
    filters.zone === "all"
      ? stores
      : stores.filter((s) => s.address?.toLowerCase().includes(filters.zone.toLowerCase()));

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* 📊 Tarjetas de métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Usuarios Totales" value={stats.usuarios.total} icon={UsersIcon} />
        <StatCard title="Tiendas Activas" value={stats.tiendas.activas} icon={BuildingStorefrontIcon} />
        <StatCard title="Tiendas Pendientes" value={stats.tiendas.pendientes} icon={ClockIcon} />
        <StatCard
          title="Suscripciones Activas"
          value={stats.stripe.suscripciones_activas}
          icon={CreditCardIcon}
        />
      </div>

      {/* 📈 Gráficas de métricas */}
      <StatsCharts stats={stats} />

      {/* 🔍 Filtros de visualización */}
      <FilterBar filters={filters} setFilters={setFilters} />

      {/* 🗺️ Sección mapa + ranking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MapSection stores={filteredStores} />
        <TopStores stores={filteredStores} />
      </div>

      {/* 🧾 Actividad reciente */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-text-main">Actividad Reciente</h2>
        <button
          onClick={reloadActivity}
          disabled={activityLoading}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            activityLoading
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-primary text-white hover:bg-primary-dark"
          }`}
        >
          <ArrowPathIcon
            className={`w-5 h-5 ${activityLoading ? "animate-spin" : ""}`}
          />
          {activityLoading ? "Actualizando..." : "Actualizar"}
        </button>
      </div>

      <RecentActivity activities={activities} />
    </motion.div>
  );
};

export default AdminDashboardPage;
