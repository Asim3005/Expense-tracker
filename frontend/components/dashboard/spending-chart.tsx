"use client";

import * as React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { cn } from "@/lib/utils";
import { SpendingByCategory } from "@/lib/types";

interface SpendingChartProps {
  data: SpendingByCategory[];
  className?: string;
}

const CHART_COLORS = [
  "rgb(99 102 241)",   // Indigo --chart-1
  "rgb(34 87 61)",    // Green --chart-2
  "rgb(244 83 68)",   // Pink --chart-3
  "rgb(24 95 53)",    // Orange --chart-4
  "rgb(142 71 45)",   // Emerald --chart-5
  "rgb(59 130 246)",  // Blue --chart-6
  "rgb(139 92 246)", // Purple --chart-7
  "rgb(30 80 55)",    // Teal --chart-8
];

export function SpendingChart({ data, className }: SpendingChartProps) {
  if (data.length === 0) {
    return (
      <div className={cn("flex flex-col items-center justify-center h-64", className)}>
        <p className="text-sm text-[rgb(var(--foreground-muted))]">No spending data available</p>
      </div>
    );
  }

  const chartData = data.map((item, index) => ({
    name: item.category_name,
    value: item.amount,
    color: item.category_color || CHART_COLORS[index % CHART_COLORS.length],
    icon: item.category_icon,
  }));

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;

    return (
      <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--background-card))] p-4 shadow-xl">
        <p className="text-sm font-medium text-[rgb(var(--foreground-primary))] mb-1">{payload[0].name}</p>
        <p className="text-sm text-[rgb(var(--foreground-secondary))]">
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  };

  const CustomLegend = ({ payload }: any) => {
    const total = payload.reduce((sum: number, entry: any) => sum + entry.value, 0);

    return (
      <div className="flex flex-wrap justify-center gap-3 mt-6">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs font-medium text-[rgb(var(--foreground-secondary))]">
              {entry.payload?.icon} {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={cn("space-y-4", className)}>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={4}
            dataKey="value"
            animationDuration={800}
            animationBegin={0}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                strokeWidth={2}
                stroke="rgb(var(--background-card))"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Category breakdown list */}
      <div className="space-y-2 mt-4">
        {data.map((item) => (
          <div key={item.category_id} className="flex items-center justify-between text-sm py-1.5 border-b border-[rgb(var(--border))] last:border-0">
            <div className="flex items-center gap-2">
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: item.category_color }}
              />
              <span className="text-[rgb(var(--foreground-secondary))]">
                {item.category_icon} {item.category_name}
              </span>
            </div>
            <span className="font-semibold text-[rgb(var(--foreground-primary))] tabular-nums">
              {formatCurrency(item.amount)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
