import { SiteShell } from "@/components/layout/site-shell";
import { PageHero } from "@/components/layout/page-hero";
import { ReservationForm } from "@/components/sections/reservation-form";

export default function ReservationsPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="Reservations"
        title="Book your table in minutes"
        description="Capture guest details, preferred timing, party size, and special requests with a polished reservation experience backed by confirmation workflows."
      />
      <section className="section-shell pb-16 md:pb-24">
        <ReservationForm />
      </section>
    </SiteShell>
  );
}
