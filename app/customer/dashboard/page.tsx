import { SiteShell } from "@/components/layout/site-shell";
import { AnalyticsChart } from "@/components/dashboard/analytics-chart";
import { SimpleTable } from "@/components/dashboard/simple-table";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { PageHero } from "@/components/layout/page-hero";
import { customerStats } from "@/lib/data/content";
import { revenueChart } from "@/services/dashboard-service";
import { buildDemoOrder } from "@/services/order-service";

export default function CustomerDashboardPage() {
  const summary = buildDemoOrder();

  return (
    <SiteShell>
      <PageHero
        eyebrow="Customer Dashboard"
        title="Track orders, rewards, reservations, and your favorite dishes"
        description="The customer workspace keeps repeat ordering friction low while increasing retention through convenience and loyalty signals."
      />
      <section className="section-shell space-y-8 pb-16 md:pb-24">
        <StatsGrid stats={customerStats} />
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <AnalyticsChart title="Recent Order Activity" data={revenueChart} />
          <SimpleTable
            title="Current Cart Summary"
            columns={["Metric", "Amount"]}
            rows={[
              ["Subtotal", `₹${summary.subtotal}`],
              ["Delivery", `₹${summary.delivery}`],
              ["GST", `₹${summary.gst}`],
              ["Discount", `₹${summary.discount}`],
              ["Total", `₹${summary.total}`]
            ]}
          />
        </div>
        <SimpleTable
          title="Recent Orders"
          columns={["Order", "Type", "Status", "Amount"]}
          rows={[
            ["FL-20260803-101", "Delivery", "Out for Delivery", "₹1,129"],
            ["FL-20260729-083", "Dine In", "Completed", "₹2,460"],
            ["FL-20260725-061", "Takeaway", "Completed", "₹749"]
          ]}
        />
      </section>
    </SiteShell>
  );
}
