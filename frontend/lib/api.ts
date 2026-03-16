import {
  Transaction,
  TransactionCreate,
  TransactionUpdate,
  TransactionFilter,
  Category,
  CategoryCreate,
  CategoryUpdate,
  Summary,
  SpendingByCategory,
  MonthlyTrend,
} from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Fetch wrapper with error handling
async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API Error: ${response.status} - ${error}`);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

// Health Check
export async function healthCheck(): Promise<{ status: string }> {
  return fetchApi<{ status: string }>("/health");
}

// Transaction APIs
export async function getTransactions(
  filters?: TransactionFilter
): Promise<Transaction[]> {
  const params = new URLSearchParams();
  if (filters) {
    if (filters.transaction_type) params.append("transaction_type", filters.transaction_type);
    if (filters.category_id) params.append("category_id", filters.category_id);
    if (filters.search) params.append("search", filters.search);
    if (filters.start_date) params.append("start_date", filters.start_date);
    if (filters.end_date) params.append("end_date", filters.end_date);
    if (filters.skip !== undefined) params.append("skip", filters.skip.toString());
    if (filters.limit !== undefined) params.append("limit", filters.limit.toString());
    if (filters.sort_by) params.append("sort_by", filters.sort_by);
    if (filters.sort_order) params.append("sort_order", filters.sort_order);
  }

  const queryString = params.toString();
  return fetchApi<Transaction[]>(`/api/v1/transactions${queryString ? `?${queryString}` : ""}`);
}

export async function getTransaction(id: string): Promise<Transaction> {
  return fetchApi<Transaction>(`/api/v1/transactions/${id}`);
}

export async function createTransaction(data: TransactionCreate): Promise<Transaction> {
  return fetchApi<Transaction>("/api/v1/transactions", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateTransaction(
  id: string,
  data: TransactionUpdate
): Promise<Transaction> {
  return fetchApi<Transaction>(`/api/v1/transactions/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteTransaction(id: string): Promise<void> {
  return fetchApi<void>(`/api/v1/transactions/${id}`, {
    method: "DELETE",
  });
}

// Category APIs
export async function getCategories(): Promise<Category[]> {
  return fetchApi<Category[]>("/api/v1/categories");
}

export async function getCategory(id: string): Promise<Category> {
  return fetchApi<Category>(`/api/v1/categories/${id}`);
}

export async function createCategory(data: CategoryCreate): Promise<Category> {
  return fetchApi<Category>("/api/v1/categories", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateCategory(id: string, data: CategoryUpdate): Promise<Category> {
  return fetchApi<Category>(`/api/v1/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteCategory(id: string): Promise<void> {
  return fetchApi<void>(`/api/v1/categories/${id}`, {
    method: "DELETE",
  });
}

// Analytics APIs
export async function getSummary(
  startDate?: string,
  endDate?: string
): Promise<Summary> {
  const params = new URLSearchParams();
  if (startDate) params.append("start_date", startDate);
  if (endDate) params.append("end_date", endDate);

  const queryString = params.toString();
  return fetchApi<Summary>(`/api/v1/analytics/summary${queryString ? `?${queryString}` : ""}`);
}

export async function getSpendingByCategory(
  startDate?: string,
  endDate?: string
): Promise<SpendingByCategory[]> {
  const params = new URLSearchParams();
  if (startDate) params.append("start_date", startDate);
  if (endDate) params.append("end_date", endDate);

  const queryString = params.toString();
  return fetchApi<SpendingByCategory[]>(
    `/api/v1/analytics/spending-by-category${queryString ? `?${queryString}` : ""}`
  );
}

export async function getMonthlyTrend(months: number = 12): Promise<MonthlyTrend[]> {
  return fetchApi<MonthlyTrend[]>(`/api/v1/analytics/monthly-trend?months=${months}`);
}
