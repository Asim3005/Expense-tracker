"use client";

import * as React from "react";
import { Category, CategoryCreate, CategoryUpdate } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { IconPicker } from "@/components/ui/icon-picker";
import { ColorPicker } from "@/components/ui/color-picker";
import { Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryFormProps {
  category?: Category;
  onSubmit: (data: CategoryCreate | CategoryUpdate) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function CategoryForm({ category, onSubmit, onCancel, isLoading }: CategoryFormProps) {
  const [name, setName] = React.useState(category?.name || "");
  const [icon, setIcon] = React.useState(category?.icon || "");
  const [color, setColor] = React.useState(category?.color || "#3b82f6");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return;

    const data = category
      ? ({
          name: name !== category.name ? name : undefined,
          icon: icon !== category.icon ? icon : undefined,
          color: color !== category.color ? color : undefined,
        } as CategoryUpdate)
      : ({
          name,
          icon: icon || undefined,
          color,
        } as CategoryCreate);

    await onSubmit(data);
    onCancel();
  };

  return (
    <Card className="p-6 hover-lift">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle>
          {category ? "Edit Category" : "New Category"}
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="h-4 w-4 text-[rgb(var(--foreground-muted))]" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-[rgb(var(--foreground-secondary))]">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Groceries"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="icon" className="text-[rgb(var(--foreground-secondary))]">
              Icon
            </Label>
            <IconPicker value={icon} onChange={setIcon} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="color" className="text-[rgb(var(--foreground-secondary))]">
              Color
            </Label>
            <ColorPicker value={color} onChange={setColor} />
          </div>

          {/* Preview */}
          {(name || icon || color) && (
            <div className="flex items-center gap-4 p-4 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--background-muted))]">
              {icon && (
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl shadow-sm"
                  style={{ backgroundColor: `${color}15` }}
                >
                  <span className="text-lg">{icon}</span>
                </div>
              )}
              <div>
                <p className="text-base font-medium text-[rgb(var(--foreground-primary))]">
                  {name || "Category Name"}
                </p>
                <p className="text-xs text-[rgb(var(--foreground-muted))]">
                  {color}
                </p>
              </div>
            </div>
          )}
        </form>

        <div className="flex gap-2 mt-2">
          <Button
            variant="outline"
            type="button"
            onClick={onCancel}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading || !name.trim()}
            className="flex-1"
            loading={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : category ? (
              "Update Category"
            ) : (
              "Create Category"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
