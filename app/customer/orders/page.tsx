"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { CheckCircle2, Clock, Loader2, PackageCheck, Star, Truck, AlertCircle, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";

import { SiteShell } from "@/components/layout/site-shell";
import { PageHero } from "@/components/layout/page-hero";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/utils";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  total: number;
  menuItem?: {
    name: string;
    image?: string;
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
  createdAt: string;
  items: OrderItem[];
  review?: any;
}

export default function CustomerOrdersPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Review Modal state
  const [selectedOrderForReview, setSelectedOrderForReview] = useState<Order | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

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
      console.warn("Fetch orders error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000); // Live poll order status every 10s
    return () => clearInterval(interval);
  }, []);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForReview || !comment.trim()) {
      toast.error("Please enter a review comment.");
      return;
    }

    setIsSubmittingReview(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: selectedOrderForReview.id,
          rating,
          comment
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Review submitted successfully! Thank you.");
        setSelectedOrderForReview(null);
        setComment("");
        fetchOrders();
      } else {
        toast.error(data.message || "Failed to submit review.");
      }
    } catch (err) {
      toast.error("An error occurred while submitting review.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge className="bg-amber-500 text-white flex items-center gap-1"><Clock className="h-3 w-3" /> Pending Accept</Badge>;
      case "CONFIRMED":
      case "ACCEPTED":
        return <Badge className="bg-blue-500 text-white flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Accepted</Badge>;
      case "PREPARING":
        return <Badge className="bg-purple-500 text-white flex items-center gap-1"><Clock className="h-3 w-3" /> Preparing in Kitchen</Badge>;
      case "READY":
        return <Badge className="bg-indigo-500 text-white flex items-center gap-1"><PackageCheck className="h-3 w-3" /> Ready for Pickup</Badge>;
      case "OUT_FOR_DELIVERY":
        return <Badge className="bg-orange-500 text-white flex items-center gap-1"><Truck className="h-3 w-3 animate-bounce" /> Out for Delivery</Badge>;
      case "DELIVERED":
      case "COMPLETED":
        return <Badge className="bg-emerald-600 text-white flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Delivered</Badge>;
      case "CANCELLED":
        return <Badge className="bg-red-500 text-white flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Cancelled</Badge>;
      default:
        return <Badge className="bg-stone-500 text-white">{status}</Badge>;
    }
  };

  return (
    <SiteShell>
      <PageHero
        eyebrow="My Orders"
        title="Track Live Orders & Past History"
        description="Monitor kitchen preparation status, live delivery updates, order totals, and submit verified reviews for completed orders."
      />
      <section className="section-shell pb-16 md:pb-24">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-3">
            <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
            <p className="text-sm text-stone-500">Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <Card className="mx-auto max-w-md p-12 text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <h3 className="font-heading text-xl font-bold">No orders placed yet</h3>
            <p className="text-sm text-stone-600 dark:text-stone-300">
              When you order food from Feast Lane, your active tracking and order history will appear here.
            </p>
            <Button asChild>
              <Link href="/menu">Order Now</Link>
            </Button>
          </Card>
        ) : (
          <div className="mx-auto max-w-4xl space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="p-6 space-y-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 pb-4 dark:border-stone-800">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-lg font-bold text-stone-900 dark:text-white">
                        {order.id}
                      </span>
                      {getStatusBadge(order.status)}
                    </div>
                    <p className="mt-1 text-xs text-stone-500">
                      Placed on {new Date(order.createdAt).toLocaleString()} • {order.paymentMethod}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-stone-500 uppercase tracking-wider">Total Amount</p>
                    <p className="font-heading text-xl font-bold text-brand-primary">
                      {formatCurrency(order.total)}
                    </p>
                  </div>
                </div>

                {/* Items breakdown */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase text-stone-400">Items Ordered</h4>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {order.items?.map((item, idx) => (
                      <div
                        key={item.id || idx}
                        className="flex items-center justify-between rounded-xl bg-stone-50 p-3 text-sm dark:bg-stone-900"
                      >
                        <span className="font-medium text-stone-800 dark:text-stone-200">
                          {item.quantity}x {item.menuItem?.name || "Dish"}
                        </span>
                        <span className="font-semibold text-stone-600 dark:text-stone-400">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions (Review for completed order) */}
                <div className="flex items-center justify-between pt-2">
                  <div className="text-xs text-stone-500">
                    Restaurant: <strong>Feast Lane Main Branch</strong>
                  </div>

                  {(order.status === "DELIVERED" || order.status === "COMPLETED") && (
                    <div>
                      {order.review ? (
                        <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold bg-emerald-50 px-3 py-1.5 rounded-full dark:bg-emerald-950/40">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          Reviewed ({order.review.rating}★)
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => setSelectedOrderForReview(order)}
                          className="bg-brand-primary gap-1 text-xs"
                        >
                          <Star className="h-3.5 w-3.5 fill-white" /> Write Review
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Review Modal */}
        {selectedOrderForReview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <Card className="w-full max-w-lg p-6 space-y-5 bg-white dark:bg-stone-900">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3 dark:border-stone-800">
                <h3 className="font-heading text-xl font-bold">Review Order #{selectedOrderForReview.id}</h3>
                <button
                  type="button"
                  onClick={() => setSelectedOrderForReview(null)}
                  className="text-stone-400 hover:text-stone-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Rating (1 to 5 Stars)</Label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 text-2xl transition hover:scale-110"
                      >
                        <Star
                          className={`h-8 w-8 ${
                            star <= rating ? "fill-amber-400 text-amber-400" : "text-stone-300 dark:text-stone-700"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comment">Your Honest Review / Feedback *</Label>
                  <Textarea
                    id="comment"
                    placeholder="Tell us about the food quality, taste, packaging, and delivery speed..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSelectedOrderForReview(null)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmittingReview}>
                    {isSubmittingReview ? "Submitting..." : "Submit Review"}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}
      </section>
    </SiteShell>
  );
}
