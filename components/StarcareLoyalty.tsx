import Image from "next/image";
import { ArrowUpRight, Recycle, Headset, type LucideIcon } from "lucide-react";
import { starcare, whatsappLink } from "@/content/site";

const benefitIcons: Record<"recycle" | "support", LucideIcon> = {
  recycle: Recycle,
  support: Headset,
};

/* Seção Startech Care — programa de fidelidade. Card central de largura média
   (não ocupa a tela toda), borda sutil. Server component, sem JS. */
export function StarcareLoyalty() {
  const { logo, title, cta, benefits } = starcare;

  return (
    <section className="px-[var(--layout-margin)] py-[var(--layout-padding-y)]">
      <div className="mx-auto flex w-full max-w-[840px] flex-col gap-8 rounded-big border border-white-8 bg-azul-escuro/40 p-8 md:p-12">
        {/* topo: logo (esq) + chamada (dir), lado a lado e centralizados na vertical */}
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <Image
            src={logo.src}
            alt={logo.alt}
            width={320}
            height={120}
            className="h-28 w-auto md:h-36"
          />
          <div className="flex flex-col items-center gap-2 text-center sm:items-end sm:text-right">
            <p className="text-h3 font-medium text-white">{title}</p>
            <a
              href={whatsappLink(cta.message)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-link"
            >
              {cta.label}
              <ArrowUpRight className="size-4" strokeWidth={2.25} />
            </a>
          </div>
        </div>

        {/* base: dois cards de benefício, largura igual */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {benefits.map((b) => {
            const Icon = benefitIcons[b.icon];
            return (
              <div
                key={b.icon}
                className="flex flex-col gap-4 rounded-big border border-white-8 bg-azul-capri/15 p-8 shadow-[0_14px_36px_rgba(0,0,0,0.2)]"
              >
                <span className="text-azul-capri">
                  <Icon className="size-10" strokeWidth={1.75} />
                </span>
                <p className="text-body2 text-white/60">{b.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
