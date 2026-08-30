"use client";

import { useState, useEffect, useCallback } from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

type ToastKind = "success" | "error" | "info";

interface ToastItem {
  id: number;
  kind: ToastKind;
  message: string;
}

/**
 * Yengil global toast tizimi (bog'liqliksiz).
 * Istalgan joydan chaqirish: `import { toast } from "@/components/Toaster"`
 *   toast.success("Saqlandi"); toast.error("Xatolik"); toast.info("...");
 * `<Toaster />` layout'ga bir marta mount qilinadi.
 */
type Listener = (_item: Omit<ToastItem, "id">) => void;
let listener: Listener | null = null;

function emit(kind: ToastKind, message: string) {
  if (listener) listener({ kind, message });
}

export const toast = {
  success: (m: string) => emit("success", m),
  error: (m: string) => emit("error", m),
  info: (m: string) => emit("info", m),
};

const ICONS: Record<ToastKind, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

const ACCENT: Record<ToastKind, string> = {
  success: "text-emerald-500",
  error: "text-red-500",
  info: "text-brand",
};

let nextId = 1;

export default function Toaster() {
  const [items, setItems] = useState<ToastItem[]>([]);

  const remove = useCallback((id: number) => {
    setItems((list) => list.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    listener = ({ kind, message }) => {
      const id = nextId++;
      setItems((list) => [...list.slice(-3), { id, kind, message }]);
      // 4 soniyadan keyin avtomatik yopiladi
      setTimeout(() => remove(id), 4000);
    };
    return () => {
      listener = null;
    };
  }, [remove]);

  if (items.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-6 left-1/2 z-[100] flex w-full max-w-sm -translate-x-1/2 flex-col gap-2 px-4"
    >
      {items.map((t) => {
        const Icon = ICONS[t.kind];
        return (
          <div
            key={t.id}
            role="status"
            className="animate-fade-in-up flex items-center gap-3 rounded-xl border border-line bg-surface-overlay/95 px-4 py-3 text-sm text-fg shadow-overlay backdrop-blur-md"
          >
            <Icon className={`h-4 w-4 shrink-0 ${ACCENT[t.kind]}`} />
            <span className="flex-1">{t.message}</span>
            <button
              onClick={() => remove(t.id)}
              aria-label="Yopish"
              className="shrink-0 rounded-md p-1 text-zinc-500 transition-colors hover:bg-ink/10 hover:text-fg"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
