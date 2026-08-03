import { SiteShell } from "@/components/layout/site-shell";
import { PageHero } from "@/components/layout/page-hero";
import { PartyOrderForm } from "@/components/sections/party-order-form";
import { ServiceGrid } from "@/components/sections/service-grid";

export default function CateringPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="Catering"
        title="Indoor, outdoor, office, wedding, and event catering with premium multi-cuisine menus"
        description="Feast Lane extends beyond the restaurant with scalable catering workflows and elegant presentation for every event type."
      />
      <ServiceGrid />
      <section className="section-shell pb-16 md:pb-24">
        <PartyOrderForm />
      </section>
    </SiteShell>
  );
}
