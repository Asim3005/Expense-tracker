"use client";

import { SpendingByCategory } from "@/lib/types";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface ExpenseChartProps {
  data: SpendingByCategory[];
}

export function ExpenseChart({ data }: ExpenseChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-zinc-300 text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
        No data available
      </div>
    );
  }

  const chartData = data.map((item) => ({
    name: item.category_name,
    value: item.amount,
    color: item.category_color,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value?: number | string) => value !== undefined ? `$${Number(value).toFixed(2)}` : "$0.00"}
          contentStyle={{
            backgroundColor: "rgb(249 250 251)",
            border: "1px solid rgb(228 228 231)",
            borderRadius: "0.5rem",
          }}
          itemStyle={{ color: "rgb(24 24 27)" }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
