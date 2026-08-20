"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, Clock, CheckCircle2, IndianRupee, MessageSquare, UtensilsCrossed, Star } from "lucide-react";
import { AdminNav } from "@/components/dashboard/admin-nav";
import { PageHero } from "@/components/layout/page-hero";
import { SiteShell } from "@/components/layout/site-shell";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
    unreadMessages: 0,
    pendingCatering: 0,
    averageRating: 4.8
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("/api/admin/stats");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.stats) {
            setStats(data.stats);
          }
        }
      } catch (e) {
        console.warn("Failed to load admin stats:", e);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <SiteShell>
      <PageHero
        eyebrow="Restaurant Operations Control Center"
        title="Feast Lane Admin Dashboard"
        description="Monitor real-time customer orders, kitchen workflows, revenue analytics, customer inquiries, and menu availability."
      />
      <section className="section-shell space-y-8 pb-16 md:pb-24">
        <AdminNav />

        {/* Live DB Stats Cards Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6 border-l-4 border-l-brand-primary">
            <CardContent className="p-0 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">Total Orders</p>
                <p className="mt-2 text-3xl font-bold font-heading">{stats.totalOrders}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-brand-primary dark:bg-stone-800">
                <ShoppingBag className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="p-6 border-l-4 border-l-amber-500">
            <CardContent className="p-0 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">Pending Orders</p>
                <p className="mt-2 text-3xl font-bold font-heading text-amber-600">{stats.pendingOrders}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-stone-800">
                <Clock className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="p-6 border-l-4 border-l-emerald-500">
            <CardContent className="p-0 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">Completed Orders</p>
                <p className="mt-2 text-3xl font-bold font-heading text-emerald-600">{stats.completedOrders}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-stone-800">
                <CheckCircle2 className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="p-6 border-l-4 border-l-indigo-500">
            <CardContent className="p-0 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">Total Revenue</p>
                <p className="mt-2 text-2xl font-bold font-heading text-indigo-600">{formatCurrency(stats.totalRevenue)}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-stone-800">
                <IndianRupee className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 dark:bg-stone-800">
                <MessageSquare className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-stone-500">Unread Messages</p>
                <p className="text-2xl font-bold">{stats.unreadMessages}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-600 dark:bg-stone-800">
                <UtensilsCrossed className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-stone-500">Catering Enquiries</p>
                <p className="text-2xl font-bold">{stats.pendingCatering}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-500 dark:bg-stone-800">
                <Star className="h-6 w-6 fill-amber-400" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-stone-500">Avg Customer Rating</p>
                <p className="text-2xl font-bold">{stats.averageRating} / 5.0</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Operations Guide */}
        <Card className="p-8 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-stone-900 dark:to-stone-950">
          <h3 className="font-heading text-xl font-bold text-stone-900 dark:text-white mb-2">
            Restaurant Management Quick Links
          </h3>
          <p className="text-sm text-stone-600 dark:text-stone-300 mb-6">
            Use the top navigation bar to manage orders, customer inquiries, guest reviews, catering requests, and live digital menu items.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            <a href="/admin/orders" className="p-4 rounded-xl bg-white shadow-sm hover:shadow dark:bg-stone-800 transition">
              <p className="font-bold text-brand-primary">1. Manage Orders →</p>
              <p className="text-xs text-stone-500 mt-1">Accept, prepare, and dispatch orders</p>
            </a>
            <a href="/admin/messages" className="p-4 rounded-xl bg-white shadow-sm hover:shadow dark:bg-stone-800 transition">
              <p className="font-bold text-brand-primary">2. Reply Messages →</p>
              <p className="text-xs text-stone-500 mt-1">Respond to customer enquiries</p>
            </a>
            <a href="/admin/catering" className="p-4 rounded-xl bg-white shadow-sm hover:shadow dark:bg-stone-800 transition">
              <p className="font-bold text-brand-primary">3. Issue Quotes →</p>
              <p className="text-xs text-stone-500 mt-1">Accept catering & event proposals</p>
            </a>
            <a href="/admin/menu" className="p-4 rounded-xl bg-white shadow-sm hover:shadow dark:bg-stone-800 transition">
              <p className="font-bold text-brand-primary">4. Menu Management →</p>
              <p className="text-xs text-stone-500 mt-1">Add, edit, or toggle food items</p>
            </a>
          </div>
        </Card>
      </section>
    </SiteShell>
  );
}
