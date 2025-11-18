// File: src/hooks/useToast.ts
import { useCallback, useState } from "react";
import { v4 as uuidv4 } from "uuid";

type Toast = { id: string; message: string; type?: "success" | "error" | "info" };

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((message: string, type: Toast["type"] = "info", timeout = 3500) => {
    const id = uuidv4();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), timeout);
  }, []);

  const clear = useCallback(() => setToasts([]), []);
  return { toasts, push, clear };
}
