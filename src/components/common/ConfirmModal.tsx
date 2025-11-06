// FileName: ConfirmModal.tsx
// Path: src/components/common/ConfirmModal.tsx

import React, { useEffect, useState } from "react";
import { CheckCircleIcon, ExclamationTriangleIcon, XMarkIcon } from "@heroicons/react/24/solid";

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "confirm" | "success" | "error" | "loading";
  onConfirm?: () => void;
  onCancel?: () => void;
  state: "confirm" | "success"; // ✅ Maneja estados principales
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title = "Confirmar acción",
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  type,
  onConfirm,
  onCancel,
  state,
}) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // 🔹 Pequeño delay para activar la animación de entrada
      const t = setTimeout(() => setShow(true), 10);
      return () => clearTimeout(t);
    } else {
      setShow(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // ✅ Si no se pasa un "type" manualmente, lo definimos según el estado
  const effectiveType = type || (state === "success" ? "success" : "confirm");

  const LoadingSpinner = () => (
    <div className="flex justify-center">
      <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-primary"></div>
    </div>
  );

  const iconMap = {
    confirm: <ExclamationTriangleIcon className="w-20 h-20 text-yellow-500" />,
    success: <CheckCircleIcon className="w-20 h-20 text-green-500" />,
    error: <ExclamationTriangleIcon className="w-20 h-20 text-red-500" />,
    loading: <LoadingSpinner />,
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
        show ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 relative transform transition-all duration-300 ${
          show ? "scale-100 translate-y-0 opacity-100" : "scale-90 translate-y-4 opacity-0"
        }`}
      >
        {/* Botón de cierre - solo en modo confirm */}
        {effectiveType === "confirm" && (
          <button
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
            onClick={onCancel}
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        )}

        {/* Ícono principal */}
        <div className="flex justify-center mb-4">{iconMap[effectiveType]}</div>

        {/* Título */}
        <h3 className="text-lg font-semibold text-center text-text-main mb-2">
          {title}
        </h3>

        {/* Mensaje */}
        <p className="text-sm text-center text-text-muted mb-4">{message}</p>

        {/* Spinner de carga - solo en modo loading */}
        {effectiveType === "loading" && (
          <div className="flex justify-center my-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Botones - solo en modo confirm */}
        {effectiveType === "confirm" && (
          <div className="flex justify-center gap-3 mt-4">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark transition"
            >
              {confirmText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfirmModal;
