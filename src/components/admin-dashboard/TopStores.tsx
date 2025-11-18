// FileName: TopStores.tsx
// Path: src/components/admin-dashboard/TopStores.tsx

import React from "react";
import type { Store } from "../../types";
import Card from "../common/Card";

interface TopStoresProps {
  stores: Store[];
}

/**
 * Componente: TopStores
 * Muestra las tiendas destacadas ordenadas por número de productos (o cualquier métrica real del backend)
 */
export const TopStores: React.FC<TopStoresProps> = ({ stores }) => {
  // Ordena por cantidad de productos (propiedad real del backend)
  const sorted = [...stores]
    .sort((a, b) => (b.total_products || 0) - (a.total_products || 0))
    .slice(0, 5); // Solo las 5 primeras

  return (
    <Card title="Tiendas destacadas (por ventas)">
      <div className="space-y-3">
        {sorted.length > 0 ? (
          sorted.map((s, i) => (
            <div
              key={s.id}
              className="flex justify-between items-center p-2 hover:bg-secondary rounded-md transition-all"
            >
              <div>
                <p className="font-semibold text-text-main">
                  #{i + 1} {s.business_name}
                </p>
                <p className="text-xs text-text-muted">{s.owner_name}</p>
              </div>
              <span className="text-sm font-bold text-primary">
                {s.total_products
                  ? `${s.total_products.toLocaleString("es-MX")} productos`
                  : "N/D"}
              </span>
            </div>
          ))
        ) : (
          <p className="text-sm text-text-muted text-center py-6">
            Sin datos disponibles
          </p>
        )}
      </div>
    </Card>
  );
};
