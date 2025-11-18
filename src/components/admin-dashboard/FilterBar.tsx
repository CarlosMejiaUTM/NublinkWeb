// FileName: FilterBar.tsx
// Path: src/components/admin-dashboard/FilterBar.tsx

import React from "react";

interface FilterBarProps {
  filters: { zone: string; status: string; startDate: string; endDate: string };
  setFilters: React.Dispatch<React.SetStateAction<any>>;
}

export const FilterBar: React.FC<FilterBarProps> = ({ filters, setFilters }) => {
  return (
    <div className="flex flex-wrap gap-4 bg-white p-4 rounded-lg shadow-md border border-line-light items-end">
      <div className="flex flex-col">
        <label className="text-sm text-gray-600 mb-1">Zona</label>
        <input
          type="text"
          placeholder="Ej. CDMX, Puebla..."
          value={filters.zone}
          onChange={(e) => setFilters((prev: any) => ({ ...prev, zone: e.target.value }))}
          className="border rounded-md p-2 focus:ring-2 focus:ring-primary focus:outline-none"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-gray-600 mb-1">Estado de tienda</label>
        <select
          value={filters.status}
          onChange={(e) => setFilters((prev: any) => ({ ...prev, status: e.target.value }))}
          className="border rounded-md p-2 focus:ring-2 focus:ring-primary focus:outline-none"
        >
          <option value="all">Todas</option>
          <option value="active">Activa</option>
          <option value="approved">Aprobada</option>
          <option value="pending">Pendiente</option>
          <option value="rejected">Rechazada</option>
        </select>
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-gray-600 mb-1">Desde</label>
        <input
          type="date"
          value={filters.startDate}
          onChange={(e) => setFilters((prev: any) => ({ ...prev, startDate: e.target.value }))}
          className="border rounded-md p-2 focus:ring-2 focus:ring-primary focus:outline-none"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-gray-600 mb-1">Hasta</label>
        <input
          type="date"
          value={filters.endDate}
          onChange={(e) => setFilters((prev: any) => ({ ...prev, endDate: e.target.value }))}
          className="border rounded-md p-2 focus:ring-2 focus:ring-primary focus:outline-none"
        />
      </div>

      <div className="ml-auto">
        <button
          onClick={() => setFilters({ zone: "all", status: "all", startDate: "", endDate: "" })}
          className="px-4 py-2 rounded-md border border-line-light bg-white hover:bg-secondary transition"
        >
          Reset
        </button>
      </div>
    </div>
  );
};
