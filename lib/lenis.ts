import type Lenis from "lenis";

/* Ponte p/ a instância do Lenis (criada em components/SmoothScroll.tsx).
   Permite que outros componentes (ex.: o logo do Header) façam scroll suave
   pelo mesmo motor — mantendo a "gravidade da lua" — sem prop drilling. */
let lenisInstance: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenisInstance = instance;
}

/* Sobe ao topo da página. Usa o Lenis (scroll suave/lunar) quando ativo;
   senão, cai no scroll nativo (ex.: "reduzir movimento"). */
export function scrollToTop() {
  if (lenisInstance) {
    lenisInstance.scrollTo(0, { duration: 1.6 });
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}
