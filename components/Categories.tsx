import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { categories } from "@/content/site";

export function Categories() {
  return (
    <section className="px-[var(--layout-margin)] py-[var(--layout-padding-y)]">
      <div className="mx-auto grid w-full max-w-[var(--layout-max)] grid-cols-1 gap-6 md:grid-cols-2">
        {categories.panels.map((panel) => (
        <article
          key={panel.title}
          className="flex flex-col overflow-hidden rounded-big border border-white-8 bg-azul-capri/15"
        >
          {/* texto — parte superior, centralizado */}
          <div className="flex flex-col items-center px-8 pt-10 text-center md:px-10 md:pt-12">
            <h2 className="text-h3 md:text-h2 font-bold text-white">{panel.title}</h2>
            <p className="text-body2 mt-4 max-w-[42ch] text-white/70">
              {panel.description}
            </p>
            <a href={panel.cta.href} className="btn-link mt-6">
              {panel.cta.label}
              <ArrowUpRight className="size-4" strokeWidth={2.25} />
            </a>
          </div>

          {/* imagem — metade inferior, centralizada, sem crop nem radius */}
          <div className="mt-8 flex flex-1 items-end justify-center px-8 pb-10 md:px-10 md:pb-12">
            <Image
              src={panel.image.src}
              alt={panel.image.alt}
              width={520}
              height={520}
              className="h-[400px] w-auto object-contain"
            />
          </div>
        </article>
        ))}
      </div>
    </section>
  );
}
