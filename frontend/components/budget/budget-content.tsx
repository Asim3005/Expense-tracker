"use client";

import * as React from "react";
import { Category } from "@/lib/types";
import { getSummary, getCategories, getSpendingByCategory } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocalStorage } from "@/lib/hooks/use-local-storage";
import { SkeletonCard } from "@/components/ui/skeleton";
import { BudgetProgress, BudgetEditDialog, CategoryBudget } from "./budget-progress";
import { TrendingUp, TrendingDown, Wallet, Lightbulb } from "lucide-react";
import { getCurrentMonthRange, formatCurrency, cn } from "@/lib/utils";

export function BudgetContent() {
  const [summary, setSummary] = React.useState<{ total_expenses: number } | null>(null);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [spending, setSpending] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [showBudgetDialog, setShowBudgetDialog] = React.useState(false);

  const [budget, setBudget] = useLocalStorage<number>("monthlyBudget", 3500);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { start, end } = getCurrentMonthRange();
      const [summaryData, categoriesData, spendingData] = await Promise.all([
        getSummary(start, end),
        getCategories(),
        getSpendingByCategory(start, end),
      ]);
      setSummary(summaryData);
      setCategories(categoriesData);
      setSpending(spendingData);
    } catch (error) {
      console.error("Error fetching budget data:", error);
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
        <div className="grid gap-4 lg:grid-cols-2">
          {[1, 2].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  const totalExpenses = summary?.total_expenses || 0;
  const remainingBudget = budget - totalExpenses;
  const budgetPercentage = Math.min((totalExpenses / budget) * 100, 100);
  const budgetStatus = budgetPercentage >= 100 ? "Exceeded" : budgetPercentage >= 80 ? "Warning" : "On Track";

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-[rgb(var(--foreground-primary))]">
            Budget
          </h1>
          <p className="mt-1 text-sm text-[rgb(var(--foreground-muted))]">
            Track your monthly spending against your budget limits
          </p>
        </div>
        <Button onClick={() => setShowBudgetDialog(true)} size="lg">
          <Lightbulb className="mr-2 h-5 w-5" />
          Edit Budget
        </Button>
      </div>

      {/* Main Budget Overview */}
      {summary && (
        <Card className="p-6 hover-lift">
          <CardHeader>
            <CardTitle>Monthly Budget Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <BudgetProgress
              spent={totalExpenses}
              budget={budget}
              onEdit={() => setShowBudgetDialog(true)}
            />

            {/* Budget Status */}
            <div className={cn(
              "flex items-start gap-3 p-4 rounded-xl mt-6",
              budgetStatus === "On Track" && "bg-[rgb(var(--success-bg))] border-[rgb(var(--success-border))]",
              budgetStatus === "Warning" && "bg-[rgb(var(--warning-bg))] border-[rgb(var(--warning-border))]",
              budgetStatus === "Exceeded" && "bg-[rgb(var(--danger-bg))] border-[rgb(var(--danger-border))]"
            )}>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg">
                {budgetStatus === "On Track" && (
                  <TrendingUp className="h-6 w-6 text-[rgb(var(--success))]" />
                )}
                {budgetStatus === "Warning" && (
                  <TrendingDown className="h-6 w-6 text-[rgb(var(--warning))]" />
                )}
                {budgetStatus === "Exceeded" && (
                  <Wallet className="h-6 w-6 text-[rgb(var(--danger))]" />
                )}
              </div>
              <div>
                <p className="font-medium text-[rgb(var(--foreground-primary))]">
                  {budgetStatus === "On Track" && "Great! You're on track."}
                  {budgetStatus === "Warning" && "Caution! You've used 80% of your budget."}
                  {budgetStatus === "Exceeded" && "Alert! You've exceeded your budget."}
                </p>
                <div className="space-y-1 mt-1">
                  <p className="text-xs text-[rgb(var(--foreground-muted))]">
                    Budget: {formatCurrency(budget)}
                  </p>
                  <p className="text-xs text-[rgb(var(--foreground-muted))]">
                    Spent: {formatCurrency(totalExpenses)}
                  </p>
                  <p className="text-xs text-[rgb(var(--foreground-muted))]">
                    {budgetPercentage.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Category Breakdown */}
      <Card className="p-6 hover-lift">
        <CardHeader>
          <CardTitle>Spending by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {spending.map((item) => {
              const category = categories.find((c) => c.id === item.category_id);
              const categoryBudget = category ? (budget / categories.length) : 0; // Equal budget for demo
              const categorySpent = item.amount;
              const categoryRemaining = categoryBudget - categorySpent;

              if (!category) return null;

              return (
                <CategoryBudget
                  key={item.category_id}
                  category={category}
                  spent={categorySpent}
                  budget={categoryBudget}
                />
              );
            })}
          </div>

          {spending.length === 0 && (
            <div className="text-center py-8">
              <Lightbulb className="h-12 w-12 text-[rgb(var(--foreground-muted))] mx-auto" />
              <p className="mt-4 text-sm text-[rgb(var(--foreground-muted))]">
                No spending data yet
              </p>
              <p className="text-xs text-[rgb(var(--foreground-muted))]">
                Add transactions to see your spending breakdown
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Budget Tips */}
      <Card className="p-6 hover-lift bg-[rgb(var(--primary-bg))] border-[rgb(var(--primary-border))]">
        <CardHeader>
          <CardTitle className="text-[rgb(var(--primary))]">Budget Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <Wallet className="h-5 w-5 text-[rgb(var(--primary))] shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-[rgb(var(--foreground-secondary))]">
                  Set a realistic monthly budget based on your income and essential expenses.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Wallet className="h-5 w-5 text-[rgb(var(--primary))] shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-[rgb(var(--foreground-secondary))]">
                  Track your expenses regularly to stay on top of your spending habits.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Wallet className="h-5 w-5 text-[rgb(var(--primary))] shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-[rgb(var(--foreground-secondary))]">
                  Allocate budgets for different categories to better manage your money.
                </p>
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Budget Edit Dialog */}
      <BudgetEditDialog
        open={showBudgetDialog}
        onOpenChange={setShowBudgetDialog}
        budget={budget}
        onSave={(newBudget) => {
          setBudget(newBudget);
          setIsSaving(false);
        }}
        isLoading={isSaving}
      />
    </div>
  );
}
