import { Category } from "@/lib/types";

interface CategorySelectProps {
  categories: Category[];
  value: string | null;
  onChange: (value: string | null) => void;
  transactionType: "income" | "expense";
}

export function CategorySelect({
  categories,
  value,
  onChange,
  transactionType,
}: CategorySelectProps) {
  // Filter categories by transaction type (simple heuristic for now)
  const filteredCategories = categories;

  return (
    <div>
      <label
        htmlFor="category"
        className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
      >
        Category
      </label>
      <select
        id="category"
        value={value || ""}
        onChange={(e) => onChange(e.target.value || null)}
        className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/20"
      >
        <option value="">No category</option>
        {filteredCategories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
}
