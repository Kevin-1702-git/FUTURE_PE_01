import { SiteShell } from "@/components/layout/site-shell";
import { PageHero } from "@/components/layout/page-hero";
import { MenuBrowser } from "@/components/menu/menu-browser";

export default function MenuPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="Digital Menu"
        title="224 menu items across global cuisines, crafted for browsing, filtering, and faster ordering"
        description="Search by craving, category, cuisine, or dietary preference and present every dish with strong visual hierarchy, pricing, and conversion cues."
      />
      <section className="section-shell pb-16 md:pb-24">
        <MenuBrowser />
      </section>
    </SiteShell>
  );
}
