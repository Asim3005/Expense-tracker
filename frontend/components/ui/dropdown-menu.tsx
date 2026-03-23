"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const DropdownMenuContext = React.createContext<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
}>({
  open: false,
  onOpenChange: () => null,
});

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);

  return (
    <DropdownMenuContext.Provider value={{ open, onOpenChange: setOpen }}>
      {children}
    </DropdownMenuContext.Provider>
  );
}

export function DropdownMenuTrigger({ children, asChild = false, ...props }: React.HTMLAttributes<HTMLButtonElement> & { asChild?: boolean }) {
  const { open, onOpenChange } = React.useContext(DropdownMenuContext);

  if (asChild) {
    const child = React.Children.only(children);
    if (React.isValidElement(child)) {
      return React.cloneElement(child as React.ReactElement<any>, {
        onClick: () => onOpenChange(!open),
        ...Object.assign({}, props),
        ...Object.assign({}, child.props),
      });
    }
    return <>{children}</>;
  }

  return (
    <button
      type="button"
      onClick={() => onOpenChange(!open)}
      {...props}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--ring-offset))] disabled:pointer-events-none disabled:opacity-50 active:scale-95",
        "hover:bg-[rgb(var(--background-muted))]",
        props.className
      )}
    >
      {children}
    </button>
  );
}

export function DropdownMenuContent({ children, align = "start", className }: { children: React.ReactNode; align?: "start" | "center" | "end"; className?: string }) {
  const { open, onOpenChange } = React.useContext(DropdownMenuContext);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onOpenChange(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  const alignClasses = {
    start: "left-0",
    center: "left-1/2 -translate-x-1/2",
    end: "right-0",
  };

  return (
    <div
      ref={dropdownRef}
      className={cn(
        "absolute z-50 min-w-[8rem] overflow-hidden rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--background-card))] p-1.5 shadow-lg animate-scale-in",
        alignClasses[align],
        className
      )}
    >
      {children}
    </div>
  );
}

export function DropdownMenuItem({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { onOpenChange } = React.useContext(DropdownMenuContext);

  return (
    <div
      onClick={() => onOpenChange(false)}
      className={cn(
        "relative flex cursor-pointer select-none items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-[rgb(var(--foreground-secondary))] outline-none transition-all duration-150 hover:bg-[rgb(var(--background-muted))] hover:text-[rgb(var(--foreground-primary))] active:scale-95",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function DropdownMenuSeparator() {
  return (
    <div className="my-1 h-px bg-[rgb(var(--border))]"></div>
  );
}
