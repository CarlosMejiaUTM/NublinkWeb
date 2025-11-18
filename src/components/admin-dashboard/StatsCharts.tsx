// File: src/components/admin-dashboard/StatsCharts.tsx
import React from "react";
import Card from "../common/Card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface StatsChartsProps {
  stats: any;
}

export const StatsCharts: React.FC<StatsChartsProps> = ({ stats }) => {
  const chartData = [
    { name: "Usuarios", valor: stats.usuarios.total },
    { name: "Tiendas", valor: stats.tiendas.total },
    { name: "Activas", valor: stats.tiendas.activas },
    { name: "Pendientes", valor: stats.tiendas.pendientes },
    { name: "Suscripciones", valor: stats.stripe.suscripciones_activas },
  ];

  return (
    <Card title="Resumen general">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="valor" fill="#3b82f6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
