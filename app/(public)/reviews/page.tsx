import { SiteShell } from "@/components/layout/site-shell";
import { PageHero } from "@/components/layout/page-hero";
import { TestimonialGrid } from "@/components/sections/testimonial-grid";

export default function ReviewsPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="Reviews"
        title="Guest trust built through visible quality, consistency, and memorable hospitality"
        description="Feast Lane uses testimonials, ratings, and real customer language to strengthen conversions across dine-in, delivery, and events."
      />
      <TestimonialGrid />
    </SiteShell>
  );
}
