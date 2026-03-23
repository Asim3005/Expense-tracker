"use client";

import * as React from "react";
import { X, Check, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "danger" | "warning" | "info";
  onClose?: () => void;
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, variant = "default", children, onClose, ...props }, ref) => {
    const variants = {
      default: "bg-[rgb(var(--background-card))] border-[rgb(var(--border))] text-[rgb(var(--foreground-primary))]",
      success: "bg-[rgb(var(--success))] text-[rgb(var(--success-foreground))] border-transparent",
      danger: "bg-[rgb(var(--danger))] text-[rgb(var(--danger-foreground))] border-transparent",
      warning: "bg-[rgb(var(--warning))] text-[rgb(var(--warning-foreground))] border-transparent",
      info: "bg-[rgb(var(--info))] text-[rgb(var(--info-foreground))] border-transparent",
    };

    const icons = {
      default: Info,
      success: Check,
      danger: AlertCircle,
      warning: AlertTriangle,
      info: Info,
    };

    const Icon = variants[variant] ? icons[variant] : icons.default;

    return (
      <div
        ref={ref}
        className={cn(
          "fixed top-4 right-4 z-50 flex w-full max-w-sm items-start gap-3 rounded-2xl border p-4 shadow-lg animate-slide-in",
          variants[variant],
          className
        )}
        {...props}
      >
        {variant !== "default" && (
          <div className="flex h-5 w-5 shrink-0 items-center justify-center">
            <Icon className="h-5 w-5" />
          </div>
        )}
        <div className="flex-1">{children}</div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto flex shrink-0 items-center justify-center rounded-lg p-1 text-current opacity-70 transition-opacity hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }
);
Toast.displayName = "Toast";

export { Toast };
