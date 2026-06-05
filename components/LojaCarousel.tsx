"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type Slide = { src: string; alt: string };

/* Carrossel automático (sem setas/controles) — crossfade entre as fotos,
   troca a cada `intervalMs`. Usado na seção VisitStartech. Respeita
   "reduzir movimento" parando a troca automática. */
export function LojaCarousel({
  slides,
  intervalMs = 2300,
}: {
  slides: readonly Slide[];
  intervalMs?: number;
}) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = setInterval(
      () => setActive((i) => (i + 1) % slides.length),
      intervalMs
    );
    return () => clearInterval(id);
  }, [slides.length, intervalMs]);

  return (
    <div className="relative h-full min-h-[280px] overflow-hidden rounded-medium md:min-h-[420px]">
      {slides.map((s, i) => (
        <Image
          key={s.src}
          src={s.src}
          alt={s.alt}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          priority={i === 0}
          className={`object-cover transition-opacity duration-700 ${
            i === active ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
}
