import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary" | "secondary" | "ghost" | "outline" | "danger";
  size?: "xs" | "sm" | "md" | "lg" | "icon";
  loading?: boolean;
  fullWidth?: boolean;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading = false, fullWidth = false, asChild = false, children, disabled, ...props }, ref) => {
    const variants = {
      default: "bg-white border border-[rgb(var(--border))] text-[rgb(var(--foreground-primary))] hover:bg-[rgb(var(--background-muted))] hover:border-[rgb(var(--border-hover))]",
      primary: "bg-[rgb(var(--primary))] text-white hover:bg-[rgb(var(--primary-hover))] active:bg-[rgb(var(--primary-active))] shadow-sm",
      secondary: "bg-[rgb(var(--background-muted))] text-[rgb(var(--foreground-primary))] hover:bg-[rgb(var(--border))]",
      ghost: "hover:bg-[rgb(var(--background-muted))] text-[rgb(var(--foreground-primary))] transition-colors",
      outline: "border border-[rgb(var(--border))] bg-[rgb(var(--background-card))] text-[rgb(var(--foreground-primary))] hover:bg-[rgb(var(--background-muted))] hover:border-[rgb(var(--border-hover))]",
      danger: "bg-[rgb(var(--danger))] text-[rgb(var(--danger-foreground))] hover:bg-[rgb(var(--danger))] hover:opacity-90 shadow-sm",
    };

    const sizes = {
      xs: "h-8 px-3 text-xs",
      sm: "h-9 px-4 text-sm",
      md: "h-10 px-5 text-sm",
      lg: "h-12 px-6 text-base",
      icon: "h-10 w-10 p-0",
    };

    // Handle asChild - when true, render children directly
    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<any>;
      return React.cloneElement(child, {
        onClick: child.props.onClick,
        disabled: child.props.disabled || disabled || loading,
        className: cn(
          "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--ring-offset))] disabled:pointer-events-none disabled:opacity-50 active:scale-95",
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className
        ),
        ...child.props,
        ref: ref,
      });
    }

    return (
      <button
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--ring-offset))] disabled:pointer-events-none disabled:opacity-50 active:scale-95",
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
