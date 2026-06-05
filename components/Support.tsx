"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { support } from "@/content/site";
import { WhatsAppButton } from "./WhatsAppButton";

/* perView responsivo: mobile 1 · tablet 2 · desktop 3 */
function usePerView() {
  const [perView, setPerView] = useState(3);

  useEffect(() => {
    const tablet = window.matchMedia("(min-width: 768px)");
    const desktop = window.matchMedia("(min-width: 1024px)");
    const update = () => setPerView(desktop.matches ? 3 : tablet.matches ? 2 : 1);
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
  const services = support.services;
  const n = services.length;

  // lista triplicada -> loop infinito de verdade (clones nas pontas).
  // começa no bloco do meio para poder ir pros dois lados sem ponta visível.
  const items = [...services, ...services, ...services];
  const [index, setIndex] = useState(n);
  const [animate, setAnimate] = useState(true);

  const go = (dir: number) => {
    setAnimate(true);
    setIndex((i) => i + dir);
  };

  // ao fim da transição, se saímos do bloco do meio, "teleporta" sem animação
  // para o item equivalente do meio -> loop contínuo, setas nunca desligam.
  const handleTransitionEnd = () => {
    if (index >= 2 * n) {
      setAnimate(false);
      setIndex((i) => i - n);
    } else if (index < n) {
      setAnimate(false);
      setIndex((i) => i + n);
    }
  };

  // reabilita a animação no frame seguinte ao teleporte
  useEffect(() => {
    if (!animate) {
      const id = requestAnimationFrame(() => setAnimate(true));
      return () => cancelAnimationFrame(id);
    }
  }, [animate]);

  return (
    <section className="px-[var(--layout-margin)] py-[var(--layout-padding-y)]">
      <div className="mx-auto w-full max-w-[var(--layout-max)]">
        {/* cabeçalho */}
        <header className="text-center">
          <h2 className="text-h3 md:text-h2 font-bold text-white">{support.title}</h2>
          <p className="text-body2 mt-4 text-white/63">{support.subtitle}</p>
        </header>

        {/* carrossel: [seta] [viewport] [seta] */}
        <div className="mt-16 flex items-center gap-2 md:gap-4">
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
              className="flex items-stretch"
              style={{
                transform: `translateX(-${index * (100 / perView)}%)`,
                transition: animate
                  ? "transform 500ms cubic-bezier(0.25,0.46,0.45,0.94)"
                  : "none",
              }}
              onTransitionEnd={handleTransitionEnd}
            >
              {items.map((service, i) => (
                <li
                  key={`${service.title}-${i}`}
                  className="shrink-0 px-[calc(var(--layout-gap)/2)]"
                  style={{ width: `${100 / perView}%` }}
                >
                  <article className="flex h-full flex-col rounded-big border border-white-8 bg-azul-escuro/40 p-6 text-center">
                    <h3 className="text-body font-normal text-white">
                      {service.title}
                    </h3>
                    <p className="text-body2 mt-2 text-white/63">
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

        {/* CTA */}
        <div className="mt-16 flex justify-center">
          <WhatsAppButton
            message={support.cta.message}
            label={support.cta.label}
          />
        </div>
      </div>
    </section>
  );
}
