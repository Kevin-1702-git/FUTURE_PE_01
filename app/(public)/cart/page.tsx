"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowLeft, CheckCircle, CreditCard, Minus, Plus, ShoppingBag, Trash2, Tag } from "lucide-react";
import toast from "react-hot-toast";

import { SiteShell } from "@/components/layout/site-shell";
import { PageHero } from "@/components/layout/page-hero";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/context/cart-context";
import { formatCurrency } from "@/lib/utils";

export default function CartPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    couponCode,
    couponDiscount,
    applyCoupon,
    removeCoupon,
    subtotal,
    deliveryCharge,
    gst,
    total
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState("");
  const [address, setAddress] = useState("124 Grand Trunk Road, Anna Nagar, Chennai, TN 600040");
  const [phone, setPhone] = useState((session?.user as any)?.phone || "+91 98765 43210");
  const [paymentMethod, setPaymentMethod] = useState("UPI / Online Payment");
  const [notes, setNotes] = useState("");
  const [isPlacing, setIsPlacing] = useState(false);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    applyCoupon(inputCoupon);
  };

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    if (!session) {
      toast.error("Please sign in to place an order.");
      router.push("/login?redirect=/cart");
      return;
    }

    if (!address.trim() || !phone.trim()) {
      toast.error("Please enter a valid delivery address and phone number.");
      return;
    }

    setIsPlacing(true);
    try {
      const orderPayload = {
        items: items.map((i) => ({
          id: i.id,
          name: i.name,
          price: i.price,
          quantity: i.quantity
        })),
        subtotal,
        deliveryCharge,
        gst,
        discount: couponDiscount,
        total,
        addressLine: address,
        phone,
        paymentMethod,
        notes
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`Order #${data.order.id} placed successfully!`);
        clearCart();
        router.push("/customer/orders");
      } else {
        toast.error(data.message || "Failed to place order.");
      }
    } catch (e) {
      toast.error("An error occurred while creating your order.");
    } finally {
      setIsPlacing(false);
    }
  };

  return (
    <SiteShell>
      <PageHero
        eyebrow="Checkout"
        title="Your Feast Lane Food Cart"
        description="Review your selected items, apply promotional discount coupons, enter delivery details, and place your order directly."
      />
      <section className="section-shell pb-16 md:pb-24">
        {items.length === 0 ? (
          <Card className="mx-auto max-w-lg p-12 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary">
              <ShoppingBag className="h-10 w-10" />
            </div>
            <h2 className="mt-6 font-heading text-2xl font-bold">Your cart is currently empty</h2>
            <p className="mt-2 text-stone-600 dark:text-stone-300">
              Explore our 300+ multi-cuisine dishes across starters, biryanis, parottas, pizzas, and desserts!
            </p>
            <Button asChild className="mt-8">
              <Link href="/menu">
                <ArrowLeft className="mr-2 h-4 w-4" /> Browse Feast Lane Menu
              </Link>
            </Button>
          </Card>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
            {/* Cart Items List */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-2xl font-bold">Order Items ({items.length})</h2>
                <Button variant="ghost" size="sm" onClick={clearCart} className="text-red-500 hover:text-red-600">
                  <Trash2 className="mr-1.5 h-4 w-4" /> Clear Cart
                </Button>
              </div>

              <div className="space-y-4">
                {items.map((item) => (
                  <Card key={item.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-stone-100">
                      <Image
                        src={item.image || "/images/default-dish.jpg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-heading text-lg font-bold truncate">{item.name}</h3>
                      <p className="text-xs text-stone-500">{item.category} • {item.type}</p>
                      <p className="mt-1 font-semibold text-brand-primary">{formatCurrency(item.price)}</p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <div className="flex items-center rounded-full border border-stone-200 p-1 dark:border-stone-800">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-stone-100 dark:hover:bg-stone-800"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-stone-100 dark:hover:bg-stone-800"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <p className="w-20 text-right font-bold text-stone-900 dark:text-white">
                        {formatCurrency(item.price * item.quantity)}
                      </p>

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-stone-400 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Delivery Details Card */}
              <Card className="p-6 space-y-4">
                <h3 className="font-heading text-lg font-bold">Delivery & Contact Details</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="payment">Payment Method</Label>
                    <select
                      id="payment"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full h-11 rounded-2xl border border-stone-200 bg-white px-4 text-sm dark:border-white/10 dark:bg-stone-900"
                    >
                      <option value="UPI / Online Payment">UPI / Google Pay / PhonePe</option>
                      <option value="Credit / Debit Card">Credit / Debit Card</option>
                      <option value="Cash on Delivery">Cash on Delivery (COD)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Delivery Address *</Label>
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter complete house no, street, locality, landmark..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Delivery Instructions / Cooking Notes (Optional)</Label>
                  <Input
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Make it extra spicy, leave at front door..."
                  />
                </div>
              </Card>
            </div>

            {/* Order Summary & Coupon */}
            <div className="space-y-6">
              <Card className="p-6 space-y-6 sticky top-24">
                <h3 className="font-heading text-xl font-bold">Order Summary</h3>

                {/* Coupon Input */}
                <div>
                  <Label className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Have a Promo Coupon?</Label>
                  {couponCode ? (
                    <div className="mt-2 flex items-center justify-between rounded-2xl border border-emerald-500/30 bg-emerald-50/50 p-3 text-sm dark:bg-emerald-950/20">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-emerald-600" />
                        <span className="font-bold text-emerald-700 dark:text-emerald-400">{couponCode}</span>
                        <span className="text-xs text-stone-500">(-{formatCurrency(couponDiscount)})</span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={removeCoupon} className="h-7 text-xs text-red-500">
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="mt-2 flex gap-2">
                      <Input
                        placeholder="e.g. FAMILY20 or STUDENT10"
                        value={inputCoupon}
                        onChange={(e) => setInputCoupon(e.target.value)}
                        className="uppercase text-sm"
                      />
                      <Button type="submit" variant="outline">Apply</Button>
                    </form>
                  )}
                  <p className="mt-1.5 text-xs text-stone-500">Try code <strong>FAMILY20</strong> for 20% off orders &gt; ₹1200!</p>
                </div>

                <div className="space-y-3 text-sm divide-y divide-stone-100 dark:divide-stone-800 pt-2">
                  <div className="flex justify-between pt-1">
                    <span className="text-stone-600 dark:text-stone-300">Items Subtotal</span>
                    <span className="font-semibold">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between pt-3">
                    <span className="text-stone-600 dark:text-stone-300">GST & Restaurant Taxes (5%)</span>
                    <span className="font-semibold">{formatCurrency(gst)}</span>
                  </div>
                  <div className="flex justify-between pt-3">
                    <span className="text-stone-600 dark:text-stone-300">Delivery Fee</span>
                    <span className="font-semibold">
                      {deliveryCharge === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : formatCurrency(deliveryCharge)}
                    </span>
                  </div>

                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-emerald-600 pt-3">
                      <span>Coupon Discount</span>
                      <span className="font-bold">-{formatCurrency(couponDiscount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-lg font-bold pt-4 text-stone-900 dark:text-white">
                    <span>Grand Total</span>
                    <span className="text-brand-primary">{formatCurrency(total)}</span>
                  </div>
                </div>

                <Button
                  onClick={handleCheckout}
                  disabled={isPlacing}
                  className="w-full h-12 text-base font-bold shadow-lg"
                >
                  {isPlacing ? "Placing Order..." : `Place Order • ${formatCurrency(total)}`}
                </Button>

                {!session && (
                  <p className="text-center text-xs text-amber-600 dark:text-amber-400 font-medium">
                    Note: You will be asked to sign in before confirming order.
                  </p>
                )}
              </Card>
            </div>
          </div>
        )}
      </section>
    </SiteShell>
  );
}
