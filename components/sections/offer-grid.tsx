import { Gift, PartyPopper, Percent, Sparkles } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { offers } from "@/lib/site";

const icons = [Gift, Percent, PartyPopper, Sparkles];

export function OfferGrid() {
  return (
    <section className="section-shell section-spacing">
      <SectionHeading
        eyebrow="Offers & Promotions"
        title="Conversion-friendly promotions designed for repeat visits and faster checkouts"
        description="Coupons, bundles, BOGO campaigns, and event perks turn casual visits into long-term customer behavior."
        align="center"
      />
      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        {offers.map((offer, index) => {
          const Icon = icons[index % icons.length];
          return (
            <Card key={offer.id} className="bg-gradient-to-br from-white to-orange-50 dark:from-stone-950 dark:to-stone-900">
              <CardHeader className="flex flex-row items-start justify-between">
                <div className="space-y-3">
                  <p className="text-sm uppercase tracking-[0.2em] text-brand-primary">{offer.badge}</p>
                  <CardTitle>{offer.title}</CardTitle>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-secondary/15 text-brand-secondary">
                  <Icon className="h-6 w-6" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-7 text-stone-600 dark:text-stone-300">{offer.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="rounded-full bg-brand-dark px-4 py-2 font-semibold text-white">{offer.discount}</span>
                  <span className="font-medium text-brand-primary">{offer.code}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
