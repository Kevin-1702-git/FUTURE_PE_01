import type { MetadataRoute } from "next";

const routes = [
  "",
  "/about",
  "/menu",
  "/services",
  "/offers",
  "/reservations",
  "/party-orders",
  "/catering",
  "/reviews",
  "/gallery",
  "/contact",
  "/privacy-policy",
  "/terms",
  "/refund-policy",
  "/login",
  "/register",
  "/forgot-password",
  "/customer/dashboard",
  "/admin/dashboard"
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `https://feastlane.example.com${route}`,
    lastModified: new Date("2026-08-03"),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.8
  }));
}
