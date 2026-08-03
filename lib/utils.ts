import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

export function formatCompactNumber(value: number) {
  return new Intl.NumberFormat("en-IN", {
    notation: "compact",
    maximumFractionDigits: 1
  }).format(value);
}

export function slugToTitle(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function calculateOrderSummary(subtotal: number, discount = 0): {
  subtotal: number;
  delivery: number;
  gst: number;
  discount: number;
  total: number;
} {
  const delivery = subtotal > 799 ? 0 : 49;
  const gst = Math.round(subtotal * 0.05);
  const total = subtotal + delivery + gst - discount;

  return { subtotal, delivery, gst, discount, total };
}
