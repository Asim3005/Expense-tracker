import * as React from "react";
import { cn } from "@/lib/utils";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          "flex h-10 w-full appearance-none rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--background-card))] px-4 text-sm text-[rgb(var(--foreground-primary))] ring-offset-2 placeholder:text-[rgb(var(--foreground-muted))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--ring-offset))] disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 pr-10",
          error && "border-[rgb(var(--danger))] focus-visible:ring-[rgb(var(--danger))]",
          "bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22rgb(var(--foreground-muted))%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200-13-5.4H18.4c-5%200%209.3%201.8-12.9%205.4-1.27l1.27%201.27l4.75%204.75l9.75-9.75z%22%2F%3E%3C%2Fsvg%3E')]",
          "bg-[length:1.25em_1.25em] bg-[position:right_0.75em_center] bg-[no-repeat]",
          className
        )}
        {...props}
      >
        {children}
      </select>
    );
  }
);
Select.displayName = "Select";

export { Select };
