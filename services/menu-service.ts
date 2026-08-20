import { menuItems as localMenuItems } from "@/lib/data/menu-items";
import { prisma } from "@/lib/prisma";
import type { MenuItem } from "@/types";

export async function getAllMenuItems(): Promise<MenuItem[]> {
  try {
    const dbItems = await prisma.menuItem.findMany({
      orderBy: { createdAt: "desc" }
    });
    if (dbItems && dbItems.length > 0) {
      return dbItems.map((item) => ({
        ...item,
        category: item.categoryLabel || "General",
        type: item.type === "Veg" ? "Veg" : "Non-Veg",
        spiceLevel: (item.spiceLevel as any) || "Medium"
      })) as any[];
    }
  } catch (e) {
    console.warn("DB lookup error in menu-service, returning local items fallback:", e);
  }
  return localMenuItems;
}

export async function getFeaturedItems(limit = 8): Promise<MenuItem[]> {
  const items = await getAllMenuItems();
  return items.filter((item) => item.featured).slice(0, limit);
}

export async function getBestSellers(limit = 8): Promise<MenuItem[]> {
  const items = await getAllMenuItems();
  return items.filter((item) => item.bestSeller).slice(0, limit);
}

export async function getTodaysSpecials(limit = 8): Promise<MenuItem[]> {
  const items = await getAllMenuItems();
  return items.filter((item) => item.todaysSpecial).slice(0, limit);
}

export async function getPopularCategories(limit = 8) {
  const items = await getAllMenuItems();
  return [...new Set(items.map((item) => item.category))].slice(0, limit);
}

export async function getMenuFilters() {
  const items = await getAllMenuItems();
  return {
    categories: [...new Set(items.map((item) => item.category))],
    cuisines: [...new Set(items.map((item) => item.cuisine))]
  };
}
