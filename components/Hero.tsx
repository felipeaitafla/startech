"use client";

import { motion } from "framer-motion";
import {
  BatteryCharging,
  Smartphone,
  CreditCard,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { hero } from "@/content/site";
import { stagger, floatUp, drift } from "@/lib/anim";
import type { FeatureIcon } from "@/content/site";

const featureIcons: Record<FeatureIcon, LucideIcon> = {
  battery: BatteryCharging,
  loan: Smartphone,
  installments: CreditCard,
  support: Wrench,
};

export function Hero() {
  return (
    <section className="hero-bg relative flex min-h-screen flex-col overflow-hidden px-[var(--layout-margin)]">
      {/* conteúdo central */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={stagger}
        className="flex flex-1 flex-col items-center justify-center pt-32 text-center"
      >
        <motion.h1
          variants={floatUp}
          className="text-h2 md:text-h1 max-w-[20ch] text-balance text-white md:max-w-[32ch]"
        >
          {hero.title}
        </motion.h1>

        <motion.p
          variants={floatUp}
          className="text-body2 mt-6 max-w-[46ch] text-balance text-white/65"
        >
          {hero.subtitle}
        </motion.p>

        <motion.div variants={floatUp} className="mt-8">
          <a href={hero.cta.href} className="btn">
            {hero.cta.label}
          </a>
        </motion.div>
      </motion.div>

      {/* cards de features na base */}
      <motion.ul
        initial="hidden"
        animate="show"
        variants={stagger}
        className="relative z-10 mb-[var(--layout-padding-y)] grid grid-cols-1 gap-px overflow-hidden rounded-medium border border-white-8 bg-white-8 backdrop-blur-sm sm:grid-cols-2 lg:grid-cols-4"
      >
        {hero.features.map((feature, i) => {
          const Icon = featureIcons[feature.icon];
          return (
            <motion.li
              key={feature.text}
              variants={floatUp}
              className="bg-black/20 px-5 py-6"
            >
              <motion.div
                animate={drift(i * 0.6)}
                className="flex items-start gap-3"
              >
                <span className="shrink-0 text-azul-capri">
                  <Icon className="size-5" strokeWidth={1.75} />
                </span>
                <p className="text-body2 text-white/70">{feature.text}</p>
              </motion.div>
            </motion.li>
          );
        })}
      </motion.ul>
    </section>
  );
}
