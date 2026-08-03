import { SiteShell } from "@/components/layout/site-shell";
import { PageHero } from "@/components/layout/page-hero";
import { Card } from "@/components/ui/card";

export default function RefundPolicyPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="Refund Policy"
        title="Refunds, cancellations, and payment issue handling"
        description="Use this template to formalize refund windows, failed payment handling, incorrect order reporting, and cancellation rules."
      />
      <section className="section-shell pb-16 md:pb-24">
        <Card className="space-y-5 text-sm leading-8 text-stone-600 dark:text-stone-300">
          <p>Eligible refunds should be processed for failed transactions, duplicate payments, or verified order issues based on policy rules.</p>
          <p>Cash on Delivery orders may be cancelled before food preparation begins, subject to restaurant operations.</p>
          <p>Refund timelines depend on the original payment method and bank processing cycle.</p>
        </Card>
      </section>
    </SiteShell>
  );
}
