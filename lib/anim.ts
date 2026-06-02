import type { Variants, Transition } from "framer-motion";

/* ============================================================
   ANIMAÇÕES — "gravidade zero"
   Entrada flutuante: spring de baixa rigidez (overshoot suave),
   leve subida + escala + blur que se dissolve. Os elementos
   "assentam" devagar, como sem peso.
   ============================================================ */

// Spring frouxo = sensação de flutuar / inércia.
const floatSpring: Transition = {
  type: "spring",
  stiffness: 42,
  damping: 16,
  mass: 1.1,
};

// Container: orquestra a entrada dos filhos em cascata.
export const stagger: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.14, delayChildren: 0.12 },
  },
};

// Item: sobe flutuando e foca.
export const floatUp: Variants = {
  hidden: { opacity: 0, y: 56, scale: 0.96, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: floatSpring,
  },
};

// Bob contínuo, infinito — a deriva sutil de algo sem gravidade.
// `delay` desincroniza os elementos pra não pulsarem juntos.
export function drift(delay = 0, distance = 8, duration = 6) {
  return {
    y: [0, -distance, 0],
    transition: {
      duration,
      delay,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  };
}
