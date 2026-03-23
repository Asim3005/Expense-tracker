"use client";

import * as React from "react";
import { Transaction, Category } from "@/lib/types";
import { formatDateRelative, formatCurrency } from "@/lib/utils";
import { ArrowUpRight, ArrowDownLeft, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface RecentTransactionsProps {
  transactions: Transaction[];
  categories: Category[];
  className?: string;
}

export function RecentTransactions({ transactions, categories, className }: RecentTransactionsProps) {
  const getCategory = (categoryId: string | null) => {
    return categories.find((c) => c.id === categoryId);
  };

  if (transactions.length === 0) {
    return (
      <div className={cn("flex flex-col items-center justify-center py-12", className)}>
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[rgb(var(--background-muted))]">
          <MoreHorizontal className="h-8 w-8 text-[rgb(var(--foreground-muted))]" />
        </div>
        <p className="mt-4 text-sm font-medium text-[rgb(var(--foreground-primary))]">No transactions yet</p>
        <p className="mt-1 text-xs text-[rgb(var(--foreground-muted))]">
          Add your first transaction to get started
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      {transactions.slice(0, 5).map((transaction) => {
        const category = getCategory(transaction.category_id);
        const isIncome = transaction.transaction_type === "income";

        return (
          <div
            key={transaction.id}
            className="group flex items-center justify-between rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--background-card))] p-4 transition-all duration-200 hover:bg-[rgb(var(--background-muted))] hover:border-[rgb(var(--border-hover))]"
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg shadow-sm",
                  isIncome ? "bg-[rgb(var(--success-bg))] text-[rgb(var(--success))]" : "bg-[rgb(var(--danger-bg))] text-[rgb(var(--danger))]"
                )}
              >
                {isIncome ? (
                  <ArrowUpRight className="h-5 w-5" />
                ) : (
                  <ArrowDownLeft className="h-5 w-5" />
                )}
              </div>
              <div className="space-y-0.5">
                <p className="text-sm font-medium text-[rgb(var(--foreground-primary))]">
                  {transaction.description}
                </p>
                <div className="flex items-center gap-2">
                  {category && (
                    <span
                      className="inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors"
                      style={{
                        backgroundColor: `${category.color}15`,
                        color: category.color,
                        borderColor: `${category.color}30`,
                      }}
                    >
                      {category.icon}
                    </span>
                  )}
                  <span className="text-xs text-[rgb(var(--foreground-muted))]">
                    {formatDateRelative(transaction.date)}
                  </span>
                </div>
              </div>
            </div>

            <p
              className={cn(
                "text-sm font-semibold tabular-nums transition-colors",
                isIncome ? "text-[rgb(var(--success))]" : "text-[rgb(var(--danger))]"
              )}
            >
              {isIncome ? "+" : "-"}
              {formatCurrency(transaction.amount)}
            </p>
          </div>
        );
      })}

      {transactions.length > 5 && (
        <Button variant="ghost" className="w-full text-sm" asChild>
          <Link href="/transactions" className="text-[rgb(var(--foreground-secondary))]">
            View all transactions
          </Link>
        </Button>
      )}
    </div>
  );
}
