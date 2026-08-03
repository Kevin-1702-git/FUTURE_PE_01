import { siteConfig } from "@/lib/site";

export function buildRestaurantSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: siteConfig.name,
    image: siteConfig.ogImage,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Chennai",
      addressRegion: "Tamil Nadu",
      addressCountry: "IN"
    },
    telephone: siteConfig.phone,
    servesCuisine: ["Indian", "Italian", "Chinese", "Japanese", "Mexican", "Seafood"],
    url: siteConfig.url
  };
}
