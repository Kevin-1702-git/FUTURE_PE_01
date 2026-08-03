import type { Offer, ServiceFeature, Testimonial } from "@/types";

export const siteConfig = {
  name: "Feast Lane",
  description:
    "Premium multi-cuisine restaurant in Chennai for dine-in, online ordering, reservations, catering, and celebrations.",
  url: "https://feastlane.example.com",
  ogImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
  phone: "9876543210",
  email: "feastlane@gmail.com",
  address: "Chennai, Tamil Nadu",
  hours: "11:00 AM - 11:30 PM",
  social: {
    instagram: "https://instagram.com/feastlane",
    facebook: "https://facebook.com/feastlane",
    x: "https://x.com/feastlane",
    youtube: "https://youtube.com/@feastlane"
  }
};

export const navigation = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/services", label: "Services" },
  { href: "/offers", label: "Offers" },
  { href: "/reservations", label: "Reservations" },
  { href: "/catering", label: "Catering" },
  { href: "/reviews", label: "Reviews" },
  { href: "/contact", label: "Contact" }
];

export const offers: Offer[] = [
  {
    id: "offer-weekend",
    title: "Weekend Family Feast",
    description: "Starters, mains, breads, desserts, and drinks for four.",
    badge: "Weekend Combo",
    code: "FAMILY20",
    discount: "20% Off"
  },
  {
    id: "offer-bogo",
    title: "Buy 1 Get 1 Mocktails",
    description: "Pair up your favorite coolers during evening hours.",
    badge: "BOGO",
    code: "CHEERS",
    discount: "Buy 1 Get 1"
  },
  {
    id: "offer-student",
    title: "Student Saver Plates",
    description: "Budget-friendly meals for college breaks and study nights.",
    badge: "Student",
    code: "STUDENT10",
    discount: "10% Off"
  },
  {
    id: "offer-birthday",
    title: "Birthday Celebration Perks",
    description: "Complimentary dessert and group dining savings on your special day.",
    badge: "Birthday",
    code: "BIRTHDAY",
    discount: "Free Dessert"
  }
];

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Meera Krishnan",
    role: "Family Dining Guest",
    rating: 5,
    quote:
      "The menu had something for everyone, the service felt genuinely warm, and the setting made our family dinner feel special from the moment we arrived."
  },
  {
    id: "t2",
    name: "Karthik Iyer",
    role: "Corporate Customer",
    rating: 5,
    quote:
      "We placed a large office order and everything was on time, beautifully packed, and consistently delicious. Feast Lane has become our go-to for team lunches."
  },
  {
    id: "t3",
    name: "Priya Nair",
    role: "Anniversary Guest",
    rating: 5,
    quote:
      "Elegant ambiance, memorable dishes, and thoughtful hospitality. Feast Lane strikes the right balance between premium dining and comfort."
  }
];

export const serviceFeatures: ServiceFeature[] = [
  {
    title: "Dine In",
    description: "Enjoy a polished restaurant experience in a warm, design-led setting.",
    benefits: ["Premium ambiance", "Tables for couples and families", "Attentive hospitality"],
    idealFor: "Date nights, business lunches, family dinners"
  },
  {
    title: "Home Delivery",
    description: "Fast, hygienic, and trackable delivery across Chennai service zones.",
    benefits: ["Live order tracking", "Secure packaging", "Quick repeat orders"],
    idealFor: "Busy professionals, students, family dinners at home"
  },
  {
    title: "Reservations",
    description: "Reserve your preferred slot and skip the waiting line.",
    benefits: ["Date and time slots", "Special requests", "Confirmation emails"],
    idealFor: "Weekends, birthdays, corporate hosting"
  },
  {
    title: "Catering & Party Orders",
    description: "Scalable menus for birthdays, weddings, office events, and festive gatherings.",
    benefits: ["Custom menus", "Bulk ordering", "Indoor and outdoor service"],
    idealFor: "Event planners, families, businesses"
  }
];
