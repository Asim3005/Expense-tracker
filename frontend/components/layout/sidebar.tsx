"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Receipt,
  BarChart3,
  FolderTree,
  Wallet,
  Settings,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Transactions", href: "/transactions", icon: Receipt },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Categories", href: "/categories", icon: FolderTree },
  { name: "Budget", href: "/budget", icon: Wallet },
  { name: "Settings", href: "/settings", icon: Settings },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { isMobile, isTablet } = useBreakpoints();

  // Auto-collapse on tablet
  React.useEffect(() => {
    if (isTablet) {
      setCollapsed(true);
    } else if (isMobile) {
      setCollapsed(false);
    } else {
      setCollapsed(false);
    }
  }, [isTablet, isMobile]);

  // Close mobile drawer when route changes
  React.useEffect(() => {
    if (isMobile) {
      setMobileOpen(false);
    }
  }, [pathname, isMobile]);

  const sidebarWidth = collapsed ? "w-16" : "w-64";

  if (isMobile) {
    // Mobile drawer
    return (
      <>
        {/* Mobile Header */}
        <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between border-b border-[rgb(var(--border))] bg-[rgb(var(--background-card))] px-4 py-3 lg:hidden safe-top">
          <div className="flex items-center gap-2.5">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-5 w-5 text-[rgb(var(--foreground-primary))]" />
            </Button>
            <Link href="/" className="flex items-center gap-2.5 font-semibold text-[rgb(var(--foreground-primary))]">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[rgb(var(--primary))]">
                <Wallet className="h-4.5 w-4.5 text-white" />
              </div>
              <span className="text-lg">FinTrack</span>
            </Link>
          </div>
        </header>

        {/* Mobile Drawer Overlay */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden animate-fade-in"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Mobile Drawer */}
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-72 bg-[rgb(var(--background-card))] border-r border-[rgb(var(--border))] shadow-2xl transition-transform duration-300 ease-in-out lg:hidden safe-left",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex h-16 items-center justify-between border-b border-[rgb(var(--border))] px-6">
            <Link href="/" className="flex items-center gap-2.5 font-semibold text-[rgb(var(--foreground-primary))]">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[rgb(var(--primary))]">
                <Wallet className="h-4.5 w-4.5 text-white" />
              </div>
              <span className="text-lg">FinTrack</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen(false)}
            >
              <X className="h-5 w-5 text-[rgb(var(--foreground-muted))]" />
            </Button>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-6 overflow-y-auto scrollbar-thin">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 group",
                    isActive
                      ? "bg-[rgb(var(--primary))] text-white shadow-md"
                      : "text-[rgb(var(--foreground-secondary))] hover:bg-[rgb(var(--background-muted))]"
                  )}
                >
                  <Icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </>
    );
  }

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-30 h-screen border-r border-[rgb(var(--border))] bg-[rgb(var(--background-card))] shadow-sm transition-all duration-300 sidebar-transition",
        sidebarWidth,
        className
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-[rgb(var(--border))] px-6">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2.5 font-semibold text-[rgb(var(--foreground-primary))]">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[rgb(var(--primary))]">
              <Wallet className="h-4.5 w-4.5 text-white" />
            </div>
            <span className="text-lg">FinTrack</span>
          </Link>
        )}
        {collapsed && (
          <Link href="/" className="flex items-center justify-center w-full">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[rgb(var(--primary))]">
              <Wallet className="h-4.5 w-4.5 text-white" />
            </div>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto hidden sm:flex"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5 text-[rgb(var(--foreground-muted))]" />
          ) : (
            <ChevronLeft className="h-5 w-5 text-[rgb(var(--foreground-muted))]" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-6 overflow-y-auto scrollbar-thin">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 group",
                isActive
                  ? "bg-[rgb(var(--primary))] text-white shadow-md"
                  : "text-[rgb(var(--foreground-secondary))] hover:bg-[rgb(var(--background-muted))] hover:text-[rgb(var(--foreground-primary))]"
              )}
              title={collapsed ? item.name : undefined}
            >
              <Icon className="h-5 w-5 shrink-0 group-hover:scale-110 transition-transform" />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="border-t border-[rgb(var(--border))] p-6">
          <p className="text-xs text-[rgb(var(--foreground-muted))]">
            © {new Date().getFullYear()} FinTrack
          </p>
        </div>
      )}
    </aside>
  );
}

export function MainContent({ children, className }: { children: React.ReactNode; className?: string }) {
  const { isMobile, isTablet } = useBreakpoints();

  // Adjust padding based on sidebar state
  const sidebarWidth = isMobile ? "0" : isTablet ? "4rem" : "16rem";

  return (
    <main
      className={cn(
        "min-h-screen bg-[rgb(var(--background))] transition-all duration-300",
        !isMobile && "pt-0",
        className
      )}
      style={{
        marginLeft: isMobile ? "0" : sidebarWidth,
        paddingLeft: isMobile ? "0" : "0",
        paddingBottom: isMobile ? "4.5rem" : "0",
      }}
    >
      <div className="p-4 sm:p-6 lg:p-8 safe-top">
        {children}
      </div>
    </main>
  );
}

// Helper hook for breakpoints
function useBreakpoints() {
  const [isMobile, setIsMobile] = React.useState(false);
  const [isTablet, setIsTablet] = React.useState(false);
  const [isDesktop, setIsDesktop] = React.useState(true);

  React.useEffect(() => {
    const checkBreakpoints = () => {
      setIsMobile(window.innerWidth < 640);
      setIsTablet(window.innerWidth >= 641 && window.innerWidth <= 1024);
      setIsDesktop(window.innerWidth >= 1025);
    };

    checkBreakpoints();
    window.addEventListener("resize", checkBreakpoints);

    return () => window.removeEventListener("resize", checkBreakpoints);
  }, []);

  return { isMobile, isTablet, isDesktop };
}
