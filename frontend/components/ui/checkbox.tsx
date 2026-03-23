"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  error?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, error, onCheckedChange, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onCheckedChange?.(e.target.checked);
      onChange?.(e);
    };

    return (
      <input
        type="checkbox"
        ref={ref}
        onChange={handleChange}
        className={cn(
          "peer h-4 w-4 shrink-0 appearance-none rounded border border-[rgb(var(--border))] bg-[rgb(var(--background-card))] ring-offset-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--ring-offset))] disabled:cursor-not-allowed disabled:opacity-50",
          error ? "border-[rgb(var(--danger))] focus-visible:ring-[rgb(var(--danger))]" : "",
          "checked:bg-[rgb(var(--primary))] checked:border-[rgb(var(--primary))]",
          "checked:[background-image:url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2016%2016%22%3E%3Cpath%20fill%3D%22white%22%20d%3D%22M13.48%204.48L6%2011.96l-3.48-3.48l-1.27%201.27l4.75%204.75l9.75-9.75z%22%2F%3E%3C%2Fsvg%3E')]",
          "hover:border-[rgb(var(--border-hover))]",
          "active:scale-95",
          className
        )}
        {...props}
      />
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
