"use client";

import * as React from "react";
import {
  Wallet,
  ShoppingCart,
  Utensils,
  Car,
  Home,
  Briefcase,
  GraduationCap,
  Heart,
  Film,
  Music,
  Plane,
  Coffee,
  Smartphone,
  Dumbbell,
  Gamepad2,
  BookOpen,
  Zap,
  Droplets,
  Flame,
  ShoppingBag,
  PiggyBank,
  CreditCard,
  Banknote,
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCw,
  MoreHorizontal,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "./input";

const PRESET_ICONS: { name: string; icon: LucideIcon }[] = [
  { name: "wallet", icon: Wallet },
  { name: "shopping-cart", icon: ShoppingCart },
  { name: "utensils", icon: Utensils },
  { name: "car", icon: Car },
  { name: "home", icon: Home },
  { name: "briefcase", icon: Briefcase },
  { name: "graduation-cap", icon: GraduationCap },
  { name: "heart", icon: Heart },
  { name: "film", icon: Film },
  { name: "music", icon: Music },
  { name: "plane", icon: Plane },
  { name: "coffee", icon: Coffee },
  { name: "smartphone", icon: Smartphone },
  { name: "dumbbell", icon: Dumbbell },
  { name: "gamepad", icon: Gamepad2 },
  { name: "book", icon: BookOpen },
  { name: "zap", icon: Zap },
  { name: "droplets", icon: Droplets },
  { name: "flame", icon: Flame },
  { name: "shopping-bag", icon: ShoppingBag },
  { name: "piggy-bank", icon: PiggyBank },
  { name: "credit-card", icon: CreditCard },
  { name: "banknote", icon: Banknote },
  { name: "arrow-down-left", icon: ArrowDownLeft },
  { name: "arrow-up-right", icon: ArrowUpRight },
  { name: "refresh", icon: RefreshCw },
  { name: "more", icon: MoreHorizontal },
];

export interface IconPickerProps {
  value?: string;
  onChange: (icon: string) => void;
  className?: string;
}

export function IconPicker({ value, onChange, className }: IconPickerProps) {
  const [search, setSearch] = React.useState("");

  const filteredIcons = PRESET_ICONS.filter((icon) =>
    icon.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={cn("space-y-3", className)}>
      <Input
        type="text"
        placeholder="Search icons..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="grid grid-cols-6 gap-2 max-h-64 overflow-y-auto scrollbar-thin p-1">
        {PRESET_ICONS.map((item) => {
          const Icon = item.icon;
          const isSelected = value === item.name;
          return (
            <button
              key={item.name}
              type="button"
              onClick={() => onChange(item.name)}
              className={cn(
                "flex h-10 w-full items-center justify-center rounded-xl border-2 transition-all duration-200 hover:scale-105 active:scale-95",
                isSelected ? "border-[rgb(var(--primary))] bg-[rgb(var(--primary-bg))] text-[rgb(var(--primary))]" : "border-[rgb(var(--border))] hover:border-[rgb(var(--border-hover))]"
              )}
              aria-label={`Select icon ${item.name}`}
            >
              <Icon className="h-5 w-5" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
