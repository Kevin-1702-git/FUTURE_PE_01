import { SiteShell } from "@/components/layout/site-shell";
import { PageHero } from "@/components/layout/page-hero";
import { GalleryGrid } from "@/components/sections/gallery-grid";

export default function GalleryPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="Gallery"
        title="Image-heavy storytelling for a luxury restaurant experience"
        description="Visual presentation is a core sales asset for premium food brands, especially on mobile and social-driven traffic."
      />
      <GalleryGrid />
    </SiteShell>
  );
}
