import { SiteShell } from "@/components/layout/site-shell";
import { PageHero } from "@/components/layout/page-hero";
import { Card } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="Terms"
        title="Website, ordering, and service terms"
        description="This template outlines ordering eligibility, reservation behavior, cancellations, account use, pricing, and promotional conditions."
      />
      <section className="section-shell pb-16 md:pb-24">
        <Card className="space-y-5 text-sm leading-8 text-stone-600 dark:text-stone-300">
          <p>Orders are subject to availability, delivery zone serviceability, and payment confirmation where applicable.</p>
          <p>Reservations may be released after reasonable waiting periods if the guest does not arrive.</p>
          <p>Promotions and coupon codes may be time-bound, outlet-specific, or restricted to selected categories.</p>
        </Card>
      </section>
    </SiteShell>
  );
}
