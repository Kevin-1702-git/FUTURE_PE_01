"use client";

import { useState } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterCard() {
  const [email, setEmail] = useState("");

  return (
    <section className="section-shell pb-16 md:pb-24">
      <div className="rounded-[32px] bg-brand-dark p-8 text-white md:p-12">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.24em] text-brand-secondary">Newsletter</p>
            <h2 className="font-heading text-4xl">Get offers first</h2>
            <p className="max-w-2xl text-stone-300">
              Subscribe for new menu drops, limited-time combos, student deals, and festive tasting menus.
            </p>
          </div>
          <form
            className="flex flex-col gap-3 sm:flex-row"
            onSubmit={(event) => {
              event.preventDefault();
              toast.success(`Subscribed ${email || "guest"} to Feast Lane updates`);
              setEmail("");
            }}
          >
            <Input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              placeholder="Enter your email"
              className="border-white/10 bg-white/10 text-white placeholder:text-stone-400"
            />
            <Button type="submit" variant="secondary">
              Subscribe
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
