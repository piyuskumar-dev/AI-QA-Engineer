import { X, CheckCircle2, AlertCircle, Info } from "lucide-react";

export interface ToastItem {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface ToastProps {
  toasts: ToastItem[];
  onClose: (id: string) => void;
}

export default function Toast({ toasts, onClose }: ToastProps) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4 sm:px-0">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center justify-between gap-3 bg-zinc-950 border border-zinc-900 rounded-md px-3.5 py-2.5 shadow-xl transition-all duration-300 border-l-2 border-l-zinc-300"
        >
          <div className="flex items-center gap-2.5">
            {toast.type === "success" && (
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            )}
            {toast.type === "error" && (
              <AlertCircle className="w-4 h-4 text-red-500" />
            )}
            {toast.type === "info" && (
              <Info className="w-4 h-4 text-zinc-400" />
            )}
            <span className="text-[11px] font-medium text-zinc-200">{toast.message}</span>
          </div>
          <button
            onClick={() => onClose(toast.id)}
            className="text-zinc-600 hover:text-zinc-300 transition-colors p-0.5 rounded hover:bg-zinc-900"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  );
}
