"use client";

import { motion } from "framer-motion";
import { nav } from "@/content/site";
import { Logo } from "./Logo";
import { WhatsAppButton } from "./WhatsAppButton";
import { stagger, floatUp } from "@/lib/anim";

/* ícones brancos vindos de /public (svg já em branco) */
const socialIcons: Record<string, string> = {
  instagram: "/insta.svg",
  youtube: "/youtueb.svg",
};

export function Header() {
  return (
    <motion.header
      initial="hidden"
      animate="show"
      variants={stagger}
      className="fixed inset-x-0 top-0 z-30 border-b border-white-8 bg-black/30 backdrop-blur-lg"
    >
      <nav className="relative mx-auto flex items-center justify-between px-[var(--layout-margin)] py-6">
        {/* esquerda — redes sociais */}
        <motion.div variants={floatUp} className="flex items-center gap-4">
          {nav.social.map((s) => (
            <a
              key={s.label}
              href={s.href}
              aria-label={s.label}
              className="opacity-80 transition-opacity hover:opacity-100"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={socialIcons[s.icon]} alt={s.label} className="h-5 w-auto" />
            </a>
          ))}
        </motion.div>

        {/* centro — logo */}
        <motion.div
          variants={floatUp}
          className="pointer-events-none absolute left-1/2 -translate-x-1/2"
        >
          <Logo className="pointer-events-auto" />
        </motion.div>

        {/* direita — CTA (continua no mesmo lugar) */}
        <motion.div variants={floatUp} className="flex items-center">
          <WhatsAppButton
            message={nav.cta.message}
            label={nav.cta.label}
            size="sm"
            labelClassName="hidden sm:inline"
          />
        </motion.div>
      </nav>
    </motion.header>
  );
}
