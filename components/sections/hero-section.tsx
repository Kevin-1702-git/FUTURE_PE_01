import Link from "next/link";
import { ArrowRight, CalendarCheck2, Star, Truck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { heroHighlights } from "@/lib/data/content";

export function HeroSection() {
  return (
    <section className="section-shell section-spacing">
      <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-8">
          <Badge>Luxury Dining. Digital Convenience.</Badge>
          <div className="space-y-6">
            <h1 className="font-heading text-5xl leading-tight md:text-7xl">
              Global Flavors. Premium Dining. Delivered with Heart.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-stone-600 dark:text-stone-300">
              Feast Lane brings together world cuisines, elevated hospitality, seamless ordering, and unforgettable dining experiences across dine-in, delivery, reservations, and catering.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/menu">
                Order Online
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/reservations">
                <CalendarCheck2 className="h-4 w-4" />
                Book a Table
              </Link>
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {heroHighlights.map((item, index) => (
              <div key={item} className="glass-panel rounded-[24px] p-4">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary">
                  {index === 0 ? <Star className="h-5 w-5" /> : <Truck className="h-5 w-5" />}
                </div>
                <p className="text-sm leading-6 text-stone-700 dark:text-stone-200">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel relative overflow-hidden rounded-[36px] p-8">
          <div className="absolute inset-0 bg-hero opacity-90" />
          <div className="relative space-y-6">
            <div className="rounded-[28px] bg-brand-dark/90 p-6 text-white shadow-soft">
              <p className="text-sm uppercase tracking-[0.22em] text-brand-secondary">Chef's Signature</p>
              <h2 className="mt-3 font-heading text-3xl">Today's Tasting Spread</h2>
              <p className="mt-3 text-sm leading-7 text-stone-200">
                Truffle paneer pizza, malabar prawn curry, teriyaki bowls, signature biryani, and handcrafted desserts.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[24px] bg-white/85 p-5 shadow-soft dark:bg-white/10">
                <p className="text-sm uppercase tracking-[0.2em] text-brand-primary">Fast Delivery</p>
                <p className="mt-2 text-3xl font-semibold">30-45 min</p>
              </div>
              <div className="rounded-[24px] bg-white/85 p-5 shadow-soft dark:bg-white/10">
                <p className="text-sm uppercase tracking-[0.2em] text-brand-primary">Reservation Slots</p>
                <p className="mt-2 text-3xl font-semibold">7 Daily</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
