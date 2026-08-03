import { SiteShell } from "@/components/layout/site-shell";
import { PageHero } from "@/components/layout/page-hero";
import { OfferGrid } from "@/components/sections/offer-grid";

export default function OffersPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="Offers"
        title="Promotions built to increase repeat ordering, larger baskets, and celebration bookings"
        description="Weekend combos, BOGO campaigns, student offers, and birthday perks make the platform more compelling without diluting the premium brand."
      />
      <OfferGrid />
    </SiteShell>
  );
}
