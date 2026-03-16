"use client";

import { useState } from "react";
import { TransactionCreate, Category } from "@/lib/types";
import { createTransaction } from "@/lib/api";
import { CategorySelect } from "./CategorySelect";

interface TransactionFormProps {
  categories: Category[];
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function TransactionForm({ categories, onSuccess, onCancel }: TransactionFormProps) {
  const [formData, setFormData] = useState<TransactionCreate>({
    amount: 0,
    description: "",
    transaction_type: "expense",
    category_id: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await createTransaction({
        ...formData,
        amount: Number(formData.amount),
        category_id: formData.category_id || undefined,
      });
      setFormData({
        amount: 0,
        description: "",
        transaction_type: "expense",
        category_id: "",
        date: new Date().toISOString().split("T")[0],
      });
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create transaction");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="type"
          className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Type
        </label>
        <select
          id="type"
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
          htmlFor="amount"
          className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Amount
        </label>
        <input
          type="number"
          id="amount"
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
          htmlFor="description"
          className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Description
        </label>
        <input
          type="text"
          id="description"
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
        onChange={(value) => setFormData({ ...formData, category_id: value || "" })}
        transactionType={formData.transaction_type}
      />

      <div>
        <label
          htmlFor="date"
          className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Date
        </label>
        <input
          type="date"
          id="date"
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

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:bg-indigo-400 dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:disabled:bg-indigo-400"
        >
          {isSubmitting ? "Adding..." : "Add Transaction"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
