import { SiteShell } from "@/components/layout/site-shell";
import { PageHero } from "@/components/layout/page-hero";
import { ServiceGrid } from "@/components/sections/service-grid";
import { CtaBanner } from "@/components/sections/cta-banner";

export default function ServicesPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="Services"
        title="Dine-in, delivery, reservations, party orders, catering, and takeaway under one system"
        description="Feast Lane supports multiple service lines with consistent UX, premium branding, and conversion-focused journeys."
      />
      <ServiceGrid />
      <CtaBanner />
    </SiteShell>
  );
}
