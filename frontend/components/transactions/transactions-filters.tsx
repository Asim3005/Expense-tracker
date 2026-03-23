"use client";

import * as React from "react";
import { TransactionFilter, Category } from "@/lib/types";
import { Search, Filter, X, ArrowUpDown, Calendar, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/lib/hooks/use-debounce";

interface TransactionsFiltersProps {
  filters: TransactionFilter;
  categories: Category[];
  onFilterChange: (filters: TransactionFilter) => void;
  onClear: () => void;
}

export function TransactionsFilters({
  filters,
  categories,
  onFilterChange,
  onClear,
}: TransactionsFiltersProps) {
  const [searchTerm, setSearchTerm] = React.useState(filters.search || "");
  const debouncedSearch = useDebounce(searchTerm, 300);

  React.useEffect(() => {
    onFilterChange({ ...filters, search: debouncedSearch || undefined });
  }, [debouncedSearch]);

  const handleFilterChange = (key: keyof TransactionFilter, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const hasActiveFilters =
    filters.transaction_type ||
    filters.category_id ||
    filters.search ||
    filters.start_date ||
    filters.end_date ||
    filters.min_amount ||
    filters.max_amount;

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-[rgb(var(--foreground-muted))]" />
          <h3 className="text-sm font-medium text-[rgb(var(--foreground-primary))]">
            Filters
          </h3>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="text-[rgb(var(--foreground-muted))] text-xs"
          >
            <X className="mr-1.5 h-3.5 w-3.5" />
            Clear filters
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[rgb(var(--foreground-muted))]" />
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Type Filter */}
        <div>
          <Select
            value={filters.transaction_type || ""}
            onChange={(e) =>
              handleFilterChange("transaction_type", e.target.value || undefined)
            }
          >
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </Select>
        </div>

        {/* Category Filter */}
        <div>
          <Select
            value={filters.category_id || ""}
            onChange={(e) =>
              handleFilterChange("category_id", e.target.value || undefined)
            }
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </Select>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4 text-[rgb(var(--foreground-muted))]" />
          <Select
            value={`${filters.sort_by || "date"}-${filters.sort_order || "desc"}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split("-") as [
                "date" | "amount",
                "desc" | "asc"
              ];
              onFilterChange({ ...filters, sort_by: sortBy, sort_order: sortOrder });
            }}
            className="w-auto"
          >
            <option value="date-desc">Date (Newest)</option>
            <option value="date-asc">Date (Oldest)</option>
            <option value="amount-desc">Amount (High)</option>
            <option value="amount-asc">Amount (Low)</option>
          </Select>
        </div>

        {/* Date Range */}
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-[rgb(var(--foreground-muted))]" />
          <Input
            type="date"
            value={filters.start_date || ""}
            onChange={(e) =>
              handleFilterChange("start_date", e.target.value || undefined)
            }
            className="w-auto"
          />
          <span className="text-sm text-[rgb(var(--foreground-muted))]">to</span>
          <Input
            type="date"
            value={filters.end_date || ""}
            onChange={(e) =>
              handleFilterChange("end_date", e.target.value || undefined)
            }
            className="w-auto"
          />
        </div>

        {/* Amount Range */}
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-[rgb(var(--foreground-muted))]" />
          <div className="flex items-center gap-2 flex-1">
            <Input
              type="number"
              placeholder="Min"
              value={filters.min_amount || ""}
              onChange={(e) =>
                handleFilterChange(
                  "min_amount",
                  e.target.value ? parseFloat(e.target.value) : undefined
                )
              }
              className="w-20"
            />
            <span className="text-sm text-[rgb(var(--foreground-muted))]">-</span>
            <Input
              type="number"
              placeholder="Max"
              value={filters.max_amount || ""}
              onChange={(e) =>
                handleFilterChange(
                  "max_amount",
                  e.target.value ? parseFloat(e.target.value) : undefined
                )
              }
              className="w-20"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
