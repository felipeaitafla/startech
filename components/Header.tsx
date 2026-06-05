"use client";

import { motion } from "framer-motion";
import { nav } from "@/content/site";
import { Logo } from "./Logo";
import { WhatsAppButton } from "./WhatsAppButton";
import { stagger, floatUp } from "@/lib/anim";
import { scrollToTop } from "@/lib/lenis";

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
      {/* grid 3 colunas no desktop (redes | logo | cta) -> centra o logo via
          justify-self (sem absolute/transform, que conflitaria com o transform
          inline do framer-motion). No mobile vira 1 coluna e só o logo aparece. */}
      <nav className="mx-auto grid grid-cols-1 items-center px-[var(--layout-margin)] py-6 md:grid-cols-3">
        {/* esquerda — redes sociais (escondidas no mobile) */}
        <motion.div
          variants={floatUp}
          className="hidden items-center gap-4 md:flex md:justify-self-start"
        >
          {nav.social.map((s) => (
            <a
              key={s.label}
              href={s.href}
              aria-label={s.label}
              className="opacity-80 transition-opacity ease-in-out hover:opacity-100"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={socialIcons[s.icon]} alt={s.label} className="h-5 w-auto" />
            </a>
          ))}
        </motion.div>

        {/* centro — logo (botão p/ subir ao topo) */}
        <motion.div variants={floatUp} className="justify-self-center">
          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Voltar ao topo"
            className="block cursor-pointer"
          >
            <Logo />
          </button>
        </motion.div>

        {/* direita — CTA (escondido no mobile) */}
        <motion.div
          variants={floatUp}
          className="hidden items-center md:flex md:justify-self-end"
        >
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
