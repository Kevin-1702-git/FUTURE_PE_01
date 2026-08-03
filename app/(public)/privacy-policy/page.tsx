import { SiteShell } from "@/components/layout/site-shell";
import { PageHero } from "@/components/layout/page-hero";
import { Card } from "@/components/ui/card";

export default function PrivacyPolicyPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="Privacy Policy"
        title="Privacy and data handling for Feast Lane"
        description="This template policy covers account information, order details, reservations, payments, marketing communications, and analytics."
      />
      <section className="section-shell pb-16 md:pb-24">
        <Card className="space-y-5 text-sm leading-8 text-stone-600 dark:text-stone-300">
          <p>Feast Lane collects customer information required for order processing, reservations, account access, and support.</p>
          <p>Payment details should only be processed through secure payment gateways and never stored in raw form.</p>
          <p>Analytics and cookies may be used to improve navigation, recommendations, and operational performance.</p>
        </Card>
      </section>
    </SiteShell>
  );
}
