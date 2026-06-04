"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { support } from "@/content/site";

/* perView responsivo: mobile 1 · tablet 2 · desktop 4 */
function usePerView() {
  const [perView, setPerView] = useState(4);

  useEffect(() => {
    const tablet = window.matchMedia("(min-width: 768px)");
    const desktop = window.matchMedia("(min-width: 1024px)");
    const update = () => setPerView(desktop.matches ? 4 : tablet.matches ? 2 : 1);
    update();
    tablet.addEventListener("change", update);
    desktop.addEventListener("change", update);
    return () => {
      tablet.removeEventListener("change", update);
      desktop.removeEventListener("change", update);
    };
  }, []);

  return perView;
}

export function Support() {
  const perView = usePerView();
  const [page, setPage] = useState(0);

  const pages = Math.ceil(support.services.length / perView);
  // clampa a página atual se perView mudar (resize) e reduzir o nº de páginas
  const current = Math.min(page, pages - 1);

  const go = (dir: number) =>
    setPage((p) => (Math.min(p, pages - 1) + dir + pages) % pages);

  return (
    <section className="px-[var(--layout-margin)] py-[var(--layout-padding-y)]">
      <div className="mx-auto w-full max-w-[var(--layout-max)]">
        {/* cabeçalho */}
        <header className="text-center">
          <h2 className="text-h3 md:text-h2 font-bold text-white">{support.title}</h2>
          <p className="text-body2 mt-4 text-white/70">{support.subtitle}</p>
        </header>

        {/* carrossel: [seta] [viewport] [seta] */}
        <div className="mt-8 flex items-center gap-2 md:gap-4">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Anterior"
            className="shrink-0 rounded-full border border-white-8 p-2 text-white/60 transition hover:bg-white/5 hover:text-white"
          >
            <ChevronLeft className="size-5" />
          </button>

          <div className="overflow-hidden">
            <ul
              className="flex transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {support.services.map((service) => (
                <li
                  key={service.title}
                  className="shrink-0 px-[calc(var(--layout-gap)/2)]"
                  style={{ width: `${100 / perView}%` }}
                >
                  <article className="flex h-full flex-col items-center pt-10 pb-8 text-center">
                    <h3 className="text-body flex min-h-[64px] items-center font-normal text-white">
                      {service.title}
                    </h3>
                    <p className="text-body2 mt-3 max-w-[28ch] text-white/65">
                      {service.description}
                    </p>
                    <div className="mt-8 flex flex-1 items-end justify-center">
                      <Image
                        src={service.image.src}
                        alt={service.image.alt}
                        width={240}
                        height={240}
                        className="h-[180px] w-auto object-contain"
                      />
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          </div>

          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Próximo"
            className="shrink-0 rounded-full border border-white-8 p-2 text-white/60 transition hover:bg-white/5 hover:text-white"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>

        {/* indicadores (bolinhas) */}
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: pages }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setPage(i)}
              aria-label={`Ir para página ${i + 1}`}
              className={`size-2 rounded-full transition ${
                i === current ? "bg-azul-capri" : "bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 flex justify-center">
          <a href={support.cta.href} className="btn">
            {support.cta.label}
          </a>
        </div>
      </div>
    </section>
  );
}
