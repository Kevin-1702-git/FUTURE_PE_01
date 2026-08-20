export type UserRole = "CUSTOMER" | "RESTAURANT_ADMIN" | "ADMIN" | "MANAGER" | "STAFF";

export type FoodType = "Veg" | "Non-Veg";
export type SpiceLevel = "Mild" | "Medium" | "Hot" | "High";
export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "ACCEPTED"
  | "PREPARING"
  | "READY"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "COMPLETED"
  | "CANCELLED";
export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";
export type ReservationStatus = "PENDING" | "CONFIRMED" | "SEATED" | "COMPLETED" | "CANCELLED";

export interface MenuItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  cuisine: string;
  price: number;
  type: FoodType;
  calories: number;
  preparationTime: number;
  image: string;
  available: boolean;
  rating: number;
  spiceLevel: SpiceLevel;
  featured: boolean;
  bestSeller: boolean;
  todaysSpecial: boolean;
}

export interface CategoryStat {
  name: string;
  count: number;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  badge: string;
  code?: string;
  discount: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
}

export interface ServiceFeature {
  title: string;
  description: string;
  benefits: string[];
  idealFor: string;
}

export interface DashboardStat {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
}

export interface OrderSummary {
  subtotal: number;
  delivery: number;
  gst: number;
  discount: number;
  total: number;
}
