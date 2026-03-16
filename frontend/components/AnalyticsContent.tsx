"use client";

import { useEffect, useState } from "react";
import { SpendingByCategory, MonthlyTrend, Summary } from "@/lib/types";
import { getSpendingByCategory, getMonthlyTrend, getSummary } from "@/lib/api";
import { ExpenseChart } from "./ExpenseChart";
import { MonthlyTrendChart } from "./MonthlyTrend";
import { Calendar } from "lucide-react";

export function AnalyticsContent() {
  const [spendingData, setSpendingData] = useState<SpendingByCategory[]>([]);
  const [trendData, setTrendData] = useState<MonthlyTrend[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const [spending, trend, summaryData] = await Promise.all([
        getSpendingByCategory(startDate, endDate),
        getMonthlyTrend(),
        getSummary(startDate, endDate),
      ]);
      setSpendingData(spending);
      setTrendData(trend);
      setSummary(summaryData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load analytics");
      console.error("Error fetching analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [startDate, endDate]);

  const handleDateReset = () => {
    setStartDate("");
    setEndDate("");
  };

  if (loading) {
    return <div className="text-center text-zinc-600 dark:text-zinc-400">Loading...</div>;
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-900/20 dark:text-red-400">
        {error}
        <button
          onClick={fetchAnalytics}
          className="ml-4 underline hover:text-red-800 dark:hover:text-red-300"
        >
          Retry
        </button>
      </div>
    );
  }

  const totalSpending = spendingData.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-6">
      {/* Date Range Filter */}
      <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
            <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
              Date Range
            </h3>
          </div>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
          />
          <span className="text-zinc-600 dark:text-zinc-400">to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
          />
          {(startDate || endDate) && (
            <button
              onClick={handleDateReset}
              className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Income
            </p>
            <p className="mt-2 text-2xl font-semibold text-emerald-600">
              ${Number(summary.total_income).toFixed(2)}
            </p>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Expenses
            </p>
            <p className="mt-2 text-2xl font-semibold text-red-600">
              ${Number(summary.total_expenses).toFixed(2)}
            </p>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Net
            </p>
            <p
              className={`mt-2 text-2xl font-semibold ${
                Number(summary.balance) >= 0 ? "text-emerald-600" : "text-red-600"
              }`}
            >
              ${Number(summary.balance).toFixed(2)}
            </p>
          </div>
        </div>
      )}

      {/* Spending by Category */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="mb-4 text-lg font-medium text-zinc-900 dark:text-zinc-50">
            Spending by Category
          </h3>
          <ExpenseChart data={spendingData} />
        </div>

        {/* Category Breakdown List */}
        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="mb-4 text-lg font-medium text-zinc-900 dark:text-zinc-50">
            Category Breakdown
          </h3>
          {spendingData.length === 0 ? (
            <p className="text-center text-zinc-600 dark:text-zinc-400">
              No expense data available
            </p>
          ) : (
            <div className="space-y-3">
              {spendingData.map((item) => {
                const percentage = totalSpending > 0
                  ? (item.amount / totalSpending) * 100
                  : 0;
                return (
                  <div key={item.category_id}>
                    <div className="mb-1 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: item.category_color }}
                        />
                        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                          {item.category_name}
                        </span>
                      </div>
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">
                        ${Number(item.amount).toFixed(2)} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-zinc-200 dark:bg-zinc-800">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: item.category_color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Monthly Trend */}
      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="mb-4 text-lg font-medium text-zinc-900 dark:text-zinc-50">
          Monthly Trend (12 months)
        </h3>
        <MonthlyTrendChart data={trendData} />
      </div>
    </div>
  );
}
