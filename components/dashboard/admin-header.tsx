"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ShieldCheck, LogOut, LayoutDashboard, ShoppingBag, MessageSquare, Star, UtensilsCrossed, Utensils, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function AdminHeader() {
  const { data: session } = useSession();
  const roleName = (session?.user as any)?.role || "RESTAURANT_ADMIN";
  const userName = session?.user?.name || "Restaurant Admin";

  return (
    <header className="sticky top-0 z-50 border-b border-amber-500/20 bg-stone-900/95 text-white backdrop-blur-xl">
      <div className="section-shell flex items-center justify-between gap-4 py-3.5">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/dashboard"
            className="relative block h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-amber-500/40"
          >
            <Image
              src="/images/branding/feast-lane-logo.png"
              alt="Feast Lane logo"
              fill
              className="object-cover"
              priority
            />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading text-xl font-bold tracking-tight text-white">
                FEAST LANE
              </span>
              <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-400 border border-amber-500/30">
                Restaurant Portal
              </span>
            </div>
            <p className="text-xs text-stone-400">
              Logged in as: <strong className="text-amber-400">{userName}</strong> ({roleName}) • Main Branch
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
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
    </header>
  );
}
