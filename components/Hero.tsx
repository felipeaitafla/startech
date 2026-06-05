"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  Smartphone,
  CreditCard,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { hero, whatsappLink } from "@/content/site";
import { stagger, floatUp } from "@/lib/anim";
import type { FeatureIcon } from "@/content/site";

const featureIcons: Record<FeatureIcon, LucideIcon> = {
  warranty: ShieldCheck,
  loan: Smartphone,
  installments: CreditCard,
  support: Wrench,
};

export function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-[var(--layout-margin)] pt-28 pb-16 md:h-screen md:pt-24 md:pb-0">
      <motion.div
        initial="hidden"
        animate="show"
        variants={stagger}
        className="flex flex-col items-center text-center"
      >
        <motion.h1
          variants={floatUp}
          className="text-h2 md:text-h1 max-w-[20ch] text-balance font-bold leading-[0.95] text-white md:max-w-[32ch]"
        >
          {hero.title}
        </motion.h1>

        <motion.p
          variants={floatUp}
          className="text-body2 mt-6 max-w-[64ch] text-white/65"
        >
          {hero.subtitle}
        </motion.p>

        <motion.div variants={floatUp} className="mt-8">
          <a
            href={whatsappLink(hero.cta.message)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
          >
            {hero.cta.label}
          </a>
        </motion.div>

        <motion.ul
          variants={stagger}
          className="relative z-10 mt-16 flex flex-col items-center justify-center gap-6 md:mt-32 md:flex-row md:flex-wrap"
        >
        {hero.features.flatMap((feature, i) => {
          const Icon = featureIcons[feature.icon];
          const item = (
            <motion.li key={feature.text} variants={floatUp}>
              {/* mobile: ícone em cima + texto centralizado · desktop: ícone à esquerda */}
              <div className="flex flex-col items-center gap-2 text-center md:flex-row md:gap-4 md:text-left">
                <span className="shrink-0 text-azul-capri">
                  <Icon className="size-6" strokeWidth={1.75} />
                </span>
                <p
                  className="text-body2 font-light text-white/80"
                  style={{ maxWidth: feature.textWidth }}
                >
                  {feature.text}
                </p>
              </div>
            </motion.li>
          );
          if (i === 0) return [item];
          return [
            // separador: horizontal (embaixo) no mobile · vertical no desktop
            <motion.li key={`div-${i}`} variants={floatUp} className="flex items-center justify-center">
              <div className="h-px w-16 bg-white/20 md:h-8 md:w-px" />
            </motion.li>,
            item,
          ];
        })}
        </motion.ul>
      </motion.div>
    </section>
  );
}
