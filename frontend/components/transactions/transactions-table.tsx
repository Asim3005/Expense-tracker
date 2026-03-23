"use client";

import * as React from "react";
import { Transaction, Category, TransactionFilter } from "@/lib/types";
import { formatDateRelative, formatCurrency } from "@/lib/utils";
import { ArrowUpRight, ArrowDownLeft, Edit2, Trash2, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { format } from "date-fns";

interface TransactionsTableProps {
  transactions: Transaction[];
  categories: Category[];
  selectedIds: Set<string>;
  onSelectAll: (checked: boolean) => void;
  onSelectId: (id: string, checked: boolean) => void;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  onBulkDelete: () => void;
  onSort: (field: "date" | "amount") => void;
  sortBy?: "date" | "amount";
  sortOrder?: "asc" | "desc";
  loading?: boolean;
}

export function TransactionsTable({
  transactions,
  categories,
  selectedIds,
  onSelectAll,
  onSelectId,
  onEdit,
  onDelete,
  onBulkDelete,
  onSort,
  sortBy = "date",
  sortOrder = "desc",
  loading = false,
}: TransactionsTableProps) {
  const allSelected = transactions.length > 0 && selectedIds.size === transactions.length;
  const someSelected = selectedIds.size > 0 && !allSelected;

  const getCategory = (categoryId: string | null) => {
    return categories.find((c) => c.id === categoryId);
  };

  const getSortIcon = (field: "date" | "amount") => {
    if (sortBy !== field) return null;
    return sortOrder === "asc" ? "↑" : "↓";
  };

  return (
    <div className="space-y-4">
      {/* Bulk Actions */}
      {selectedIds.size > 0 && (
        <div className="flex items-center justify-between rounded-xl border border-[rgb(var(--danger-border))] bg-[rgb(var(--danger-bg))] p-4">
          <p className="text-sm font-medium text-[rgb(var(--foreground-primary))]">
            {selectedIds.size} transaction{selectedIds.size !== 1 ? "s" : ""} selected
          </p>
          <Button variant="danger" size="sm" onClick={onBulkDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Selected
          </Button>
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--background-card))] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[rgb(var(--border))] bg-[rgb(var(--background-muted))]">
                <th className="h-12 px-4 text-left">
                  <div className="flex items-center">
                    <Checkbox
                      checked={allSelected}
                      aria-checked={someSelected ? "mixed" : allSelected}
                      onCheckedChange={onSelectAll}
                    />
                  </div>
                </th>
                <th className="h-12 px-4 text-left text-xs font-medium text-[rgb(var(--foreground-muted))]">
                  Description
                </th>
                <th className="h-12 px-4 text-left text-xs font-medium text-[rgb(var(--foreground-muted))]">
                  Category
                </th>
                <th
                  className="h-12 px-4 text-left text-xs font-medium text-[rgb(var(--foreground-muted))] cursor-pointer hover:text-[rgb(var(--foreground-primary))]"
                  onClick={() => onSort("date")}
                >
                  <div className="flex items-center gap-1">
                    Date {getSortIcon("date")}
                  </div>
                </th>
                <th
                  className="h-12 px-4 text-right text-xs font-medium text-[rgb(var(--foreground-muted))] cursor-pointer hover:text-[rgb(var(--foreground-primary))]"
                  onClick={() => onSort("amount")}
                >
                  <div className="flex items-center gap-1">
                    Amount {getSortIcon("amount")}
                  </div>
                </th>
                <th className="h-12 w-10 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-[rgb(var(--border))]">
                    <td className="p-4">
                      <div className="h-6 w-6 bg-[rgb(var(--background-muted))] rounded-lg animate-pulse" />
                    </td>
                    <td className="p-4">
                      <div className="h-5 w-32 bg-[rgb(var(--background-muted))] rounded-lg animate-pulse" />
                    </td>
                    <td className="p-4">
                      <div className="h-5 w-20 bg-[rgb(var(--background-muted))] rounded-lg animate-pulse" />
                    </td>
                    <td className="p-4">
                      <div className="h-6 w-24 bg-[rgb(var(--background-muted))] rounded-lg animate-pulse" />
                    </td>
                    <td className="p-4">
                      <div className="h-5 w-24 bg-[rgb(var(--background-muted))] rounded-lg animate-pulse" />
                    </td>
                    <td className="p-4"></td>
                  </tr>
                ))
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center">
                    <p className="text-sm text-[rgb(var(--foreground-muted))]">
                      No transactions found
                    </p>
                  </td>
                </tr>
              ) : (
                transactions.map((transaction) => {
                  const category = getCategory(transaction.category_id);
                  const isIncome = transaction.transaction_type === "income";
                  const isSelected = selectedIds.has(transaction.id);

                  return (
                    <tr
                      key={transaction.id}
                      className={cn(
                        "border-b border-[rgb(var(--border))] transition-colors hover:bg-[rgb(var(--background-muted))]",
                        isSelected && "bg-[rgb(var(--background-muted))]"
                      )}
                    >
                      <td className="p-4">
                        <Checkbox
                          checked={isSelected}
                          aria-checked={someSelected ? "mixed" : isSelected}
                          onCheckedChange={(checked) => onSelectId(transaction.id, !!checked)}
                        />
                      </td>
                      <td className="p-4 max-w-xs">
                        <p className="text-sm font-medium text-[rgb(var(--foreground-primary))] truncate">
                          {transaction.description}
                        </p>
                      </td>
                      <td className="p-4">
                        {category ? (
                          <Badge
                            variant="outline"
                            className="text-xs"
                            style={{
                              backgroundColor: `${category.color}15`,
                              color: category.color,
                              borderColor: `${category.color}30`,
                            }}
                          >
                            {category.icon}
                          </Badge>
                        ) : (
                          <span className="text-xs text-[rgb(var(--foreground-muted))]">—</span>
                        )}
                      </td>
                      <td className="p-4 text-xs text-[rgb(var(--foreground-muted))]">
                        {format(new Date(transaction.date), "MMM d, yyyy")}
                      </td>
                      <td className="p-4 text-xs text-[rgb(var(--foreground-muted))]">
                        {formatDateRelative(transaction.date)}
                      </td>
                      <td className="p-4">
                        <p
                          className={cn(
                            "text-sm font-semibold tabular-nums",
                            isIncome ? "text-[rgb(var(--success))]" : "text-[rgb(var(--danger))]"
                          )}
                        >
                          {isIncome ? "+" : "-"}
                          {formatCurrency(transaction.amount)}
                        </p>
                      </td>
                      <td className="p-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onEdit(transaction)}>
                              <Edit2 className="h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-[rgb(var(--danger))]"
                              onClick={() => onDelete(transaction.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
