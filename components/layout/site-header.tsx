import Image from "next/image";
import Link from "next/link";
import { Menu, Phone, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { navigation, siteConfig } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/40 bg-brand-background/80 backdrop-blur-xl dark:border-white/10 dark:bg-brand-dark/80">
      <div className="section-shell flex items-center justify-between gap-4 py-4">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="relative block h-11 w-11 shrink-0 overflow-hidden rounded-full ring-1 ring-brand-primary/15 sm:h-12 sm:w-12"
            aria-label="Feast Lane home"
          >
            <Image
              src="/images/branding/feast-lane-logo.png"
              alt="Feast Lane logo"
              fill
              sizes="(max-width: 640px) 44px, 48px"
              className="object-cover"
              priority
            />
          </Link>
          <div>
            <Link href="/" className="font-heading text-2xl font-semibold">
              Feast Lane
            </Link>
            <p className="text-xs uppercase tracking-[0.24em] text-stone-500">Premium Multi-Cuisine</p>
          </div>
        </div>

        <nav className="hidden items-center gap-6 lg:flex">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium text-stone-700 transition hover:text-brand-primary dark:text-stone-200">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link href={`tel:${siteConfig.phone}`} className="text-sm font-medium text-stone-600 dark:text-stone-200">
            <span className="inline-flex items-center gap-2">
              <Phone className="h-4 w-4 text-brand-primary" />
              {siteConfig.phone}
            </span>
          </Link>
          <ThemeToggle />
          <Button asChild variant="outline">
            <Link href="/menu">Explore Menu</Link>
          </Button>
          <Button asChild>
            <Link href="/customer/dashboard">
              <ShoppingBag className="h-4 w-4" />
              Order Online
            </Link>
          </Button>
        </div>

        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
