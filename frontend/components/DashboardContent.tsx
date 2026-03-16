"use client";

import { useEffect, useState } from "react";
import { Transaction, Category, Summary } from "@/lib/types";
import { getTransactions, getCategories, getSummary } from "@/lib/api";
import { StatsCard } from "./StatsCard";
import { TransactionForm } from "./TransactionForm";
import { TransactionList } from "./TransactionList";
import { Wallet, TrendingUp, TrendingDown } from "lucide-react";

export function DashboardContent() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [transactionsData, categoriesData, summaryData] = await Promise.all([
        getTransactions({ limit: 10 }),
        getCategories(),
        getSummary(),
      ]);
      setTransactions(transactionsData);
      setCategories(categoriesData);
      setSummary(summaryData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center text-zinc-600 dark:text-zinc-400">Loading...</div>;
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-900/20 dark:text-red-400">
        {error}
        <button
          onClick={fetchData}
          className="ml-4 underline hover:text-red-800 dark:hover:text-red-300"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      {summary && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatsCard
            title="Balance"
            value={`$${Number(summary.balance).toFixed(2)}`}
            icon={Wallet}
            trend={
              Number(summary.balance) >= 0
                ? undefined
                : { value: "Negative balance", positive: false }
            }
          />
          <StatsCard
            title="Total Income"
            value={`$${Number(summary.total_income).toFixed(2)}`}
            icon={TrendingUp}
            trend={{ value: "All time", positive: true }}
          />
          <StatsCard
            title="Total Expenses"
            value={`$${Number(summary.total_expenses).toFixed(2)}`}
            icon={TrendingDown}
            trend={{ value: "All time", positive: false }}
          />
        </div>
      )}

      {/* Quick Add Transaction */}
      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
            {showForm ? "Add Transaction" : "Quick Add"}
          </h3>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              + Add Transaction
            </button>
          )}
        </div>
        {showForm && (
          <TransactionForm
            categories={categories}
            onSuccess={() => {
              setShowForm(false);
              fetchData();
            }}
            onCancel={() => setShowForm(false)}
          />
        )}
      </div>

      {/* Recent Transactions */}
      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="mb-4 text-lg font-medium text-zinc-900 dark:text-zinc-50">
          Recent Transactions
        </h3>
        <TransactionList transactions={transactions} categories={categories} onRefresh={fetchData} />
      </div>
    </div>
  );
}
