"use client";

import { useMemo, useState } from "react";

import { menuItems } from "@/lib/data/menu-items";

export function useCart() {
  const [ids, setIds] = useState<string[]>(["FL-001", "FL-005", "FL-120"]);

  const items = useMemo(() => menuItems.filter((item) => ids.includes(item.id)), [ids]);
  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.price, 0), [items]);

  return {
    items,
    subtotal,
    addItem: (id: string) => setIds((current) => [...current, id]),
    removeItem: (id: string) => setIds((current) => current.filter((entry) => entry !== id))
  };
}
