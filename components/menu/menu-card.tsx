"use client";

import Image from "next/image";
import { Clock3, Flame, Leaf, Plus, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatCurrency } from "@/lib/utils";
import type { MenuItem } from "@/types";
import { useState } from "react";
import { useCart } from "@/context/cart-context";

const fallbackImage = "/images/menu-placeholder.svg";

export function MenuCard({
  item,
  compact = false
}: {
  item: MenuItem;
  compact?: boolean;
}) {
  const { addItem } = useCart();
  const [imageSrc, setImageSrc] = useState(item.image || fallbackImage);

  return (
    <Card className={cn("overflow-hidden p-0 transition-all hover:shadow-lg", compact && "flex rounded-[22px]")}>
      <div className={cn("relative overflow-hidden", compact ? "h-28 w-28 shrink-0" : "h-56")}>
        <Image
          src={imageSrc}
          alt={item.name}
          fill={compact ? undefined : true}
          width={compact ? 112 : undefined}
          height={compact ? 112 : undefined}
          sizes={compact ? "112px" : "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"}
          className="object-cover transition duration-500 hover:scale-105"
          onError={() => setImageSrc(fallbackImage)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/35 via-transparent to-transparent" />
        <div className={cn("absolute flex flex-wrap gap-1.5", compact ? "left-2 top-2" : "left-4 top-4")}>
          <Badge className="bg-brand-primary/90 text-white">{item.category}</Badge>
          {item.bestSeller ? <Badge className="bg-amber-500/90 text-white">Best Seller</Badge> : null}
          {item.todaysSpecial ? <Badge className="bg-rose-500/90 text-white">Today's Special</Badge> : null}
        </div>
      </div>
      <CardContent className={cn("space-y-4 p-6", compact && "flex flex-1 flex-col justify-between space-y-2 p-3")}>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className={cn("font-heading text-xl font-bold", compact && "truncate text-lg")}>{item.name}</h3>
            <p
              className={cn(
                "mt-2 text-sm leading-6 text-stone-600 dark:text-stone-300",
                compact && "line-clamp-2 mt-0.5 text-xs leading-4"
              )}
            >
              {item.description}
            </p>
          </div>
          <div className="text-right">
            <p className={cn("text-lg font-bold text-brand-primary", compact && "text-base")}>
              {formatCurrency(item.price)}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 pt-1">
          <div className={cn("flex flex-wrap gap-3 text-xs text-stone-600 dark:text-stone-300", compact && "gap-2 text-[11px]")}>
            <span className="inline-flex items-center gap-1">
              <Leaf className={cn("h-3.5 w-3.5", item.type === "Veg" ? "text-emerald-500" : "text-red-500")} />
              {item.type}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock3 className="h-3.5 w-3.5 text-brand-primary" />
              {item.preparationTime}m
            </span>
            <span className="inline-flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              {item.rating}
            </span>
          </div>

          <Button
            size="sm"
            onClick={() => addItem(item)}
            className="h-8 gap-1.5 rounded-full px-3 text-xs font-semibold shadow-sm"
          >
            <Plus className="h-3.5 w-3.5" />
            Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
