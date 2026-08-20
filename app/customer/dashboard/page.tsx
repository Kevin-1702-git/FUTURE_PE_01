"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ShoppingBag, Star, Clock, User, MapPin, Phone, Mail, ArrowRight, Heart } from "lucide-react";

import { SiteShell } from "@/components/layout/site-shell";
import { PageHero } from "@/components/layout/page-hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/cart-context";
import { formatCurrency } from "@/lib/utils";

export default function CustomerDashboardPage() {
  const { data: session } = useSession();
  const { items } = useCart();

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await fetch("/api/orders");
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setOrders(data.data || []);
          }
        }
      } catch (e) {
        console.warn("Error loading customer dashboard orders:", e);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  const totalSpent = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  return (
    <SiteShell>
      <PageHero
        eyebrow="Personal Workspace"
        title={`Welcome back, ${session?.user?.name || "Guest Customer"}`}
        description="Track live order status, view past receipts, access saved addresses, and manage your Feast Lane account."
      />
      <section className="section-shell space-y-8 pb-16 md:pb-24">
        {/* Customer Stats Cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase text-stone-500">Total Orders</p>
                <p className="mt-2 text-3xl font-bold font-heading">{orders.length}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-brand-primary dark:bg-stone-800">
                <ShoppingBag className="h-6 w-6" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase text-stone-500">Active Cart Items</p>
                <p className="mt-2 text-3xl font-bold font-heading text-brand-primary">
                  {items.reduce((s, i) => s + i.quantity, 0)}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary">
                <ShoppingBag className="h-6 w-6" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase text-stone-500">Total Spent</p>
                <p className="mt-2 text-2xl font-bold font-heading text-emerald-600">
                  {formatCurrency(totalSpent)}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-stone-800">
                <Star className="h-6 w-6" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase text-stone-500">Feast Rewards</p>
                <p className="mt-2 text-3xl font-bold font-heading text-amber-500">
                  {Math.round(totalSpent / 10)} pts
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-500 dark:bg-stone-800">
                <Heart className="h-6 w-6 fill-amber-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* Profile Card & Recent Orders Grid */}
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Customer Profile Details */}
          <Card className="p-6 space-y-5">
            <h3 className="font-heading text-xl font-bold border-b border-stone-100 pb-3 dark:border-stone-800 flex items-center justify-between">
              <span>Account Profile</span>
              <Badge className="bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20">
                {(session?.user as any)?.role || "CUSTOMER"}
              </Badge>
            </h3>

            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-brand-primary shrink-0" />
                <div>
                  <p className="text-xs text-stone-500">Full Name</p>
                  <p className="font-semibold">{session?.user?.name || "Customer"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-brand-primary shrink-0" />
                <div>
                  <p className="text-xs text-stone-500">Email Address</p>
                  <p className="font-semibold">{session?.user?.email || "customer@feastlane.com"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-brand-primary shrink-0" />
                <div>
                  <p className="text-xs text-stone-500">Phone Number</p>
                  <p className="font-semibold">{(session?.user as any)?.phone || "+91 98765 12345"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-brand-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-stone-500">Default Delivery Address</p>
                  <p className="font-medium text-stone-700 dark:text-stone-300">
                    124 Grand Trunk Road, Anna Nagar, Chennai, TN 600040
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button asChild className="w-full">
                <Link href="/cart">Go to Cart ({items.length})</Link>
              </Button>
            </div>
          </Card>

          {/* Recent Orders Overview */}
          <Card className="p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3 dark:border-stone-800">
              <h3 className="font-heading text-xl font-bold">Recent Orders</h3>
              <Button asChild variant="outline" size="sm">
                <Link href="/customer/orders" className="flex items-center gap-1 text-xs">
                  View All ({orders.length}) <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>

            {orders.length === 0 ? (
              <div className="py-8 text-center text-stone-500 space-y-3">
                <p className="text-sm">No recent orders yet.</p>
                <Button asChild size="sm">
                  <Link href="/menu">Browse Menu</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.slice(0, 3).map((order) => (
                  <div key={order.id} className="rounded-xl border border-stone-100 p-4 space-y-2 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-sm">#{order.id}</span>
                      <Badge className="bg-brand-primary text-white text-[11px]">{order.status}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-stone-500">
                      <span>{order.items?.length || 1} Items • {order.paymentMethod}</span>
                      <span className="font-bold text-stone-900 dark:text-white text-sm">
                        {formatCurrency(order.total)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </section>
    </SiteShell>
  );
}
