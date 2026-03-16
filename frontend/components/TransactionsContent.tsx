"use client";

import { useEffect, useState } from "react";
import { Transaction, Category, TransactionFilter } from "@/lib/types";
import { getTransactions, getCategories } from "@/lib/api";
import { TransactionForm } from "./TransactionForm";
import { TransactionList } from "./TransactionList";
import { Filter, X, ArrowUpDown } from "lucide-react";

export function TransactionsContent() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [optimisticDeletedIds, setOptimisticDeletedIds] = useState<Set<string>>(new Set());
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TransactionFilter>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const limit = 20;

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTransactions({
        ...filters,
        skip: page * limit,
        limit,
      });
      setTransactions(data);
      setOptimisticDeletedIds(new Set()); // Clear optimistic deletes on new data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load transactions");
      console.error("Error fetching transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOptimisticDelete = (id: string) => {
    setOptimisticDeletedIds((prev) => new Set(prev).add(id));
  };

  const handleDeleteFailed = (id: string) => {
    setOptimisticDeletedIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const filteredTransactions = transactions.filter(
    (t) => !optimisticDeletedIds.has(t.id)
  );

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [filters, page]);

  const handleFilterChange = (key: keyof TransactionFilter, value: any) => {
    setPage(0);
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setPage(0);
    setFilters({});
    setSearchTerm("");
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
            <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
              Filters
            </h3>
          </div>
          {(filters.transaction_type || filters.category_id || filters.search) && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              <X className="h-4 w-4" />
              Clear filters
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-4">
          {/* Type Filter */}
          <select
            value={filters.transaction_type || ""}
            onChange={(e) =>
              handleFilterChange(
                "transaction_type",
                e.target.value || undefined
              )
            }
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
          >
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          {/* Category Filter */}
          <select
            value={filters.category_id || ""}
            onChange={(e) =>
              handleFilterChange("category_id", e.target.value || undefined)
            }
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                handleFilterChange("search", e.target.value || undefined);
              }}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
            />
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
            <select
              value={`${filters.sort_by || "date"}-${filters.sort_order || "desc"}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split("-") as ["date" | "amount", "desc" | "asc"];
                handleFilterChange("sort_by", sortBy);
                handleFilterChange("sort_order", sortOrder);
              }}
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
            >
              <option value="date-desc">Date (Newest First)</option>
              <option value="date-asc">Date (Oldest First)</option>
              <option value="amount-desc">Amount (Highest First)</option>
              <option value="amount-asc">Amount (Lowest First)</option>
            </select>
          </div>

          {/* Add Transaction Button */}
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              + Add Transaction
            </button>
          )}
        </div>
      </div>

      {/* Add Transaction Form */}
      {showForm && (
        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <TransactionForm
            categories={categories}
            onSuccess={() => {
              setShowForm(false);
              fetchTransactions();
            }}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Transactions List */}
      {loading ? (
        <div className="text-center text-zinc-600 dark:text-zinc-400">
          Loading...
        </div>
      ) : (
        <>
          <TransactionList
          transactions={filteredTransactions}
          categories={categories}
          onRefresh={fetchTransactions}
          onOptimisticDelete={handleOptimisticDelete}
          onDeleteFailed={handleDeleteFailed}
        />

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Showing {page * limit + 1}-{Math.min((page + 1) * limit, transactions.length)} of {transactions.length} transactions
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={transactions.length < limit}
                className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
