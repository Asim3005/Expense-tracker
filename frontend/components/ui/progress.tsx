import * as React from "react";
import { cn } from "@/lib/utils";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  variant?: "default" | "success" | "warning" | "danger";
  size?: "sm" | "md" | "lg";
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, variant = "default", size = "md", ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    const variants = {
      default: "bg-[rgb(var(--primary))]",
      success: "bg-[rgb(var(--success))]",
      warning: "bg-[rgb(var(--warning))]",
      danger: "bg-[rgb(var(--danger))]",
    };

    const sizes = {
      sm: "h-2",
      md: "h-3",
      lg: "h-4",
    };

    return (
      <div
        ref={ref}
        className={cn(
          `relative w-full overflow-hidden rounded-full bg-[rgb(var(--background-muted))] ${sizes[size]}`,
          className
        )}
        {...props}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            variants[variant]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  }
);
Progress.displayName = "Progress";

export { Progress };
