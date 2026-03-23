"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Edit2, PiggyBank, TrendingUp, TrendingDown, Minus, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface BudgetProgressProps {
  spent: number;
  budget: number;
  onEdit?: () => void;
}

export function BudgetProgress({ spent, budget, onEdit }: BudgetProgressProps) {
  const percentage = Math.min((spent / budget) * 100, 100);
  const remaining = budget - spent;

  const getStatus = () => {
    if (percentage >= 100) return { label: "Exceeded", variant: "danger" as const, icon: XCircle };
    if (percentage >= 80) return { label: "Warning", variant: "warning" as const, icon: AlertTriangle };
    return { label: "On Track", variant: "success" as const, icon: CheckCircle };
  };

  const status = getStatus();

  return (
    <Card className="p-6 hover-lift">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-[rgb(var(--foreground-secondary))]">
              Monthly Budget
            </p>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-bold tabular-nums text-[rgb(var(--foreground-primary))]">
                {formatCurrency(spent)}
              </span>
              <span className="text-sm text-[rgb(var(--foreground-muted))]">
                 / {formatCurrency(budget)}
              </span>
            </div>
          </div>
          {onEdit && (
            <Button variant="ghost" size="sm" onClick={onEdit} className="h-8 w-8">
              <Edit2 className="h-4 w-4" />
            </Button>
          )}
        </div>

        <Progress
          value={percentage}
          max={100}
          variant={status.variant}
          size="lg"
          className="mb-4"
        />

        <div className="flex items-center justify-between gap-2 mt-4">
          <div className="flex items-center gap-2">
            <status.icon
              className={cn(
                "h-4 w-4",
                status.variant === "success" && "text-[rgb(var(--success))]",
                status.variant === "warning" && "text-[rgb(var(--warning))]",
                status.variant === "danger" && "text-[rgb(var(--danger))]"
              )}
            />
            <span
              className={cn(
                "text-sm font-medium",
                status.variant === "success" && "text-[rgb(var(--success))]",
                status.variant === "warning" && "text-[rgb(var(--warning))]",
                status.variant === "danger" && "text-[rgb(var(--danger))]"
              )}
            >
              {status.label}
            </span>
          </div>

          <div className="text-right">
            <p className="text-sm text-[rgb(var(--foreground-muted))]">
              {percentage.toFixed(0)}%
            </p>
            <p className="text-xs text-[rgb(var(--foreground-muted))] mt-0.5">
              Spent
            </p>
          </div>

          <div className="flex flex-col items-end gap-1">
            <p className="text-xs text-[rgb(var(--foreground-muted))]">
              Remaining
            </p>
            <p
              className={cn(
                "font-medium tabular-nums",
                remaining >= 0 ? "text-[rgb(var(--success))]" : "text-[rgb(var(--danger))]"
              )}
            >
              {remaining >= 0 ? "+" : ""}
              {formatCurrency(Math.abs(remaining))}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface BudgetEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  budget: number;
  onSave: (budget: number) => void;
  isLoading?: boolean;
}

export function BudgetEditDialog({
  open,
  onOpenChange,
  budget,
  onSave,
  isLoading,
}: BudgetEditDialogProps) {
  const [value, setValue] = React.useState(budget.toString());

  React.useEffect(() => {
    setValue(budget.toString());
  }, [budget, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newBudget = parseFloat(value);
    if (!isNaN(newBudget) && newBudget > 0) {
      onSave(newBudget);
      onOpenChange(false);
    }
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
            onClick={() => onOpenChange(false)}
          />
          <div className="relative w-full max-w-md animate-scale-in">
            <Card className="p-6">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[rgb(var(--primary))]">
                    <PiggyBank className="h-6 w-6 text-[rgb(var(--primary-foreground))]" />
                  </div>
                  <div>
                    <CardTitle>Set Monthly Budget</CardTitle>
                    <p className="text-sm text-[rgb(var(--foreground-muted))] mt-1">
                      Enter your monthly spending limit
                    </p>
                  </div>
                </div>
              </CardHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="budget">Budget Amount</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--foreground-muted))]">
                      $
                    </span>
                    <Input
                      id="budget"
                      type="number"
                      step="0.01"
                      min="0"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      className="pl-7"
                      required
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading || !value || parseFloat(value) <= 0}>
                    {isLoading ? (
                      <>
                        <div className="h-4 w-4 animate-spin border-2 border-t-[rgb(var(--foreground-muted))] border-t-[rgb(var(--background-card))] rounded-full">
                          <div className="absolute top-0 left-0 h-full w-0.5 bg-transparent border-t-2 border-t-[rgb(var(--primary))] border-l-0 border-r-0 border-b-0 transform origin-bottom-left rotate-45deg" />
                        </div>
                      </>
                    ) : (
                      "Save Budget"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}

interface CategoryBudgetProps {
  category: {
    id: string;
    name: string;
    icon: string;
    color: string;
  };
  spent: number;
  budget: number;
}

export function CategoryBudget({ category, spent, budget }: CategoryBudgetProps) {
  const percentage = Math.min((spent / budget) * 100, 100);
  const remaining = budget - spent;

  const getVariant = () => {
    if (percentage >= 100) return "danger";
    if (percentage >= 80) return "warning";
    return "success";
  };

  const variant = getVariant();

  return (
    <Card className="p-4 hover-lift transition-all duration-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${category.color}15` }}
            >
              <span className="text-lg">{category.icon}</span>
            </div>
            <p className="text-sm font-medium text-[rgb(var(--foreground-primary))]">
              {category.name}
            </p>
          </div>

          <div className="flex items-center gap-1">
            <p className="text-xs text-[rgb(var(--foreground-muted))]">
              {formatCurrency(spent)} / {formatCurrency(budget)}
            </p>
            <span
              className={cn(
                "text-xs font-medium px-2 py-1 rounded-full",
                variant === "danger" && "bg-[rgb(var(--danger-bg))] text-[rgb(var(--danger))]",
                variant === "warning" && "bg-[rgb(var(--warning-bg))] text-[rgb(var(--warning))]",
                variant === "success" && "bg-[rgb(var(--success-bg))] text-[rgb(var(--success))]"
              )}
            >
              {percentage.toFixed(0)}%
            </span>
          </div>
        </div>

        <Progress value={percentage} max={100} variant={variant as any} className="h-2 mb-2" />

        <div className="flex justify-between mt-2">
          <p className="text-xs text-[rgb(var(--foreground-muted))]">
            Spent
          </p>
          <p className="text-xs text-[rgb(var(--foreground-muted))]">
            Budget
          </p>
        </div>

        <div className="flex justify-between mt-1">
          <p className="text-sm font-semibold tabular-nums text-[rgb(var(--foreground-primary))]">
            {formatCurrency(spent)}
          </p>
          <p className="text-sm font-semibold tabular-nums text-[rgb(var(--foreground-primary))]">
            {formatCurrency(budget)}
          </p>
        </div>

        {variant !== "danger" && (
          <div className="mt-2">
            <p className="text-xs text-[rgb(var(--success))]">
              {formatCurrency(remaining)} remaining
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
