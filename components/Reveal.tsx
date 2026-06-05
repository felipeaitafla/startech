"use client";

import { motion } from "framer-motion";
import { floatUp } from "@/lib/anim";

/* Reveal — faz a seção "entrar na tela" como o conteúdo da Hero: a mesma
   entrada flutuante (`floatUp`: sobe + escala + blur→nítido, spring frouxo de
   gravidade zero), só que disparada por SCROLL em vez de no load.

   `whileInView` + `viewport={{ once: true }}`: anima uma única vez quando ~20%
   da seção entra na viewport. Respeita "reduzir movimento" via MotionConfig
   (reducedMotion="user") — quem ativou recebe o conteúdo já assentado.

   Envolve cada <Section/> no page.tsx como uma unidade. (Server components
   podem ser passados como children deste client component normalmente.) */
export function Reveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={floatUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </motion.div>
  );
}
