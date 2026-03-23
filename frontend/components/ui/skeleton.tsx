import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("skeleton rounded-xl", className)}
      {...props}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-[rgb(var(--border))] p-6">
      <div className="space-y-3">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-8 w-1/2" />
      </div>
    </div>
  );
}

export function SkeletonRow({ cells = 4 }: { cells?: number }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl border border-[rgb(var(--border))]">
      {Array.from({ length: cells }).map((_, i) => (
        <Skeleton key={i} className="h-4 w-full max-w-[150px]" />
      ))}
    </div>
  );
}
