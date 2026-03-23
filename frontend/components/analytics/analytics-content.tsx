"use client";

import * as React from "react";
import { SpendingByCategory, MonthlyTrend, Summary } from "@/lib/types";
import { getSpendingByCategory, getMonthlyTrend, getSummary } from "@/lib/api";
import { SpendingChart } from "@/components/dashboard/spending-chart";
import { IncomeExpenseChart } from "@/components/dashboard/income-expense-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { SkeletonCard, SkeletonRow } from "@/components/ui/skeleton";
import { Calendar, TrendingUp, TrendingDown, Wallet, RefreshCw } from "lucide-react";
import { getCurrentMonthRange, getLastNDaysRange, formatCurrency } from "@/lib/utils";

export function AnalyticsContent() {
  const [spendingData, setSpendingData] = React.useState<SpendingByCategory[]>([]);
  const [trendData, setTrendData] = React.useState<MonthlyTrend[]>([]);
  const [summary, setSummary] = React.useState<Summary | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Filters
  const [datePreset, setDatePreset] = React.useState<"month" | "last30" | "custom">("month");
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("");

  const categories = spendingData.map((item) => ({
    id: item.category_id,
    name: item.category_name,
    color: item.category_color,
  }));

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const [spending, trend, summaryData] = await Promise.all([
        getSpendingByCategory(startDate, endDate),
        getMonthlyTrend(12),
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

  React.useEffect(() => {
    if (datePreset === "month") {
      const { start, end } = getCurrentMonthRange();
      setStartDate(start);
      setEndDate(end);
    } else if (datePreset === "last30") {
      const { start, end } = getLastNDaysRange(30);
      setStartDate(start);
      setEndDate(end);
    }
  }, [datePreset]);

  React.useEffect(() => {
    if (startDate && endDate) {
      fetchAnalytics();
    }
  }, [startDate, endDate, selectedCategory]);

  const filteredSpending = selectedCategory
    ? spendingData.filter((item) => item.category_id === selectedCategory)
    : spendingData;

  const totalSpending = spendingData.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track your financial trends and patterns
          </p>
        </div>
        <Button variant="outline" onClick={fetchAnalytics} disabled={loading}>
          <RefreshCw className={cn("mr-2 h-4 w-4", loading && "animate-spin")} />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Label>Date Range</Label>
          </div>
          <Select
            value={datePreset}
            onChange={(e) => setDatePreset(e.target.value as "month" | "last30" | "custom")}
          >
            <option value="month">This Month</option>
            <option value="last30">Last 30 Days</option>
            <option value="custom">Custom</option>
          </Select>
          {datePreset === "custom" && (
            <>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <span className="text-muted-foreground">to</span>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </>
          )}
          {categories.length > 0 && (
            <div className="flex items-center gap-2 ml-4">
              <Label>Category</Label>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </Select>
            </div>
          )}
        </div>
      </Card>

      {/* Error Message */}
      {error && (
        <Card className="border-danger bg-danger/5">
          <CardContent className="p-6">
            <p className="text-sm text-danger">{error}</p>
            <Button
              onClick={fetchAnalytics}
              variant="outline"
              className="mt-4 border-danger text-danger hover:bg-danger hover:text-danger-foreground"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Summary Cards */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : summary ? (
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10 text-success">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Income</p>
                <p className="text-2xl font-semibold text-foreground">
                  {formatCurrency(summary.total_income)}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-danger/10 text-danger">
                <TrendingDown className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Expenses</p>
                <p className="text-2xl font-semibold text-foreground">
                  {formatCurrency(summary.total_expenses)}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg",
                  summary.balance >= 0
                    ? "bg-success/10 text-success"
                    : "bg-danger/10 text-danger"
                )}
              >
                <Wallet className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Net</p>
                <p
                  className={cn(
                    "text-2xl font-semibold",
                    summary.balance >= 0 ? "text-success" : "text-danger"
                  )}
                >
                  {formatCurrency(summary.balance)}
                </p>
              </div>
            </div>
          </Card>
        </div>
      ) : null}

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-6">
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-64 animate-pulse bg-muted rounded-lg" />
            ) : (
              <SpendingChart data={filteredSpending} />
            )}
          </CardContent>
        </Card>

        <Card className="p-6">
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonRow key={i} cells={3} />
                ))}
              </div>
            ) : filteredSpending.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-sm text-muted-foreground">No expense data available</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredSpending.map((item) => {
                  const percentage = totalSpending > 0 ? (item.amount / totalSpending) * 100 : 0;
                  return (
                    <div key={item.category_id}>
                      <div className="mb-1 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: item.category_color }}
                          />
                          <span className="text-sm font-medium text-foreground">
                            {item.category_icon} {item.category_name}
                          </span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {formatCurrency(item.amount)} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-muted">
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
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trend */}
      <Card className="p-6">
        <CardHeader>
          <CardTitle>Monthly Trend (12 months)</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-64 animate-pulse bg-muted rounded-lg" />
          ) : (
            <IncomeExpenseChart data={trendData} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}
