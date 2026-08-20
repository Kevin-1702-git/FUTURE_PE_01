"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, Check, X, Search, Loader2, Sparkles, Star, Flame } from "lucide-react";
import toast from "react-hot-toast";

import { AdminNav } from "@/components/dashboard/admin-nav";
import { PageHero } from "@/components/layout/page-hero";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/utils";
import type { MenuItem } from "@/types";

export default function AdminMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<MenuItem> | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchMenu = async () => {
    try {
      const res = await fetch("/api/menu");
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setItems(data.data || []);
        }
      }
    } catch (e) {
      console.warn("Fetch admin menu error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const categories = ["All", ...new Set(items.map((i) => i.category))];

  const filteredItems = items.filter((item) => {
    const matchCat = selectedCategory === "All" || item.category === selectedCategory;
    const matchSearch =
      search === "" ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleOpenAddModal = () => {
    setEditingItem({
      name: "",
      description: "",
      category: "Appetizers",
      cuisine: "Indian",
      price: 250,
      type: "Veg",
      calories: 320,
      preparationTime: 18,
      spiceLevel: "Medium",
      image: "",
      available: true,
      featured: false,
      bestSeller: false,
      todaysSpecial: false
    });
    setSelectedImage(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setSelectedImage(null);
    setIsModalOpen(true);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.name || !editingItem?.price || !editingItem?.category) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setSaving(true);
    try {
      let image = editingItem.image || "/images/menu-placeholder.svg";
      if (selectedImage) {
        const formData = new FormData();
        formData.append("file", selectedImage);
        const uploadResponse = await fetch("/api/menu/upload", {
          method: "POST",
          body: formData
        });
        const uploadData = await uploadResponse.json();
        if (!uploadResponse.ok || !uploadData.success || !uploadData.url) {
          throw new Error(uploadData.message || "Image upload failed.");
        }
        image = uploadData.url;
      }

      const res = await fetch("/api/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...editingItem, image })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`Dish "${editingItem.name}" saved successfully!`);
        setIsModalOpen(false);
        setEditingItem(null);
        setSelectedImage(null);
        fetchMenu();
      } else {
        toast.error(data.message || "Failed to save item.");
      }
    } catch (err) {
      toast.error("An error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleBadge = async (item: MenuItem, field: "available" | "featured" | "bestSeller" | "todaysSpecial") => {
    const updated = { ...item, [field]: !item[field] };
    try {
      const res = await fetch("/api/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated)
      });

      if (res.ok) {
        toast.success(`Updated ${field} for ${item.name}`);
        setItems((prev) => prev.map((i) => (i.id === item.id ? updated : i)));
      }
    } catch (e) {
      toast.error("Failed to update.");
    }
  };

  const handleDeleteItem = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}" from the menu?`)) return;

    try {
      const res = await fetch(`/api/menu?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success(`Deleted ${name}`);
        setItems((prev) => prev.filter((i) => i.id !== id));
      } else {
        toast.error("Failed to delete item.");
      }
    } catch (e) {
      toast.error("An error occurred.");
    }
  };

  return (
    <SiteShell>
      <PageHero
        eyebrow="Menu Catalog Control"
        title="Restaurant Menu Management"
        description="Add new signature dishes, adjust pricing, toggle stock availability, set featured badges, and manage category listings."
      />
      <section className="section-shell space-y-8 pb-16 md:pb-24">
        <AdminNav />

        {/* Top Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 flex-1 max-w-2xl">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
              <Input
                placeholder="Search dish name or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-10 rounded-xl border border-stone-200 bg-white px-3 text-sm dark:border-white/10 dark:bg-stone-900"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <Button onClick={handleOpenAddModal} className="font-bold gap-2">
            <Plus className="h-4 w-4" /> Add New Dish
          </Button>
        </div>

        {/* Items Table / Grid */}
        {loading ? (
          <div className="py-16 text-center text-stone-500">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-brand-primary" />
            <p className="mt-2 text-sm">Loading catalog items...</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => (
              <Card key={item.id} className="p-4 flex flex-col justify-between space-y-3 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-stone-100">
                    <Image
                      src={item.image || "/images/default-dish.jpg"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <Badge className="bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300 text-[10px]">
                        {item.category}
                      </Badge>
                      <span className="font-bold text-brand-primary text-base">
                        {formatCurrency(item.price)}
                      </span>
                    </div>
                    <h4 className="font-heading text-lg font-bold truncate mt-1">{item.name}</h4>
                    <p className="text-xs text-stone-500 line-clamp-2 mt-0.5">{item.description}</p>
                  </div>
                </div>

                {/* Badge Toggles */}
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-stone-100 dark:border-stone-800 text-xs">
                  <button
                    type="button"
                    onClick={() => handleToggleBadge(item, "available")}
                    className={`px-2 py-0.5 rounded-full font-semibold transition ${
                      item.available
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                    }`}
                  >
                    {item.available ? "In Stock" : "Out of Stock"}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleBadge(item, "featured")}
                    className={`px-2 py-0.5 rounded-full font-semibold transition ${
                      item.featured
                        ? "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
                        : "bg-stone-100 text-stone-400 dark:bg-stone-800"
                    }`}
                  >
                    ★ Featured
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleBadge(item, "bestSeller")}
                    className={`px-2 py-0.5 rounded-full font-semibold transition ${
                      item.bestSeller
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                        : "bg-stone-100 text-stone-400 dark:bg-stone-800"
                    }`}
                  >
                    Best Seller
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleBadge(item, "todaysSpecial")}
                    className={`px-2 py-0.5 rounded-full font-semibold transition ${
                      item.todaysSpecial
                        ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                        : "bg-stone-100 text-stone-400 dark:bg-stone-800"
                    }`}
                  >
                    Today Special
                  </button>
                </div>

                {/* Edit & Delete Actions */}
                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenEditModal(item)}
                    className="h-8 gap-1 text-xs"
                  >
                    <Edit2 className="h-3.5 w-3.5" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteItem(item.id, item.name)}
                    className="h-8 text-xs text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Add/Edit Modal */}
        {isModalOpen && editingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
            <Card className="w-full max-w-2xl p-6 space-y-5 bg-white dark:bg-stone-900 my-8">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3 dark:border-stone-800">
                <h3 className="font-heading text-xl font-bold">
                  {editingItem.id ? `Edit Dish: ${editingItem.name}` : "Add New Menu Dish"}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-stone-400 hover:text-stone-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveItem} className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="name">Dish Name *</Label>
                  <Input
                    id="name"
                    value={editingItem.name || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    placeholder="e.g. Malabar Chicken Parotta Roll"
                    required
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    rows={3}
                    value={editingItem.description || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                    placeholder="Rich description of ingredients, spices, and cooking technique..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Input
                    id="category"
                    value={editingItem.category || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    placeholder="e.g. Parotta, Biryani, Appetizers..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cuisine">Cuisine *</Label>
                  <Input
                    id="cuisine"
                    value={editingItem.cuisine || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, cuisine: e.target.value })}
                    placeholder="e.g. South Indian, Global, Italian..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={editingItem.price || 0}
                    onChange={(e) => setEditingItem({ ...editingItem, price: Number(e.target.value) })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Dietary Type *</Label>
                  <select
                    id="type"
                    value={editingItem.type || "Veg"}
                    onChange={(e) => setEditingItem({ ...editingItem, type: e.target.value as any })}
                    className="w-full h-10 rounded-xl border border-stone-200 bg-white px-3 text-sm dark:border-white/10 dark:bg-stone-900"
                  >
                    <option value="Veg">Veg</option>
                    <option value="Non-Veg">Non-Veg</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="calories">Calories (cal)</Label>
                  <Input
                    id="calories"
                    type="number"
                    value={editingItem.calories || 300}
                    onChange={(e) => setEditingItem({ ...editingItem, calories: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prepTime">Preparation Time (mins)</Label>
                  <Input
                    id="prepTime"
                    type="number"
                    value={editingItem.preparationTime || 20}
                    onChange={(e) => setEditingItem({ ...editingItem, preparationTime: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="imageFile">Food Image</Label>
                  <Input
                    id="imageFile"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
                  />
                  <p className="text-xs text-stone-500">
                    {selectedImage ? `Selected: ${selectedImage.name}` : editingItem.image ? `Current image: ${editingItem.image}` : "Choose a food image to upload."}
                  </p>
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="image">Stored Image Path</Label>
                  <Input
                    id="image"
                    value={editingItem.image || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, image: e.target.value })}
                    placeholder="Uploaded image path appears here after saving"
                  />
                </div>

                <div className="flex flex-wrap gap-4 sm:col-span-2 pt-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={editingItem.available !== false}
                      onChange={(e) => setEditingItem({ ...editingItem, available: e.target.checked })}
                    />
                    Available in Stock
                  </label>

                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={editingItem.featured || false}
                      onChange={(e) => setEditingItem({ ...editingItem, featured: e.target.checked })}
                    />
                    Featured Dish
                  </label>

                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={editingItem.bestSeller || false}
                      onChange={(e) => setEditingItem({ ...editingItem, bestSeller: e.target.checked })}
                    />
                    Best Seller
                  </label>

                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={editingItem.todaysSpecial || false}
                      onChange={(e) => setEditingItem({ ...editingItem, todaysSpecial: e.target.checked })}
                    />
                    Today's Special
                  </label>
                </div>

                <div className="sm:col-span-2 flex justify-end gap-3 pt-4 border-t border-stone-100 dark:border-stone-800">
                  <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Save Menu Item"}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}
      </section>
    </SiteShell>
  );
}
