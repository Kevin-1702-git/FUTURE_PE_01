import Image from "next/image";

import { SectionHeading } from "@/components/ui/section-heading";
import { galleryImages } from "@/lib/data/content";

export function GalleryGrid() {
  return (
    <section className="section-shell section-spacing">
      <SectionHeading
        eyebrow="Gallery"
        title="A visual-first restaurant experience made for modern browsing"
        description="Large imagery helps Feast Lane feel premium online before the first order is even placed."
      />
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {galleryImages.map((image, index) => (
          <div key={image} className={`relative overflow-hidden rounded-[28px] ${index % 3 === 0 ? "lg:row-span-2" : ""}`}>
            <Image src={image} alt={`Feast Lane gallery ${index + 1}`} width={900} height={1200} className="h-full w-full object-cover" />
          </div>
        ))}
      </div>
    </section>
  );
}
