import { Crown, ShieldCheck, Sparkles, UtensilsCrossed } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { whyChooseUs } from "@/lib/data/content";

const icons = [UtensilsCrossed, Crown, ShieldCheck, Sparkles];

export function FeatureGrid() {
  return (
    <section className="section-shell section-spacing">
      <SectionHeading
        eyebrow="Why Choose Feast Lane"
        title="A premium restaurant system built around food, comfort, and convenience"
        description="From chef-driven menus and smooth online ordering to reservations, celebrations, and customer rewards, every touchpoint is designed to convert and delight."
        align="center"
      />
      <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {whyChooseUs.map((item, index) => {
          const Icon = icons[index % icons.length];
          return (
            <Card key={item}>
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">{item}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-7 text-stone-600 dark:text-stone-300">
                Experience a thoughtful balance of flavor, hospitality, and digital ease tailored for modern restaurant growth.
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
