"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Clock, Loader2, PackageCheck, Truck, XCircle, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

import { AdminNav } from "@/components/dashboard/admin-nav";
import { PageHero } from "@/components/layout/page-hero";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  total: number;
  menuItem?: {
    name: string;
  };
}

interface Order {
  id: string;
  status: string;
  subtotal: number;
  deliveryCharge: number;
  gst: number;
  discount: number;
  total: number;
  paymentMethod: string;
  notes?: string;
  createdAt: string;
  items: OrderItem[];
  user?: {
    name: string;
    email: string;
    phone?: string;
  };
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ALL");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setOrders(data.data || []);
        }
      }
    } catch (e) {
      console.warn("Error fetching admin orders:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 8000); // Live poll every 8s
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = async (orderId: string, status: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`Order #${orderId} updated to ${status}`);
        fetchOrders();
      } else {
        toast.error(data.message || "Failed to update status.");
      }
    } catch (err) {
      toast.error("An error occurred while updating status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (activeTab === "ALL") return true;
    if (activeTab === "PENDING") return o.status === "PENDING";
    if (activeTab === "ACCEPTED") return o.status === "CONFIRMED" || o.status === "ACCEPTED";
    if (activeTab === "PREPARING") return o.status === "PREPARING";
    if (activeTab === "READY") return o.status === "READY";
    if (activeTab === "DISPATCHED") return o.status === "OUT_FOR_DELIVERY";
    if (activeTab === "COMPLETED") return o.status === "DELIVERED" || o.status === "COMPLETED";
    if (activeTab === "CANCELLED") return o.status === "CANCELLED";
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge className="bg-amber-500 text-white">Pending Accept</Badge>;
      case "CONFIRMED":
      case "ACCEPTED":
        return <Badge className="bg-blue-500 text-white">Accepted</Badge>;
      case "PREPARING":
        return <Badge className="bg-purple-500 text-white">Preparing in Kitchen</Badge>;
      case "READY":
        return <Badge className="bg-indigo-500 text-white">Ready for Dispatch</Badge>;
      case "OUT_FOR_DELIVERY":
        return <Badge className="bg-orange-500 text-white">Out for Delivery</Badge>;
      case "DELIVERED":
      case "COMPLETED":
        return <Badge className="bg-emerald-600 text-white">Delivered & Completed</Badge>;
      case "CANCELLED":
        return <Badge className="bg-red-500 text-white">Cancelled</Badge>;
      default:
        return <Badge className="bg-stone-500 text-white">{status}</Badge>;
    }
  };

  const tabs = [
    { id: "ALL", label: "All Orders", count: orders.length },
    { id: "PENDING", label: "New / Pending", count: orders.filter((o) => o.status === "PENDING").length },
    { id: "ACCEPTED", label: "Accepted", count: orders.filter((o) => o.status === "CONFIRMED" || o.status === "ACCEPTED").length },
    { id: "PREPARING", label: "Preparing", count: orders.filter((o) => o.status === "PREPARING").length },
    { id: "READY", label: "Ready", count: orders.filter((o) => o.status === "READY").length },
    { id: "DISPATCHED", label: "Out for Delivery", count: orders.filter((o) => o.status === "OUT_FOR_DELIVERY").length },
    { id: "COMPLETED", label: "Completed", count: orders.filter((o) => o.status === "DELIVERED" || o.status === "COMPLETED").length },
    { id: "CANCELLED", label: "Cancelled", count: orders.filter((o) => o.status === "CANCELLED").length }
  ];

  return (
    <SiteShell>
      <PageHero
        eyebrow="Order Fulfillment"
        title="Restaurant Order Management Dashboard"
        description="Receive incoming customer orders live, update kitchen preparation states, manage delivery dispatch, and sync status to PostgreSQL."
      />
      <section className="section-shell space-y-8 pb-16 md:pb-24">
        <AdminNav />

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                  activeTab === tab.id
                    ? "bg-brand-primary text-white shadow-sm"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300"
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          <Button variant="outline" size="sm" onClick={fetchOrders} className="gap-1.5 text-xs">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh Orders
          </Button>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="py-16 text-center text-stone-500">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-brand-primary" />
            <p className="mt-2 text-sm">Fetching restaurant orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <Card className="p-12 text-center text-stone-500">
            <p className="font-heading text-lg font-bold">No orders found in this status category.</p>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="p-6 space-y-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 pb-4 dark:border-stone-800">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xl font-bold text-stone-900 dark:text-white">
                        #{order.id}
                      </span>
                      {getStatusBadge(order.status)}
                    </div>
                    <p className="mt-1 text-xs text-stone-500">
                      Customer: <strong>{order.user?.name || "Guest"}</strong> ({order.user?.phone || "No phone"}) • {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-stone-500 uppercase tracking-wider">Total Value</p>
                    <p className="font-heading text-2xl font-bold text-brand-primary">
                      {formatCurrency(order.total)}
                    </p>
                    <p className="text-xs text-stone-500">{order.paymentMethod}</p>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase text-stone-400">Order Items</p>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {order.items?.map((item, idx) => (
                      <div key={item.id || idx} className="rounded-xl bg-stone-50 p-3 text-sm dark:bg-stone-900 flex justify-between">
                        <span className="font-medium">{item.quantity}x {item.menuItem?.name || "Dish"}</span>
                        <span className="font-semibold text-stone-500">{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {order.notes && (
                  <div className="rounded-xl bg-amber-50 border border-amber-200/60 p-3 text-xs text-amber-800 dark:bg-amber-950/20 dark:text-amber-300">
                    <strong>Special Instructions:</strong> {order.notes}
                  </div>
                )}

                {/* Restaurant Lifecycle Action Controls */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-stone-100 pt-4 dark:border-stone-800">
                  <span className="text-xs text-stone-500">Update Status:</span>

                  <div className="flex flex-wrap gap-2">
                    {order.status === "PENDING" && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleUpdateStatus(order.id, "CONFIRMED")}
                          disabled={updatingId === order.id}
                          className="bg-blue-600 hover:bg-blue-700 text-xs font-semibold"
                        >
                          ✓ Accept Order
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleUpdateStatus(order.id, "CANCELLED")}
                          disabled={updatingId === order.id}
                          className="bg-red-600 hover:bg-red-700 text-white text-xs"
                        >
                          ✕ Reject / Cancel
                        </Button>
                      </>
                    )}

                    {(order.status === "CONFIRMED" || order.status === "ACCEPTED") && (
                      <Button
                        size="sm"
                        onClick={() => handleUpdateStatus(order.id, "PREPARING")}
                        disabled={updatingId === order.id}
                        className="bg-purple-600 hover:bg-purple-700 text-xs font-semibold"
                      >
                        🍳 Mark as Preparing
                      </Button>
                    )}

                    {order.status === "PREPARING" && (
                      <Button
                        size="sm"
                        onClick={() => handleUpdateStatus(order.id, "READY")}
                        disabled={updatingId === order.id}
                        className="bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold"
                      >
                        📦 Mark Ready for Pickup
                      </Button>
                    )}

                    {order.status === "READY" && (
                      <Button
                        size="sm"
                        onClick={() => handleUpdateStatus(order.id, "OUT_FOR_DELIVERY")}
                        disabled={updatingId === order.id}
                        className="bg-orange-600 hover:bg-orange-700 text-xs font-semibold"
                      >
                        🛵 Dispatch (Out for Delivery)
                      </Button>
                    )}

                    {order.status === "OUT_FOR_DELIVERY" && (
                      <Button
                        size="sm"
                        onClick={() => handleUpdateStatus(order.id, "DELIVERED")}
                        disabled={updatingId === order.id}
                        className="bg-emerald-600 hover:bg-emerald-700 text-xs font-semibold"
                      >
                        ✓ Mark Completed & Delivered
                      </Button>
                    )}

                    {order.status !== "DELIVERED" && order.status !== "CANCELLED" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleUpdateStatus(order.id, "CANCELLED")}
                        disabled={updatingId === order.id}
                        className="text-xs text-red-500 hover:bg-red-50"
                      >
                        Cancel Order
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </SiteShell>
  );
}
