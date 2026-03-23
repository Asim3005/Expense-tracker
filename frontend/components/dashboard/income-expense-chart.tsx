"use client";

import * as React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";
import { MonthlyTrend } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface IncomeExpenseChartProps {
  data: MonthlyTrend[];
  className?: string;
}

export function IncomeExpenseChart({ data, className }: IncomeExpenseChartProps) {
  if (data.length === 0) {
    return (
      <div className={cn("flex flex-col items-center justify-center h-64", className)}>
        <p className="text-sm text-[rgb(var(--foreground-muted))]">No trend data available</p>
      </div>
    );
  }

  const chartData = data.map((item) => ({
    month: new Date(item.month + "-01").toLocaleDateString("en-US", { month: "short" }),
    income: item.income,
    expenses: item.expenses,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;

    return (
      <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--background-card))] p-4 shadow-xl">
        <p className="text-sm font-medium text-[rgb(var(--foreground-primary))] mb-3">{label}</p>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[rgb(var(--success))]" />
            <span className="text-xs text-[rgb(var(--foreground-muted))]">Income:</span>
            <span className="text-sm font-medium text-[rgb(var(--foreground-primary))] tabular-nums">
              {formatCurrency(payload[0].value)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[rgb(var(--danger))]" />
            <span className="text-xs text-[rgb(var(--foreground-muted))]">Expenses:</span>
            <span className="text-sm font-medium text-[rgb(var(--foreground-primary))] tabular-nums">
              {formatCurrency(payload[1].value)}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={cn("space-y-4", className)}>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgb(var(--border))"
            vertical={false}
            className="stroke-[rgb(var(--border))]"
          />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "rgb(var(--foreground-muted))", fontSize: 12 }}
            tickMargin={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "rgb(var(--foreground-muted))", fontSize: 12 }}
            tickFormatter={(value) => formatCurrency(value)}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="income"
            stroke="rgb(var(--success))"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 6, strokeWidth: 2 }}
            animationDuration={800}
          />
          <Line
            type="monotone"
            dataKey="expenses"
            stroke="rgb(var(--danger))"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 6, strokeWidth: 2 }}
            animationDuration={800}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="flex items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[rgb(var(--success))]" />
          <span className="text-xs font-medium text-[rgb(var(--foreground-secondary))]">Income</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[rgb(var(--danger))]" />
          <span className="text-xs font-medium text-[rgb(var(--foreground-secondary))]">Expenses</span>
        </div>
      </div>
    </div>
  );
}
