"use client";

import * as React from "react";
import { Check, AlertCircle, AlertTriangle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastVariant = "success" | "danger" | "warning" | "default" | "info";

interface Toast {
  id: string;
  message: string;
  variant?: ToastVariant;
  duration?: number;
}

const ToasterContext = React.createContext<{
  toast: (message: string, variant?: ToastVariant, duration?: number) => void;
}>({
  toast: () => null,
});

export function ToasterProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const toast = React.useCallback(
    (message: string, variant: ToastVariant = "default", duration = 3000) => {
      const id = Math.random().toString(36).substring(7);
      setToasts((prev) => [...prev, { id, message, variant, duration }]);

      // Auto dismiss after duration
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    },
    []
  );

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToasterContext.Provider value={{ toast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToasterContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToasterContext);
  if (!context) {
    throw new Error("useToast must be used within a ToasterProvider");
  }
  return context.toast;
}

function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: string) => void }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <ToastComponent key={toast.id} {...toast} onRemove={onRemove} />
      ))}
    </div>
  );
}

function ToastComponent({ message, variant = "default", onRemove }: Toast & { onRemove: (id: string) => void }) {
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    // Exit animation after a short delay
    const exitTimer = setTimeout(() => {
      setIsVisible(false);
    }, 2800);
    return () => clearTimeout(exitTimer);
  }, []);

  const icons = {
    success: Check,
    danger: AlertCircle,
    warning: AlertTriangle,
    default: Info,
    info: Info,
  };

  const Icon = icons[variant];

  const variants = {
    success: "bg-[rgb(var(--success))] text-[rgb(var(--success-foreground))] border-[rgb(var(--success-border))]",
    danger: "bg-[rgb(var(--danger))] text-[rgb(var(--danger-foreground))] border-[rgb(var(--danger-border))]",
    warning: "bg-[rgb(var(--warning))] text-[rgb(var(--warning-foreground))] border-[rgb(var(--warning-border))]",
    default: "bg-[rgb(var(--background-card))] text-[rgb(var(--foreground-primary))] border-[rgb(var(--border))]",
    info: "bg-[rgb(var(--info))] text-[rgb(var(--info-foreground))] border-[rgb(var(--info-border))]",
  };

  return (
    <div
      className={cn(
        "pointer-events-auto flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-lg",
        isVisible ? "animate-slide-in" : "animate-slide-out",
        variants[variant]
      )}
    >
      <div className="flex h-5 w-5 shrink-0 items-center justify-center">
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-sm font-medium">{message}</p>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(() => onRemove && onRemove(message), 200);
        }}
        className="ml-auto flex shrink-0 items-center justify-center rounded-lg p-1 text-current opacity-70 transition-opacity hover:opacity-100"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

// Simple Toaster component for root layout
export function Toaster() {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none" />
  );
}
