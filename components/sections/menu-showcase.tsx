import { MenuCard } from "@/components/menu/menu-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { getBestSellers, getFeaturedItems, getTodaysSpecials } from "@/services/menu-service";

export function MenuShowcase() {
  const featured = getFeaturedItems(4);
  const specials = getTodaysSpecials(4);
  const bestSellers = getBestSellers(4);
  const items = [...featured, ...specials, ...bestSellers].slice(0, 8);

  return (
    <section className="section-shell section-spacing">
      <SectionHeading
        eyebrow="Signature Menu"
        title="Featured dishes, today's specials, and best sellers in one curated lineup"
        description="Showcase the menu where it matters most, with rich imagery, strong price visibility, and clear dietary cues."
      />
      <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <MenuCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
