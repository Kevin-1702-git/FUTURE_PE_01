import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { serviceFeatures } from "@/lib/site";

export function ServiceGrid() {
  return (
    <section className="section-shell section-spacing">
      <SectionHeading
        eyebrow="Services"
        title="From dine-in elegance to delivery speed and event-scale catering"
        description="Feast Lane is built to support multiple revenue streams with consistent premium branding."
      />
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {serviceFeatures.map((feature) => (
          <Card key={feature.title}>
            <CardHeader>
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-7 text-stone-600 dark:text-stone-300">{feature.description}</p>
              <ul className="space-y-2 text-sm text-stone-700 dark:text-stone-200">
                {feature.benefits.map((benefit) => (
                  <li key={benefit}>• {benefit}</li>
                ))}
              </ul>
              <p className="text-sm font-medium text-brand-primary">Ideal for: {feature.idealFor}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
