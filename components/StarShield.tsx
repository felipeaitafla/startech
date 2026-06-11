"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { starshield } from "@/content/site";
import { WhatsAppButton } from "./WhatsAppButton";
import { stagger, floatUp } from "@/lib/anim";

/* Seção StarShield — grade vertical de cards (fundo em gradiente azul-capri `.ss-card`,
   texto branco), sobre o site escuro. Client component p/ a entrada em CASCATA: o
   container interno é um `stagger` (whileInView) e cada card é um item `floatUp` —
   mesma estética da Hero, só que disparada ao chegar no scroll. A linha "duo" é um
   stagger aninhado (os 2 cards entram em sequência). Imagens via next/image em
   **proporção original** (w-full h-auto, sem crop), com inset p-4.
   ⚠️ Self-reveal: NÃO envolver em <Reveal> no page.tsx (animaria 2×). */
export function StarShield() {
  const { hero, wide, cta } = starshield;

  return (
    <section className="px-[var(--layout-margin)] py-[var(--layout-padding-y)]">
      <motion.div
        className="mx-auto flex w-full max-w-[var(--layout-max)] flex-col gap-6"
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
      >
        {/* ---------- Card hero (full width, 2 lados, altura menor) ---------- */}
        <motion.div
          variants={floatUp}
          className="group relative grid grid-cols-1 overflow-hidden rounded-big border border-white-8 ss-card hover:z-10 hover:scale-[1.02] md:grid-cols-2"
        >
          <div className="flex flex-col justify-center gap-4 p-8 md:p-12">
            <h3 className="text-h3 md:text-h2 max-w-[16ch] font-medium text-white">
              {hero.title}
            </h3>
            <Image
              src={hero.logo.src}
              alt={hero.logo.alt}
              width={hero.logo.width}
              height={hero.logo.height}
              className="h-7 w-auto self-start md:h-9"
            />
          </div>
          <div className="flex items-center p-4">
            <Image
              src={hero.image.src}
              alt={hero.image.alt}
              width={hero.image.width}
              height={hero.image.height}
              sizes="(min-width: 768px) 50vw, 100vw"
              className="h-auto w-full rounded-medium"
            />
          </div>
        </motion.div>

        {/* ---------- Cards largos (Lens, Matte, Capinhas) ---------- */}
        {wide.map((card) => (
          <motion.div
            key={card.title}
            variants={floatUp}
            className="relative grid grid-cols-1 overflow-hidden rounded-big border border-white-8 ss-card hover:z-10 hover:scale-[1.02] md:grid-cols-2"
          >
            <div className="flex flex-col justify-center gap-2 p-8 md:p-12">
              <h3 className="text-h3 font-medium text-white">{card.title}</h3>
              <p className="text-lead max-w-[48ch] text-white/73">
                {card.description}
              </p>
            </div>
            <div className="flex items-center p-4">
              <Image
                src={card.image.src}
                alt={card.image.alt}
                width={card.image.width}
                height={card.image.height}
                sizes="(min-width: 768px) 50vw, 100vw"
                className="h-auto w-full rounded-medium"
              />
            </div>
          </motion.div>
        ))}

        {/* ---------- CTA ---------- */}
        <motion.div variants={floatUp} className="mt-10 flex justify-center">
          <WhatsAppButton message={cta.message} label={cta.label} />
        </motion.div>
      </motion.div>
    </section>
  );
}
