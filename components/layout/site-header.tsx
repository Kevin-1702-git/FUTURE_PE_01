"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { LogOut, Menu, Phone, ShoppingBag, User as UserIcon, ShieldAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { navigation, siteConfig } from "@/lib/site";
import { useCart } from "@/context/cart-context";

export function SiteHeader() {
  const { data: session } = useSession();
  const { items } = useCart();
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const role = (session?.user as any)?.role;
  const isStaff = role === "RESTAURANT_ADMIN" || role === "ADMIN" || role === "MANAGER" || role === "STAFF";

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
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-stone-700 transition hover:text-brand-primary dark:text-stone-200"
            >
              {item.label}
            </Link>
          ))}
          {isStaff && (
            <Link
              href="/admin/dashboard"
              className="text-sm font-semibold text-amber-600 transition hover:underline dark:text-amber-400"
            >
              Restaurant Dashboard
            </Link>
          )}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link href={`tel:${siteConfig.phone}`} className="text-sm font-medium text-stone-600 dark:text-stone-200">
            <span className="inline-flex items-center gap-2">
              <Phone className="h-4 w-4 text-brand-primary" />
              {siteConfig.phone}
            </span>
          </Link>
          <ThemeToggle />

          <Button asChild variant="outline" className="relative">
            <Link href="/cart" className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-primary text-xs font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>
          </Button>

          {session ? (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link href={isStaff ? "/admin/dashboard" : "/customer/dashboard"} className="flex items-center gap-1.5">
                  <UserIcon className="h-4 w-4 text-brand-primary" />
                  <span className="max-w-[100px] truncate">{session.user?.name || "Account"}</span>
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut({ callbackUrl: "/" })}
                title="Logout"
                className="text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Link href="/cart" className="relative p-2 text-stone-700 dark:text-stone-200">
            <ShoppingBag className="h-6 w-6" />
            {cartCount > 0 && (
              <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-brand-primary text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>
          <Button variant="ghost" size="sm">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
