import Link from "next/link";

import { Button } from "@/components/ui/button";

export function CtaBanner() {
  return (
    <section className="section-shell pb-16 md:pb-24">
      <div className="glass-panel overflow-hidden rounded-[36px] p-8 md:p-12">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr] lg:items-center">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.24em] text-brand-primary">Order. Reserve. Celebrate.</p>
            <h2 className="font-heading text-4xl leading-tight md:text-5xl">Craving something exceptional today?</h2>
            <p className="max-w-3xl text-base leading-8 text-stone-600 dark:text-stone-300">
              Order online, reserve your table, or talk to our team about catering and party packages. Feast Lane is built to serve everyday cravings and once-in-a-lifetime celebrations with the same care.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Button asChild size="lg">
              <Link href="/menu">Order Food Now</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/reservations">Reserve a Table</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/contact">Call the Restaurant</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
