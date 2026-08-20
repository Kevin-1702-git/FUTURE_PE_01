"use client";

import { useEffect, useState } from "react";
import { Star, MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { testimonials as defaultTestimonials } from "@/lib/site";

export function TestimonialGrid() {
  const [reviews, setReviews] = useState<any[]>(defaultTestimonials);

  useEffect(() => {
    async function loadReviews() {
      try {
        const res = await fetch("/api/reviews");
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.data) && data.data.length > 0) {
            setReviews(data.data);
          }
        }
      } catch (e) {
        console.warn("Error fetching reviews:", e);
      }
    }
    loadReviews();
  }, []);

  return (
    <section className="section-shell section-spacing pb-16 md:pb-24">
      <SectionHeading
        eyebrow="Guest Reviews"
        title="Social proof from verified Feast Lane customers"
        description="Authentic ratings and feedback submitted by guests after completing their dining and delivery orders."
      />
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map((item, idx) => (
          <Card key={item.id || idx} className="p-6 transition-all hover:shadow-md">
            <CardContent className="space-y-4 p-0">
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
                <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full">
                  Verified Order
                </span>
              </div>
              <p className="text-sm leading-6 text-stone-700 dark:text-stone-300 italic">
                "{item.quote || item.comment}"
              </p>
              <div className="border-t border-stone-100 pt-3 dark:border-stone-800">
                <p className="font-semibold text-stone-900 dark:text-white">{item.name}</p>
                <p className="text-xs text-stone-500">{item.role || "Feast Lane Guest"}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
