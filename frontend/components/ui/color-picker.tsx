"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "./input";

const PRESET_COLORS = [
  "#ef4444", // Red
  "#f97316", // Orange
  "#eab308", // Yellow
  "#22c55e", // Green
  "#06b6d4", // Cyan
  "#3b82f6", // Blue
  "#8b5cf6", // Violet
  "#ec4899", // Pink
  "#64748b", // Slate
];

export interface ColorPickerProps {
  value?: string;
  onChange: (color: string) => void;
  className?: string;
}

export function ColorPicker({ value, onChange, className }: ColorPickerProps) {
  const [customColor, setCustomColor] = React.useState("");

  return (
    <div className={cn("space-y-3", className)}>
      <div className="grid grid-cols-5 gap-2">
        {PRESET_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            className={cn(
              "h-10 w-full rounded-xl border-2 transition-all duration-200 hover:scale-105 active:scale-95",
              value === color ? "border-[rgb(var(--ring))] scale-105 ring-2 ring-[rgb(var(--ring))]" : "border-[rgb(var(--border))] hover:border-[rgb(var(--border-hover))]"
            )}
            style={{ backgroundColor: color }}
            aria-label={`Select color ${color}`}
          />
        ))}
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <input
            type="color"
            value={value || customColor || "#3b82f6"}
            onChange={(e) => {
              setCustomColor(e.target.value);
              onChange(e.target.value);
            }}
            className="h-10 w-full cursor-pointer rounded-xl border-0 p-0"
          />
        </div>
        <Input
          type="text"
          value={value || customColor}
          onChange={(e) => {
            setCustomColor(e.target.value);
            onChange(e.target.value);
          }}
          placeholder="#3b82f6"
          className="w-32"
        />
      </div>
    </div>
  );
}
