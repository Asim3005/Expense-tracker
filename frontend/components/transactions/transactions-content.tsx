"use client";

import * as React from "react";
import { Transaction, Category, TransactionFilter, TransactionUpdate } from "@/lib/types";
import {
  getTransactions,
  getCategories,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "@/lib/api";
import { TransactionsTable } from "./transactions-table";
import { TransactionsFilters } from "./transactions-filters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Edit2, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/toaster";
import { formatCurrency } from "@/lib/utils";

export function TransactionsContent() {
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [filters, setFilters] = React.useState<TransactionFilter>({});
  const [page, setPage] = React.useState(0);
  const [sortBy, setSortBy] = React.useState<"date" | "amount">("date");
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("desc");
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());

  // Add/Edit Transaction
  const [showAddDialog, setShowAddDialog] = React.useState(false);
  const [editingTransaction, setEditingTransaction] = React.useState<Transaction | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState({
    description: "",
    amount: "",
    transaction_type: "expense" as "income" | "expense",
    category_id: "",
    date: new Date().toISOString().split("T")[0],
  });

  // Delete Confirmation
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const toast = useToast() as any;
  const limit = 20;

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTransactions({
        ...filters,
        skip: page * limit,
        limit,
        sort_by: sortBy,
        sort_order: sortOrder,
      });
      setTransactions(data);
      setSelectedIds(new Set());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load transactions");
      console.error("Error fetching transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
  }, []);

  React.useEffect(() => {
    fetchTransactions();
  }, [filters, page, sortBy, sortOrder]);

  const handleFilterChange = (newFilters: TransactionFilter) => {
    setPage(0);
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setPage(0);
    setFilters({});
    setSortBy("date");
    setSortOrder("desc");
  };

  const handleSort = (field: "date" | "amount") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(transactions.map((t) => t.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectId = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      description: transaction.description,
      amount: transaction.amount.toString(),
      transaction_type: transaction.transaction_type,
      category_id: transaction.category_id || "",
      date: transaction.date,
    });
    setShowAddDialog(true);
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;

    try {
      await deleteTransaction(deletingId);
      toast("Transaction deleted successfully", "success");
      fetchTransactions();
    } catch (error) {
      console.error("Failed to delete transaction:", error);
      toast("Failed to delete transaction", "danger");
    } finally {
      setShowDeleteDialog(false);
      setDeletingId(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;

    try {
      await Promise.all(Array.from(selectedIds).map((id) => deleteTransaction(id)));
      toast(`${selectedIds.size} transaction(s) deleted successfully`, "success");
      setSelectedIds(new Set());
      fetchTransactions();
    } catch (error) {
      console.error("Failed to delete transactions:", error);
      toast("Failed to delete transactions", "danger");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data: TransactionUpdate = {
        description: formData.description,
        amount: parseFloat(formData.amount),
        transaction_type: formData.transaction_type,
        category_id: formData.category_id || undefined,
        date: formData.date,
      };

      if (editingTransaction) {
        await updateTransaction(editingTransaction.id, data);
        toast("Transaction updated successfully", "success");
      } else {
        await createTransaction(data as any);
        toast("Transaction added successfully", "success");
      }

      setShowAddDialog(false);
      setEditingTransaction(null);
      setFormData({
        description: "",
        amount: "",
        transaction_type: "expense",
        category_id: "",
        date: new Date().toISOString().split("T")[0],
      });
      fetchTransactions();
    } catch (error) {
      console.error("Failed to save transaction:", error);
      toast("Failed to save transaction", "danger");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-[rgb(var(--foreground-primary))]">
            Transactions
          </h1>
          <p className="mt-1 text-sm text-[rgb(var(--foreground-muted))]">
            Manage and track your income and expenses
          </p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} size="lg">
          <Plus className="mr-2 h-5 w-5" />
          Add Transaction
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-6 hover-lift">
        <TransactionsFilters
          filters={filters}
          categories={categories}
          onFilterChange={handleFilterChange}
          onClear={handleClearFilters}
        />
      </Card>

      {/* Error Message */}
      {error && (
        <Card className="border-[rgb(var(--danger-border))] bg-[rgb(var(--danger-bg))]">
          <CardContent className="p-6">
            <p className="text-sm text-[rgb(var(--danger))]">{error}</p>
            <Button
              onClick={fetchTransactions}
              variant="outline"
              className="mt-4 border-[rgb(var(--danger))] text-[rgb(var(--danger))] hover:bg-[rgb(var(--danger))] hover:text-[rgb(var(--danger-foreground))]"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Transactions Table */}
      <TransactionsTable
        transactions={transactions}
        categories={categories}
        selectedIds={selectedIds}
        onSelectAll={handleSelectAll}
        onSelectId={handleSelectId}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onBulkDelete={handleBulkDelete}
        onSort={handleSort}
        sortBy={sortBy}
        sortOrder={sortOrder}
        loading={loading}
      />

      {/* Pagination */}
      {transactions.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-[rgb(var(--foreground-muted))]">
            Showing {page * limit + 1}-{Math.min((page + 1) * limit, transactions.length)} of{" "}
            {transactions.length} transactions
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => setPage((p) => p + 1)}
              disabled={transactions.length < limit}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog} size="md">
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTransaction ? "Edit Transaction" : "Add Transaction"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g., Groceries"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                  required
                  min="0"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  id="type"
                  value={formData.transaction_type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      transaction_type: e.target.value as "income" | "expense",
                    })
                  }
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  id="category"
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                >
                  <option value="">No category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowAddDialog(false);
                  setEditingTransaction(null);
                  setFormData({
                    description: "",
                    amount: "",
                    transaction_type: "expense",
                    category_id: "",
                    date: new Date().toISOString().split("T")[0],
                  });
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : editingTransaction ? (
                  <>
                    <Edit2 className="mr-2 h-4 w-4" />
                    Update
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog} size="sm">
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Transaction</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-[rgb(var(--foreground-secondary))]">
            Are you sure you want to delete this transaction? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
