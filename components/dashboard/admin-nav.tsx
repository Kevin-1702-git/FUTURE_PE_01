"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { LayoutDashboard, ShoppingBag, MessageSquare, Star, UtensilsCrossed, Utensils, ShieldCheck, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminNav() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const roleName = (session?.user as any)?.role || "RESTAURANT_ADMIN";
  const userName = session?.user?.name || "Restaurant Admin";

  const links = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/orders", label: "Orders Management", icon: ShoppingBag },
    { href: "/admin/messages", label: "Messages & Support", icon: MessageSquare },
    { href: "/admin/reviews", label: "Customer Reviews", icon: Star },
    { href: "/admin/catering", label: "Catering Requests", icon: UtensilsCrossed },
    { href: "/admin/menu", label: "Menu Management", icon: Utensils }
  ];

  return (
    <div className="space-y-4 mb-8">
      {/* Restaurant Admin Portal Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-stone-900 p-5 text-white shadow-lg border border-amber-500/30">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-stone-950 font-bold shadow-md">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading text-xl font-bold tracking-tight text-white">FEAST LANE</h2>
              <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-amber-400 border border-amber-500/30">
                Restaurant Portal
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-0.5">
              Logged in as: <strong className="text-amber-400">{userName}</strong> ({roleName}) • Branch: <strong>Feast Lane Main Branch</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="text-stone-300 hover:bg-stone-800 hover:text-white gap-1.5 text-xs font-semibold"
          >
            <LogOut className="h-4 w-4 text-rose-400" />
            Logout Staff
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 bg-white/60 p-2.5 backdrop-blur-md dark:border-stone-800 dark:bg-stone-900/60 rounded-2xl">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                isActive
                  ? "bg-brand-primary text-white shadow-md"
                  : "text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
