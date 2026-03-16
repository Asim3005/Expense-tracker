import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    positive: boolean;
  };
}

export function StatsCard({ title, value, icon: Icon, trend }: StatsCardProps) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            {title}
          </p>
          <p className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            {value}
          </p>
        </div>
        <div className="rounded-full bg-zinc-100 p-3 dark:bg-zinc-800">
          <Icon className="h-6 w-6 text-zinc-600 dark:text-zinc-400" />
        </div>
      </div>
      {trend && (
        <div className="mt-4">
          <span
            className={`text-sm font-medium ${
              trend.positive ? "text-emerald-600" : "text-red-600"
            }`}
          >
            {trend.value}
          </span>
        </div>
      )}
    </div>
  );
}
