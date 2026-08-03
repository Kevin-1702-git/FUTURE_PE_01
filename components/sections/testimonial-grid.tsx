import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { testimonials } from "@/lib/site";

export function TestimonialGrid() {
  return (
    <section className="section-shell section-spacing">
      <SectionHeading
        eyebrow="Guest Reviews"
        title="Social proof that builds trust for dine-in, delivery, and event bookings"
        description="Customer confidence rises when the website clearly demonstrates quality, consistency, and care."
      />
      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {testimonials.map((item) => (
          <Card key={item.id}>
            <CardContent className="space-y-5">
              <p className="text-brand-secondary">{"★".repeat(item.rating)}</p>
              <p className="text-sm leading-7 text-stone-600 dark:text-stone-300">{item.quote}</p>
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-stone-500">{item.role}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
