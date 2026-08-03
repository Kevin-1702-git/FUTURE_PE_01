import Image from "next/image";
import { Clock3, Flame, Leaf, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatCurrency } from "@/lib/utils";
import type { MenuItem } from "@/types";

export function MenuCard({
  item,
  compact = false
}: {
  item: MenuItem;
  compact?: boolean;
}) {
  return (
    <Card className={cn("overflow-hidden p-0", compact && "rounded-[22px]")}>
      <div className={cn("relative overflow-hidden", compact ? "h-28 w-28 shrink-0" : "h-56")}>
        <Image
          src={item.image}
          alt={item.name}
          fill={compact ? undefined : true}
          width={compact ? 112 : undefined}
          height={compact ? 112 : undefined}
          sizes={compact ? "112px" : "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"}
          className="object-cover transition duration-500 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/35 via-transparent to-transparent" />
        <div className={cn("absolute flex gap-2", compact ? "left-2 top-2" : "left-4 top-4")}>
          <Badge>{item.category}</Badge>
          {item.bestSeller ? <Badge className="bg-brand-secondary/20 text-brand-secondary">Best Seller</Badge> : null}
        </div>
      </div>
      <CardContent className={cn("space-y-4 p-6", compact && "flex-1 space-y-3 p-4")}>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className={cn("font-heading text-2xl", compact && "truncate text-xl")}>{item.name}</h3>
            <p
              className={cn(
                "mt-2 text-sm leading-6 text-stone-600 dark:text-stone-300",
                compact && "line-clamp-2 mt-1 leading-5"
              )}
            >
              {item.description}
            </p>
          </div>
          <p className={cn("text-lg font-semibold text-brand-primary", compact && "shrink-0 text-base")}>
            {formatCurrency(item.price)}
          </p>
        </div>
        <div className={cn("flex flex-wrap gap-4 text-sm text-stone-600 dark:text-stone-300", compact && "gap-3 text-xs")}>
          <span className="inline-flex items-center gap-1">
            <Leaf className="h-4 w-4 text-brand-primary" />
            {item.type}
          </span>
          <span className="inline-flex items-center gap-1">
            <Flame className="h-4 w-4 text-brand-secondary" />
            {item.calories} cal
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock3 className="h-4 w-4 text-brand-primary" />
            {item.preparationTime} min
          </span>
          <span className="inline-flex items-center gap-1">
            <Star className="h-4 w-4 fill-brand-secondary text-brand-secondary" />
            {item.rating}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
