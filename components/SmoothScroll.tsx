"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { setLenis } from "@/lib/lenis";

/* SmoothScroll — scroll suave global (Lenis) com perfil "gravidade da lua".
   A ideia: ao soltar a roda/trackpad, o scroll NÃO trava de imediato — ele
   coasteia e "pousa" devagar, como um corpo caindo em baixa gravidade.

   Como o efeito é montado:
   • Modo `lerp` (interpolação por frame): a cada frame o scroll caminha uma
     fração `lerp` em direção ao alvo. Isso decai de forma EXPONENCIAL —
     rápido no início, assintoticamente lento no fim = "pouso suave" natural.
   • `lerp` BAIXO (0.06) = inércia longa, muito tempo "no ar" (lua).
   • `wheelMultiplier` > 1 dá um empurrão maior por giro (pouca força leva
     longe, como em baixa gravidade).

   Respeita "reduzir movimento" do SO: não ativa (deixa o scroll nativo).
   Mobile fica no toque nativo (syncTouch off) — a gravidade lunar é p/ a roda. */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: 0.06, // baixo = flutua mais e assenta devagar (gravidade lunar)
      wheelMultiplier: 1.15, // empurrão por giro da roda
      touchMultiplier: 1.5,
      smoothWheel: true,
      syncTouch: false, // toque permanece nativo (sem inércia lunar no mobile)
    });

    setLenis(lenis); // disponibiliza p/ scroll-to-top do logo, etc.

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      setLenis(null);
      lenis.destroy();
    };
  }, []);

  return null;
}
