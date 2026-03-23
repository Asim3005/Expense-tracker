import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--background-card))] px-4 text-sm text-[rgb(var(--foreground-primary))] ring-offset-2 placeholder:text-[rgb(var(--foreground-muted))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--ring-offset))] disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
          error && "border-[rgb(var(--danger))] focus-visible:ring-[rgb(var(--danger))]",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
