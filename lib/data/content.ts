import { menuItems } from "@/lib/data/menu-items";
import type { CategoryStat, DashboardStat } from "@/types";

export const heroHighlights = [
  "224 crafted dishes across global cuisines",
  "Luxury dine-in atmosphere with family-friendly warmth",
  "Fast delivery, easy reservations, and event-ready catering"
];

export const whyChooseUs = [
  "Fresh ingredients sourced and prepared daily",
  "Experienced chefs across Indian and international cuisines",
  "Strict hygiene, packaging, and kitchen safety standards",
  "Fast delivery backed by smooth digital ordering",
  "Elegant dining spaces for families, couples, and guests",
  "Party, catering, and reservation support under one brand",
  "Flexible payments including UPI, cards, and COD",
  "Reward-driven customer accounts for repeat ordering"
];

export const faqs = [
  {
    question: "What cuisines do you serve?",
    answer:
      "We serve Indian, North Indian, South Indian, Italian, Chinese, Japanese, Mexican, grill specialties, seafood, desserts, and beverages."
  },
  {
    question: "Can I order online?",
    answer: "Yes. Feast Lane supports delivery and takeaway ordering directly through the website."
  },
  {
    question: "Do you provide home delivery?",
    answer: "Yes. We provide hygienic home delivery across supported Chennai zones."
  },
  {
    question: "Can I reserve a table online?",
    answer: "Yes. Guests can reserve tables with date, time, guest count, and special requests."
  },
  {
    question: "Do you provide catering and party orders?",
    answer:
      "Yes. We support birthdays, weddings, corporate events, family functions, and bulk orders with tailored menus."
  }
];

export const galleryImages = [
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=80"
];

export const reservationTimeSlots = [
  "11:30 AM",
  "1:00 PM",
  "2:30 PM",
  "5:30 PM",
  "7:00 PM",
  "8:30 PM",
  "10:00 PM"
];

export const dashboardStats: DashboardStat[] = [
  { label: "Today's Revenue", value: "₹86,400", change: "+12.4%", trend: "up" },
  { label: "Monthly Revenue", value: "₹18.2L", change: "+8.1%", trend: "up" },
  { label: "Today's Orders", value: "184", change: "+9.6%", trend: "up" },
  { label: "Reservations", value: "42", change: "-3.1%", trend: "down" }
];

export const customerStats: DashboardStat[] = [
  { label: "Orders Placed", value: "18", change: "+3 this month", trend: "up" },
  { label: "Reward Points", value: "1,240", change: "+180", trend: "up" },
  { label: "Saved Dishes", value: "12", change: "+2", trend: "up" },
  { label: "Reservations", value: "4", change: "Next: Friday", trend: "up" }
];

export const categoryStats: CategoryStat[] = Array.from(
  menuItems.reduce((map, item) => {
    map.set(item.category, (map.get(item.category) ?? 0) + 1);
    return map;
  }, new Map<string, number>())
).map(([name, count]) => ({ name, count }));
