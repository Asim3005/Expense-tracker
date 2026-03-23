import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-all duration-200",
  {
    variants: {
      variant: {
        default: "border-[rgb(var(--border))] bg-[rgb(var(--background-muted))] text-[rgb(var(--foreground-primary))]",
        success: "border-[rgb(var(--success-border))] bg-[rgb(var(--success-bg))] text-[rgb(var(--success))]",
        danger: "border-[rgb(var(--danger-border))] bg-[rgb(var(--danger-bg))] text-[rgb(var(--danger))]",
        warning: "border-[rgb(var(--warning-border))] bg-[rgb(var(--warning-bg))] text-[rgb(var(--warning))]",
        info: "border-[rgb(var(--info-border))] bg-[rgb(var(--info-bg))] text-[rgb(var(--info))]",
        primary: "border-[rgb(var(--primary))] bg-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))]",
        outline: "text-[rgb(var(--foreground-secondary))]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
