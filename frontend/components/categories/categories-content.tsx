"use client";

import * as React from "react";
import { Category, CategoryCreate, CategoryUpdate } from "@/lib/types";
import { getCategories, createCategory, updateCategory, deleteCategory } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toaster";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { IconPicker } from "@/components/ui/icon-picker";
import { ColorPicker } from "@/components/ui/color-picker";
import { Plus, Trash2, MoreVertical, Loader2, FolderPlus } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function CategoriesContent() {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showDialog, setShowDialog] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState<Category | null>(null);
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());

  const [formName, setFormName] = React.useState("");
  const [formIcon, setFormIcon] = React.useState("tag");
  const [formColor, setFormColor] = React.useState("#3b82f6");

  const toast = useToast() as any;

  React.useEffect(() => {
    if (showDialog) {
      if (editingCategory) {
        setFormName(editingCategory.name);
        setFormIcon(editingCategory.icon);
        setFormColor(editingCategory.color);
      } else {
        setFormName("");
        setFormIcon("tag");
        setFormColor("#3b82f6");
      }
    }
  }, [showDialog, editingCategory]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      toast("Failed to load categories", "danger");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchCategories();
  }, []);

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setShowDialog(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory(id);
      toast("Category deleted successfully", "success");
      fetchCategories();
    } catch (error) {
      toast("Failed to delete category", "danger");
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const data: CategoryCreate | CategoryUpdate = {
        name: formName,
        icon: formIcon,
        color: formColor,
      };

      if (editingCategory) {
        await updateCategory(editingCategory.id, data as any);
        toast("Category updated successfully", "success");
      } else {
        await createCategory(data as CategoryCreate);
        toast("Category added successfully", "success");
      }

      setShowDialog(false);
      setEditingCategory(null);
      fetchCategories();
    } catch (error) {
      toast("Failed to save category", "danger");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-[rgb(var(--foreground-primary))]">Categories</h1>
          <p className="mt-1 text-sm text-[rgb(var(--foreground-muted))]">Organize your transactions with custom categories</p>
        </div>
        <Button onClick={() => setShowDialog(true)} size="lg"><Plus className="mr-2 h-5 w-5" /> Add Category</Button>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="skeleton h-32 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Card key={category.id} className="group overflow-hidden transition-all duration-200 hover:shadow-md hover-lift">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl shadow-sm" style={{ backgroundColor: `${category.color}15` }}>
                      <span className="text-lg">{category.icon}</span>
                    </div>
                    <CardTitle className="text-base">{category.name}</CardTitle>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4 text-[rgb(var(--foreground-muted))]" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(category)}>Edit</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-[rgb(var(--danger))]" onClick={() => handleDelete(category.id)}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-[rgb(var(--foreground-muted))]">{category.transactions_count || 0} transactions</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && categories.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[rgb(var(--background-muted))]">
            <FolderPlus className="h-8 w-8 text-[rgb(var(--foreground-muted))]" />
          </div>
          <p className="mt-4 text-sm font-medium text-[rgb(var(--foreground-primary))]">No categories yet</p>
          <p className="mt-1 text-xs text-[rgb(var(--foreground-muted))]">Create your first category to get started</p>
        </div>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog} size="md">
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCategory ? "Edit Category" : "Add Category"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-[rgb(var(--foreground-secondary))]">Name</label>
              <input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="e.g., Groceries" required className="flex h-10 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--background-card))] px-4 text-sm text-[rgb(var(--foreground-primary))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--ring-offset))] transition-all duration-200" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-[rgb(var(--foreground-secondary))]">Icon</label>
              <IconPicker value={formIcon} onChange={setFormIcon} />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-[rgb(var(--foreground-secondary))]">Color</label>
              <ColorPicker value={formColor} onChange={setFormColor} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => { setShowDialog(false); setEditingCategory(null); }}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : (editingCategory ? "Update Category" : "Create Category")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
