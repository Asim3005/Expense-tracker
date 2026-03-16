"use client";

import { Transaction, Category } from "@/lib/types";
import { deleteTransaction } from "@/lib/api";
import { Trash2, Receipt, Edit3 } from "lucide-react";
import { useState } from "react";
import { TransactionEditModal } from "./TransactionEditModal";

interface TransactionListProps {
  transactions: Transaction[];
  categories: Category[];
  onRefresh?: () => void;
  onOptimisticDelete?: (id: string) => void;
  onDeleteFailed?: (id: string) => void;
}

export function TransactionList({ transactions, categories, onRefresh, onOptimisticDelete, onDeleteFailed }: TransactionListProps) {
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleDelete = async (id: string) => {
    onOptimisticDelete?.(id); // Remove from view immediately
    setDeleting(id);
    try {
      await deleteTransaction(id);
      setConfirmDeleteId(null);
      onRefresh?.();
    } catch (error) {
      console.error("Failed to delete transaction:", error);
      onDeleteFailed?.(id); // Add back to view on failure
      alert("Failed to delete transaction");
    } finally {
      setDeleting(null);
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowEditModal(true);
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    setEditingTransaction(null);
    onRefresh?.();
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingTransaction(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 py-12 dark:border-zinc-700">
        <Receipt className="h-12 w-12 text-zinc-400 dark:text-zinc-600" />
        <p className="mt-4 text-sm font-medium text-zinc-900 dark:text-zinc-50">
          No transactions found
        </p>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Add your first transaction to get started
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="group relative flex items-center justify-between rounded-lg border border-zinc-200 bg-white p-4 transition-all hover:border-zinc-300 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <p className="font-medium text-zinc-900 dark:text-zinc-50">
                  {transaction.description}
                </p>
                {transaction.category && (
                  <span
                    className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors"
                    style={{
                      backgroundColor: `${transaction.category.color}15`,
                      color: transaction.category.color,
                      border: `1px solid ${transaction.category.color}30`,
                    }}
                  >
                    {transaction.category.icon} {transaction.category.name}
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {formatDate(transaction.date)}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <p
                className={`text-lg font-semibold tabular-nums ${
                  transaction.transaction_type === "income"
                    ? "text-emerald-600"
                    : "text-red-600"
                }`}
              >
                {transaction.transaction_type === "income" ? "+" : "-"}$
                {Number(transaction.amount).toFixed(2)}
              </p>

              {/* Delete confirmation */}
              {confirmDeleteId === transaction.id ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setConfirmDeleteId(null)}
                    className="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(transaction.id)}
                    disabled={deleting === transaction.id}
                    className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:bg-red-400 dark:bg-red-500 dark:hover:bg-red-600"
                  >
                    {deleting === transaction.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              ) : (
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(transaction)}
                    className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-indigo-600 dark:hover:bg-zinc-800"
                    title="Edit transaction"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(transaction.id)}
                    className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                    title="Delete transaction"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingTransaction && (
        <TransactionEditModal
          transaction={editingTransaction}
          categories={categories}
          isOpen={showEditModal}
          onClose={handleCloseEditModal}
          onSuccess={handleEditSuccess}
        />
      )}
    </>
  );
}
