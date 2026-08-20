"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, Loader2 } from "lucide-react";

import { MenuCard } from "@/components/menu/menu-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import type { MenuItem } from "@/types";
import { menuItems as localFallback } from "@/lib/data/menu-items";

export function MenuBrowser() {
  const [items, setItems] = useState<MenuItem[]>(localFallback);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [type, setType] = useState("All");

  useEffect(() => {
    async function loadMenu() {
      try {
        const res = await fetch("/api/menu");
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.data) && data.data.length > 0) {
            setItems(data.data);
          }
        }
      } catch (e) {
        console.warn("Could not fetch menu from API, using fallback", e);
      } finally {
        setLoading(false);
      }
    }
    loadMenu();
  }, []);

  const categories = useMemo(() => ["All", ...new Set(items.map((item) => item.category))], [items]);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const searchMatch =
        query.length === 0 ||
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.cuisine.toLowerCase().includes(query.toLowerCase());

      const categoryMatch = category === "All" || item.category.toLowerCase() === category.toLowerCase();
      const typeMatch = type === "All" || item.type.toLowerCase() === type.toLowerCase();

      return searchMatch && categoryMatch && typeMatch;
    });
  }, [items, category, query, type]);

  return (
    <div className="space-y-8">
      <div className="glass-panel rounded-[28px] p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-[1.5fr_1fr_1fr]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-3.5 h-4 w-4 text-stone-400" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search dishes, cuisines, or cravings (e.g. Biryani, Parotta, Tikka...)"
              className="pl-10"
            />
          </div>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="h-11 rounded-2xl border border-stone-200 bg-white/80 px-4 text-sm dark:border-white/10 dark:bg-stone-900"
          >
            {categories.map((entry) => (
              <option key={entry} value={entry}>
                {entry}
              </option>
            ))}
          </select>
          <select
            value={type}
            onChange={(event) => setType(event.target.value)}
            className="h-11 rounded-2xl border border-stone-200 bg-white/80 px-4 text-sm dark:border-white/10 dark:bg-stone-900"
          >
            <option value="All">All Types</option>
            <option value="Veg">Veg</option>
            <option value="Non-Veg">Non-Veg</option>
          </select>
        </div>
        <div className="mt-4 flex items-center justify-between text-sm text-stone-600 dark:text-stone-300">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-brand-primary" />
            <span>
              Showing <strong className="text-brand-primary">{filtered.length}</strong> of {items.length} items
            </span>
          </div>
          {loading && (
            <span className="flex items-center gap-1 text-xs text-stone-400">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Syncing live menu...
            </span>
          )}
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {categories.slice(0, 14).map((entry) => (
            <button key={entry} type="button" onClick={() => setCategory(entry)}>
              <Badge
                className={
                  category === entry
                    ? "bg-brand-primary text-white"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300"
                }
              >
                {entry}
              </Badge>
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <MenuCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
