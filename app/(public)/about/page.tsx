import { SiteShell } from "@/components/layout/site-shell";
import { PageHero } from "@/components/layout/page-hero";
import { FeatureGrid } from "@/components/sections/feature-grid";
import { GalleryGrid } from "@/components/sections/gallery-grid";
import { ServiceGrid } from "@/components/sections/service-grid";

export default function AboutPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="About Us"
        title="A premium multi-cuisine restaurant designed to serve great food and create great memories"
        description="Feast Lane combines fresh ingredients, experienced chefs, hygienic kitchen practices, and warm hospitality in one scalable restaurant management experience."
      />
      <FeatureGrid />
      <ServiceGrid />
      <GalleryGrid />
    </SiteShell>
  );
}
