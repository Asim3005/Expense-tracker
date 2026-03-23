import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--background-card))] px-4 py-3 text-sm text-[rgb(var(--foreground-primary))] ring-offset-2 placeholder:text-[rgb(var(--foreground-muted))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--ring-offset))] disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 resize-none",
          error && "border-[rgb(var(--danger))] focus-visible:ring-[rgb(var(--danger))]",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
