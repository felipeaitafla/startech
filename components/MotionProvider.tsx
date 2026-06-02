"use client";

import { MotionConfig } from "framer-motion";

/* reducedMotion="user": quem ativou "reduzir movimento" no sistema
   recebe o conteúdo já assentado (sem deslocamento/escala), preservando
   acessibilidade. Os demais veem a entrada flutuante. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
