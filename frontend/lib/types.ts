// Category Types
export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  created_at: string;
  updated_at: string;
}

export interface CategoryCreate {
  name: string;
  color?: string;
  icon?: string;
}

export interface CategoryUpdate {
  name?: string;
  color?: string;
  icon?: string;
}

// Transaction Types
export interface CategorySummary {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  transaction_type: "income" | "expense";
  category_id: string | null;
  date: string;
  created_at: string;
  updated_at: string;
  category: CategorySummary | null;
}

export interface TransactionCreate {
  amount: number;
  description: string;
  transaction_type: "income" | "expense";
  category_id?: string;
  date?: string;
}

export interface TransactionUpdate {
  amount?: number;
  description?: string;
  transaction_type?: "income" | "expense";
  category_id?: string;
  date?: string;
}

export interface TransactionFilter {
  transaction_type?: "income" | "expense";
  category_id?: string;
  search?: string;
  start_date?: string;
  end_date?: string;
  skip?: number;
  limit?: number;
  sort_by?: "date" | "amount";
  sort_order?: "desc" | "asc";
}

// Analytics Types
export interface Summary {
  balance: number;
  total_income: number;
  total_expenses: number;
}

export interface SpendingByCategory {
  category_id: string;
  category_name: string;
  category_color: string;
  category_icon: string;
  amount: number;
}

export interface MonthlyTrend {
  month: string;
  income: number;
  expenses: number;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}
