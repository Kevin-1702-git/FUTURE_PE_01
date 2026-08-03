import { TrendingDown, TrendingUp } from "lucide-react";

import { Card } from "@/components/ui/card";
import type { DashboardStat } from "@/types";

export function StatsGrid({ stats }: { stats: DashboardStat[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <p className="text-sm text-stone-500 dark:text-stone-400">{stat.label}</p>
          <div className="mt-4 flex items-end justify-between">
            <p className="text-3xl font-semibold">{stat.value}</p>
            <p
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                stat.trend === "up"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {stat.trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {stat.change}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
}
