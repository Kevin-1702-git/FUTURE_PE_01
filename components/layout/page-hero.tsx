import { Badge } from "@/components/ui/badge";

export function PageHero({
  eyebrow,
  title,
  description
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="section-shell section-spacing">
      <div className="glass-panel rounded-[36px] p-8 md:p-12">
        <Badge>{eyebrow}</Badge>
        <h1 className="mt-5 font-heading text-4xl leading-tight md:text-6xl">{title}</h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-stone-600 dark:text-stone-300 md:text-lg">
          {description}
        </p>
      </div>
    </section>
  );
}
