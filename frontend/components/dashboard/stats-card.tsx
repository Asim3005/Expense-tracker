"use client";

import * as React from "react";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    label?: string;
  };
  className?: string;
  variant?: "default" | "success" | "danger" | "warning";
}

export function StatsCard({ title, value, icon: Icon, trend, className, variant = "default" }: StatsCardProps) {
  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend.value > 0) return TrendingUp;
    if (trend.value < 0) return TrendingDown;
    return Minus;
  };

  const getTrendColor = () => {
    if (!trend) return "";
    if (trend.value > 0) return "text-[rgb(var(--success))]";
    if (trend.value < 0) return "text-[rgb(var(--danger))]";
    return "text-[rgb(var(--foreground-muted))]";
  };

  const TrendIcon = getTrendIcon();

  const variants = {
    default: "bg-[rgb(var(--background-card))] border-[rgb(var(--border))]",
    success: "bg-[rgb(var(--success-bg))] border-[rgb(var(--success-border))]",
    danger: "bg-[rgb(var(--danger-bg))] border-[rgb(var(--danger-border))]",
    warning: "bg-[rgb(var(--warning-bg))] border-[rgb(var(--warning-border))]",
  };

  const iconVariants = {
    default: "bg-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))]",
    success: "bg-[rgb(var(--success))] text-[rgb(var(--success-foreground))]",
    danger: "bg-[rgb(var(--danger))] text-[rgb(var(--danger-foreground))]",
    warning: "bg-[rgb(var(--warning))] text-[rgb(var(--warning-foreground))]",
  };

  return (
    <div
      className={cn(
        "rounded-2xl border p-6 transition-all duration-200 hover:shadow-md hover-lift",
        variants[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-[rgb(var(--foreground-muted))]">{title}</p>
          <p className="text-2xl font-semibold tracking-tight text-[rgb(var(--foreground-primary))] tabular-nums">{value}</p>
        </div>
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl shadow-sm",
            iconVariants[variant]
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>

      {trend && TrendIcon && (
        <div className="mt-4 flex items-center gap-2">
          <div className={cn("flex items-center gap-1", getTrendColor())}>
            <TrendIcon className="h-4 w-4" />
            <span className="text-sm font-medium">
              {Math.abs(trend.value).toFixed(1)}%
            </span>
          </div>
          <span className="text-xs text-[rgb(var(--foreground-muted))]">
            {trend.label || "from last month"}
          </span>
        </div>
      )}
    </div>
  );
}
