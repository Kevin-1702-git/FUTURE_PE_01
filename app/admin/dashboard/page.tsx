import { AnalyticsChart } from "@/components/dashboard/analytics-chart";
import { SimpleTable } from "@/components/dashboard/simple-table";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { PageHero } from "@/components/layout/page-hero";
import { SiteShell } from "@/components/layout/site-shell";
import { dashboardStats } from "@/lib/data/content";
import { revenueChart, topFoods } from "@/services/dashboard-service";

export default function AdminDashboardPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="Admin Dashboard"
        title="Operations, analytics, orders, customers, and menu performance in one control center"
        description="This dashboard is designed for admins, managers, and staff to monitor restaurant performance and take action quickly."
      />
      <section className="section-shell space-y-8 pb-16 md:pb-24">
        <StatsGrid stats={dashboardStats} />
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <AnalyticsChart title="Revenue vs Orders" data={revenueChart} />
          <SimpleTable
            title="Best Selling Items"
            columns={["Dish", "Orders"]}
            rows={topFoods.map((item) => [item.name, `${item.orders}`])}
          />
        </div>
        <SimpleTable
          title="Operations Snapshot"
          columns={["Module", "Status", "Notes"]}
          rows={[
            ["Orders", "184 Active", "14 preparing, 22 dispatched"],
            ["Reservations", "42 Today", "Peak slots nearly full"],
            ["Inventory", "8 Alerts", "Low stock on seafood items"],
            ["Coupons", "4 Live", "Student and family offers performing best"]
          ]}
        />
      </section>
    </SiteShell>
  );
}
