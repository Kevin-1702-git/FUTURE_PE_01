"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

import { MenuCard } from "@/components/menu/menu-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { menuItems } from "@/lib/data/menu-items";

export function MenuBrowser() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [type, setType] = useState("All");

  const categories = useMemo(() => ["All", ...new Set(menuItems.map((item) => item.category))], []);

  const filtered = useMemo(() => {
    return menuItems.filter((item) => {
      const searchMatch =
        query.length === 0 ||
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.cuisine.toLowerCase().includes(query.toLowerCase());

      const categoryMatch = category === "All" || item.category === category;
      const typeMatch = type === "All" || item.type === type;

      return searchMatch && categoryMatch && typeMatch;
    });
  }, [category, query, type]);

  return (
    <div className="space-y-8">
      <div className="glass-panel rounded-[28px] p-6">
        <div className="grid gap-4 md:grid-cols-[1.5fr_1fr_1fr]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-3.5 h-4 w-4 text-stone-400" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search dishes, cuisines, or cravings"
              className="pl-10"
            />
          </div>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="h-11 rounded-2xl border border-stone-200 bg-white/80 px-4 text-sm dark:border-white/10 dark:bg-white/5"
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
            className="h-11 rounded-2xl border border-stone-200 bg-white/80 px-4 text-sm dark:border-white/10 dark:bg-white/5"
          >
            <option value="All">All Types</option>
            <option value="Veg">Veg</option>
            <option value="Non-Veg">Non-Veg</option>
          </select>
        </div>
        <div className="mt-4 flex items-center gap-2 text-sm text-stone-600 dark:text-stone-300">
          <SlidersHorizontal className="h-4 w-4" />
          <span>{filtered.length} items matched</span>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {categories.slice(1, 9).map((entry) => (
            <button key={entry} type="button" onClick={() => setCategory(entry)}>
              <Badge className={category === entry ? "bg-brand-primary text-white" : ""}>{entry}</Badge>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col divide-y divide-stone-100 dark:divide-stone-800">
        {filtered.slice(0, 30).map((item) => (
          <div key={item.id} className="py-3">
            <MenuCard item={item} compact />
          </div>
        ))}
      </div>
    </div>
  );
}
