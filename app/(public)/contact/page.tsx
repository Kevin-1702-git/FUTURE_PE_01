import { MapPin, Phone, Timer, WalletCards } from "lucide-react";

import { SiteShell } from "@/components/layout/site-shell";
import { PageHero } from "@/components/layout/page-hero";
import { ContactForm } from "@/components/sections/contact-form";
import { Card } from "@/components/ui/card";
import { siteConfig } from "@/lib/site";

export default function ContactPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="Contact"
        title="Talk to Feast Lane for orders, reservations, catering, and customer support"
        description="Make the support experience as premium as the dining experience with clear contact details, fast enquiry forms, and location visibility."
      />
      <section className="section-shell grid gap-6 pb-16 md:grid-cols-[0.95fr_1.05fr] md:pb-24">
        <div className="space-y-6">
          <Card>
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <Phone className="mt-1 h-5 w-5 text-brand-primary" />
                <div>
                  <p className="font-semibold">Phone</p>
                  <p className="text-sm text-stone-600 dark:text-stone-300">{siteConfig.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 text-brand-primary" />
                <div>
                  <p className="font-semibold">Address</p>
                  <p className="text-sm text-stone-600 dark:text-stone-300">{siteConfig.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Timer className="mt-1 h-5 w-5 text-brand-primary" />
                <div>
                  <p className="font-semibold">Working Hours</p>
                  <p className="text-sm text-stone-600 dark:text-stone-300">{siteConfig.hours}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <WalletCards className="mt-1 h-5 w-5 text-brand-primary" />
                <div>
                  <p className="font-semibold">Payments</p>
                  <p className="text-sm text-stone-600 dark:text-stone-300">
                    UPI, Google Pay, PhonePe, Paytm, cards, net banking, wallets, and COD.
                  </p>
                </div>
              </div>
            </div>
          </Card>
          <Card className="min-h-[280px] bg-gradient-to-br from-orange-100 to-red-50 dark:from-stone-900 dark:to-stone-950">
            <div className="flex h-full items-center justify-center rounded-[24px] border border-dashed border-brand-primary/25 text-center text-sm text-stone-600 dark:text-stone-300">
              Google Maps API placeholder for restaurant location and delivery address support
            </div>
          </Card>
        </div>
        <ContactForm />
      </section>
    </SiteShell>
  );
}
