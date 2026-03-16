"use client";

import { MonthlyTrend } from "@/lib/types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface MonthlyTrendProps {
  data: MonthlyTrend[];
}

export function MonthlyTrendChart({ data }: MonthlyTrendProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-zinc-300 text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
        No data available
      </div>
    );
  }

  const chartData = [...data].reverse().map((item) => ({
    month: item.month,
    income: item.income,
    expenses: item.expenses,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgb(228 228 231)" />
        <XAxis dataKey="month" stroke="rgb(161 161 170)" />
        <YAxis stroke="rgb(161 161 170)" />
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
        <Line
          type="monotone"
          dataKey="income"
          stroke="rgb(16 185 129)"
          strokeWidth={2}
          dot={{ fill: "rgb(16 185 129)" }}
          name="Income"
        />
        <Line
          type="monotone"
          dataKey="expenses"
          stroke="rgb(239 68 68)"
          strokeWidth={2}
          dot={{ fill: "rgb(239 68 68)" }}
          name="Expenses"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
