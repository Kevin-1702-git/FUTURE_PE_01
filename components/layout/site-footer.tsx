import Link from "next/link";

import { navigation, siteConfig } from "@/lib/site";

const legalLinks = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms" },
  { href: "/refund-policy", label: "Refund Policy" }
];

export function SiteFooter() {
  return (
    <footer className="border-t border-white/40 bg-brand-dark text-stone-100">
      <div className="section-shell grid gap-12 py-16 md:grid-cols-4">
        <div className="space-y-4">
          <h3 className="font-heading text-3xl">Feast Lane</h3>
          <p className="text-sm leading-7 text-stone-300">
            Premium multi-cuisine restaurant in Chennai for dine-in, delivery, reservations, catering, and celebrations.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-secondary">Quick Links</h4>
          <div className="mt-4 grid gap-3 text-sm">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href} className="text-stone-300 hover:text-white">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-secondary">Support</h4>
          <div className="mt-4 grid gap-3 text-sm text-stone-300">
            <p>{siteConfig.phone}</p>
            <p>{siteConfig.email}</p>
            <p>{siteConfig.address}</p>
            <p>{siteConfig.hours}</p>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-secondary">Legal</h4>
          <div className="mt-4 grid gap-3 text-sm">
            {legalLinks.map((item) => (
              <Link key={item.href} href={item.href} className="text-stone-300 hover:text-white">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="section-shell flex flex-col gap-3 py-5 text-sm text-stone-400 md:flex-row md:items-center md:justify-between">
          <p>Copyright © 2026 Feast Lane. All rights reserved.</p>
          <p>Built for Vercel, Neon PostgreSQL, Next.js 15, and Prisma.</p>
        </div>
      </div>
    </footer>
  );
}
