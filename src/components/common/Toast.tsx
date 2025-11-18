// File: src/components/common/Toast.tsx
import React from "react";
import clsx from "clsx";

type ToastItem = {
  id: string;
  message: string;
  type?: "success" | "error" | "info";
};

export const ToastsContainer: React.FC<{ toasts: ToastItem[] }> = ({ toasts }) => {
  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col gap-2">
      {toasts.map(t => (
        <div key={t.id} className={clsx("px-4 py-2 rounded-lg shadow-md text-sm", t.type === "success" ? "bg-green-600 text-white" : t.type === "error" ? "bg-red-600 text-white" : "bg-gray-800 text-white")}>
          {t.message}
        </div>
      ))}
    </div>
  );
};
export default ToastsContainer;
