import { SiteShell } from "@/components/layout/site-shell";
import { CtaBanner } from "@/components/sections/cta-banner";
import { FaqList } from "@/components/sections/faq-list";
import { FeatureGrid } from "@/components/sections/feature-grid";
import { GalleryGrid } from "@/components/sections/gallery-grid";
import { HeroSection } from "@/components/sections/hero-section";
import { MenuShowcase } from "@/components/sections/menu-showcase";
import { NewsletterCard } from "@/components/sections/newsletter-card";
import { OfferGrid } from "@/components/sections/offer-grid";
import { ServiceGrid } from "@/components/sections/service-grid";
import { TestimonialGrid } from "@/components/sections/testimonial-grid";

export default function HomePage() {
  return (
    <SiteShell>
      <HeroSection />
      <MenuShowcase />
      <FeatureGrid />
      <ServiceGrid />
      <OfferGrid />
      <TestimonialGrid />
      <GalleryGrid />
      <CtaBanner />
      <FaqList />
      <NewsletterCard />
    </SiteShell>
  );
}
