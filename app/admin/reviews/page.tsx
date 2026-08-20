"use client";

import { useEffect, useState } from "react";
import { Star, MessageSquare, Loader2, CheckCircle2 } from "lucide-react";

import { AdminNav } from "@/components/dashboard/admin-nav";
import { PageHero } from "@/components/layout/page-hero";
import { SiteShell } from "@/components/layout/site-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { testimonials as defaultTestimonials } from "@/lib/site";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReviews() {
      try {
        const res = await fetch("/api/reviews");
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.data)) {
            setReviews(data.data);
          }
        }
      } catch (e) {
        console.warn("Fetch admin reviews error:", e);
      } finally {
        setLoading(false);
      }
    }
    loadReviews();
  }, []);

  const avgRating = reviews.length > 0
    ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
    : 4.8;

  return (
    <SiteShell>
      <PageHero
        eyebrow="Customer Experience"
        title="Restaurant Guest Reviews"
        description="Monitor star ratings, food quality reviews, delivery speed ratings, and authentic customer feedback submitted from completed orders."
      />
      <section className="section-shell space-y-8 pb-16 md:pb-24">
        <AdminNav />

        {/* Rating Summary Card */}
        <Card className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-stone-900 dark:to-stone-950 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500 text-white font-heading text-3xl font-bold shadow-md">
              {avgRating}
            </div>
            <div>
              <h3 className="font-heading text-xl font-bold text-stone-900 dark:text-white">Overall Restaurant Rating</h3>
              <div className="flex items-center gap-1 text-amber-400 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.round(avgRating) ? "fill-amber-400 text-amber-400" : "text-stone-300 dark:text-stone-700"
                    }`}
                  />
                ))}
                <span className="text-xs font-semibold text-stone-600 dark:text-stone-400 ml-2">
                  ({reviews.length} Total Verified Reviews)
                </span>
              </div>
            </div>
          </div>
        </Card>

        {loading ? (
          <div className="py-16 text-center text-stone-500">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-brand-primary" />
            <p className="mt-2 text-sm">Loading guest reviews...</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((item, idx) => (
              <Card key={item.id || idx} className="p-6 space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < item.rating ? "fill-amber-400 text-amber-400" : "text-stone-300 dark:text-stone-700"
                        }`}
                      />
                    ))}
                  </div>
                  <Badge className="bg-emerald-600 text-white text-[10px] flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Verified Order
                  </Badge>
                </div>

                <p className="text-sm leading-6 text-stone-700 dark:text-stone-300 italic">
                  "{item.quote || item.comment}"
                </p>

                <div className="border-t border-stone-100 pt-3 dark:border-stone-800 flex justify-between items-end">
                  <div>
                    <p className="font-bold text-stone-900 dark:text-white text-sm">{item.name}</p>
                    <p className="text-xs text-stone-500">{item.role || "Customer"}</p>
                  </div>
                  {item.createdAt && (
                    <span className="text-[11px] text-stone-400">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </SiteShell>
  );
}
