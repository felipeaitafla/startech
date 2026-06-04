"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  Smartphone,
  CreditCard,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { hero } from "@/content/site";
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
    <section className="relative flex h-screen flex-col items-center justify-center overflow-hidden px-[var(--layout-margin)] pt-24">
      <motion.div
        initial="hidden"
        animate="show"
        variants={stagger}
        className="flex flex-col items-center text-center"
      >
        <motion.h1
          variants={floatUp}
          className="text-h2 md:text-h1 max-w-[20ch] text-balance text-white md:max-w-[32ch]"
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
          <a href={hero.cta.href} className="btn">
            {hero.cta.label}
          </a>
        </motion.div>

        <motion.ul
          variants={stagger}
          className="relative z-10 mt-32 flex flex-wrap justify-center gap-6"
        >
        {hero.features.flatMap((feature, i) => {
          const Icon = featureIcons[feature.icon];
          const item = (
            <motion.li key={feature.text} variants={floatUp}>
              <div className="flex items-center gap-4">
                <span className="shrink-0 text-azul-capri">
                  <Icon className="size-6" strokeWidth={1.75} />
                </span>
                <p
                  className="text-body2 font-light text-left text-white/80"
                  style={{ maxWidth: feature.textWidth }}
                >
                  {feature.text}
                </p>
              </div>
            </motion.li>
          );
          if (i === 0) return [item];
          return [
            <motion.li key={`div-${i}`} variants={floatUp} className="flex items-center">
              <div className="h-8 w-px bg-white/20" />
            </motion.li>,
            item,
          ];
        })}
        </motion.ul>
      </motion.div>
    </section>
  );
}
