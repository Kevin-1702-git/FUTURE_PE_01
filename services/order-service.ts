import { calculateOrderSummary } from "@/lib/utils";

export function buildDemoOrder() {
  const subtotal = 1248;
  return calculateOrderSummary(subtotal, 120);
}
