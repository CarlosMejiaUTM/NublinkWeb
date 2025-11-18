// File: src/components/admin-dashboard/RecentActivity.tsx
import React from "react";
import Card from "../common/Card";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { UserIcon, BuildingStorefrontIcon, CreditCardIcon } from "@heroicons/react/24/outline";

interface ActivityItem {
  id: string;
  type: "user" | "store" | "subscription";
  name: string;
  description: string;
  date: string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  const iconMap = {
    user: <UserIcon className="w-5 h-5 text-blue-500" />,
    store: <BuildingStorefrontIcon className="w-5 h-5 text-green-500" />,
    subscription: <CreditCardIcon className="w-5 h-5 text-purple-500" />,
  };

  return (
    <Card title="Actividad reciente">
      <div className="space-y-3">
        {activities.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">No hay actividad reciente</p>
        ) : (
          activities.map((a) => (
            <div key={a.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md">
              <div className="flex items-center gap-3">
                {iconMap[a.type]}
                <div>
                  <p className="font-medium text-text-main">{a.name}</p>
                  <p className="text-xs text-gray-500">{a.description}</p>
                </div>
              </div>
              <p className="text-xs text-gray-400">
                {a.date ? format(new Date(a.date), "dd MMM, HH:mm", { locale: es }) : "N/D"}
              </p>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
