"use client";

import { useState, useEffect } from "react";
import { Transaction, Category, TransactionUpdate } from "@/lib/types";
import { updateTransaction } from "@/lib/api";
import { CategorySelect } from "./CategorySelect";
import { X, Edit3 } from "lucide-react";

interface TransactionEditModalProps {
  transaction: Transaction;
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function TransactionEditModal({
  transaction,
  categories,
  isOpen,
  onClose,
  onSuccess,
}: TransactionEditModalProps) {
  const [formData, setFormData] = useState<TransactionUpdate>({
    amount: transaction.amount,
    description: transaction.description,
    transaction_type: transaction.transaction_type,
    category_id: transaction.category_id || undefined,
    date: transaction.date.split("T")[0],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form when transaction changes
  useEffect(() => {
    setFormData({
      amount: transaction.amount,
      description: transaction.description,
      transaction_type: transaction.transaction_type,
      category_id: transaction.category_id || undefined,
      date: transaction.date.split("T")[0],
    });
    setError(null);
  }, [transaction, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await updateTransaction(transaction.id, {
        ...formData,
        amount: Number(formData.amount),
        category_id: formData.category_id || undefined,
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update transaction");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 p-4 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <Edit3 className="h-5 w-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Edit Transaction
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label
              htmlFor="edit-type"
              className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Type
            </label>
            <select
              id="edit-type"
              value={formData.transaction_type}
              onChange={(e) =>
                setFormData({ ...formData, transaction_type: e.target.value as "income" | "expense" })
              }
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/20"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="edit-amount"
              className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Amount
            </label>
            <input
              type="number"
              id="edit-amount"
              step="0.01"
              min="0"
              required
              value={formData.amount || ""}
              onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/20"
              placeholder="0.00"
            />
          </div>

          <div>
            <label
              htmlFor="edit-description"
              className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Description
            </label>
            <input
              type="text"
              id="edit-description"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/20"
              placeholder="Groceries, Salary, etc."
            />
          </div>

          <CategorySelect
            categories={categories}
            value={formData.category_id || null}
            onChange={(value) => setFormData({ ...formData, category_id: value || undefined })}
            transactionType={formData.transaction_type || "expense"}
          />

          <div>
            <label
              htmlFor="edit-date"
              className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Date
            </label>
            <input
              type="date"
              id="edit-date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/20"
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:bg-indigo-400 dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:disabled:bg-indigo-400"
            >
              {isSubmitting ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
