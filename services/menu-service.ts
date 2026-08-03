import { menuItems } from "@/lib/data/menu-items";

export function getAllMenuItems() {
  return menuItems;
}

export function getFeaturedItems(limit = 8) {
  return menuItems.filter((item) => item.featured).slice(0, limit);
}

export function getBestSellers(limit = 8) {
  return menuItems.filter((item) => item.bestSeller).slice(0, limit);
}

export function getTodaysSpecials(limit = 8) {
  return menuItems.filter((item) => item.todaysSpecial).slice(0, limit);
}

export function getPopularCategories(limit = 8) {
  return [...new Set(menuItems.map((item) => item.category))].slice(0, limit);
}

export function getMenuFilters() {
  return {
    categories: [...new Set(menuItems.map((item) => item.category))],
    cuisines: [...new Set(menuItems.map((item) => item.cuisine))]
  };
}
