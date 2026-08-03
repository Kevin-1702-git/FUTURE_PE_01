import { SiteShell } from "@/components/layout/site-shell";
import { PageHero } from "@/components/layout/page-hero";
import { PartyOrderForm } from "@/components/sections/party-order-form";

export default function PartyOrdersPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="Party Orders"
        title="Celebrate birthdays, corporate events, and family functions with tailored menus"
        description="Capture event type, guest count, date, and budget to convert inquiries into profitable large-format orders."
      />
      <section className="section-shell pb-16 md:pb-24">
        <PartyOrderForm />
      </section>
    </SiteShell>
  );
}
