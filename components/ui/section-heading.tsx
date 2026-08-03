import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left"
}: {
  eyebrow: string;
  title: string;
  description: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("space-y-4", align === "center" && "mx-auto max-w-3xl text-center")}>
      <Badge>{eyebrow}</Badge>
      <div className="space-y-3">
        <h2 className="font-heading text-3xl font-semibold leading-tight md:text-5xl">{title}</h2>
        <p className="text-base leading-7 text-stone-600 dark:text-stone-300 md:text-lg">{description}</p>
      </div>
    </div>
  );
}
