"use client";

import * as React from "react";
import { Transaction, Category, Summary } from "@/lib/types";
import { getTransactions, getCategories, getSummary, getSpendingByCategory, getMonthlyTrend } from "@/lib/api";
import { StatsCard } from "./stats-card";
import { SpendingChart } from "./spending-chart";
import { IncomeExpenseChart } from "./income-expense-chart";
import { RecentTransactions } from "./recent-transactions";
import { SkeletonCard, SkeletonRow } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, TrendingDown, Wallet, PiggyBank } from "lucide-react";
import { getCurrentMonthRange } from "@/lib/utils";
import Link from "next/link";

export function DashboardContent() {
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [summary, setSummary] = React.useState<Summary | null>(null);
  const [spending, setSpending] = React.useState<any[]>([]);
  const [trend, setTrend] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const { start, end } = getCurrentMonthRange();
      const [transactionsData, categoriesData, summaryData, spendingData, trendData] = await Promise.all([
        getTransactions({ limit: 5 }),
        getCategories(),
        getSummary(),
        getSpendingByCategory(start, end),
        getMonthlyTrend(6),
      ]);
      setTransactions(transactionsData);
      setCategories(categoriesData);
      setSummary(summaryData);
      setSpending(spendingData);
      setTrend(trendData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        {/* Stats Cards Skeleton */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>

        {/* Charts Skeleton */}
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="p-6">
            <div className="h-64 skeleton rounded-xl" />
          </Card>
          <Card className="p-6">
            <div className="h-64 skeleton rounded-xl" />
          </Card>
        </div>

        {/* Recent Transactions Skeleton */}
        <Card className="p-6">
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <SkeletonRow key={i} cells={3} />
            ))}
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-[rgb(var(--danger-border))] bg-[rgb(var(--danger-bg))]">
        <CardContent className="p-6">
          <p className="text-sm text-[rgb(var(--danger))]">{error}</p>
          <Button
            onClick={fetchData}
            variant="outline"
            className="mt-4 border-[rgb(var(--danger))] text-[rgb(var(--danger))] hover:bg-[rgb(var(--danger))] hover:text-[rgb(var(--danger-foreground))]"
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-[rgb(var(--foreground-primary))]">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-[rgb(var(--foreground-muted))]">
            Welcome back! Here's your financial overview.
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/transactions?add=true">
            <Plus className="mr-2 h-5 w-5" />
            Add Transaction
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      {summary && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Balance"
            value={formatCurrency(summary.balance)}
            icon={Wallet}
            variant={summary.balance >= 0 ? "success" : "danger"}
          />
          <StatsCard
            title="Total Income"
            value={formatCurrency(summary.total_income)}
            icon={TrendingUp}
            variant="success"
            trend={{ value: 12.5, label: "from last month" }}
          />
          <StatsCard
            title="Total Expenses"
            value={formatCurrency(summary.total_expenses)}
            icon={TrendingDown}
            variant="danger"
            trend={{ value: -5.2, label: "from last month" }}
          />
          <StatsCard
            title="Budget"
            value="65%"
            icon={PiggyBank}
            variant="warning"
            trend={{ value: 0, label: "$2,300 / $3,500" }}
          />
        </div>
      )}

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-6 hover-lift">
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <SpendingChart data={spending} />
          </CardContent>
        </Card>

        <Card className="p-6 hover-lift">
          <CardHeader>
            <CardTitle>Income vs Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <IncomeExpenseChart data={trend} />
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="p-6 hover-lift">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Transactions</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/transactions" className="text-sm">
              View all
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <RecentTransactions transactions={transactions} categories={categories} />
        </CardContent>
      </Card>
    </div>
  );
}
